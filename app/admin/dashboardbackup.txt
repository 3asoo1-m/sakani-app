import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/useAuth';

export default function Dashboard() {
  const user = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // البريد الإلكتروني للأدمن
  const ADMIN_EMAIL = 'admin@example.com';

  // حقول الشقة
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'available' | 'unavailable'>('available');
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      Alert.alert('تنبيه', 'يرجى تسجيل الدخول للوصول للأدمن');
      router.replace('/login');
      return;
    }
    if (user.email !== ADMIN_EMAIL) {
      Alert.alert('تنبيه', 'ليس لديك صلاحية للوصول إلى لوحة الأدمن');
      router.replace('/');
      return;
    }
    setLoading(false);
  }, [user]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => ({ uri: asset.uri }));
      setImages(selected.slice(0, 5));
    }
  };

  const uploadApartment = async () => {
    if (!title || !city || !price) {
      Alert.alert('خطأ', 'يرجى ملء الحقول الأساسية');
      return;
    }
    setUploading(true);

    try {
      const { data: apartmentData, error: insertError } = await supabase
        .from('apartments')
        .insert([{
          title,
          city,
          price: parseFloat(price),
          beds: parseInt(beds || '0'),
          baths: parseInt(baths || '0'),
          area: parseFloat(area || '0'),
          description,
          status,
        }])
        .select()
        .single();

      if (insertError || !apartmentData) throw insertError;

      const apartmentId = apartmentData.id;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const response = await fetch(img.uri);
        const blob = await response.blob();

        const fileExt = img.uri.split('.').pop();
        const fileName = `image-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('apartments')
          .upload(`apartment-${apartmentId}/${fileName}`, blob, { upsert: true });

        if (uploadError) console.log('Error uploading image:', uploadError);
      }

      Alert.alert('نجاح', 'تم إضافة الشقة بنجاح!');
      setTitle(''); setCity(''); setPrice(''); setBeds('');
      setBaths(''); setArea(''); setDescription(''); setStatus('available'); setImages([]);
    } catch (error) {
      console.log(error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة الشقة');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>عنوان الشقة</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>المدينة</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>السعر (شيكل / شهر)</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>عدد الأسرة</Text>
      <TextInput style={styles.input} value={beds} onChangeText={setBeds} keyboardType="numeric" />

      <Text style={styles.label}>عدد الحمامات</Text>
      <TextInput style={styles.input} value={baths} onChangeText={setBaths} keyboardType="numeric" />

      <Text style={styles.label}>المساحة (متر²)</Text>
      <TextInput style={styles.input} value={area} onChangeText={setArea} keyboardType="numeric" />

      <Text style={styles.label}>الوصف</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>حالة الشقة</Text>
      <Picker selectedValue={status} onValueChange={(val) => setStatus(val)}>
        <Picker.Item label="متاحة" value="available" />
        <Picker.Item label="غير متاحة" value="unavailable" />
      </Picker>

      <Text style={styles.label}>صور الشقة (حتى 5 صور)</Text>
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Text style={styles.buttonText}>اختر الصور</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={{ marginVertical: 8 }}>
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img.uri }} style={styles.previewImage} />
        ))}
      </ScrollView>

      <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={uploadApartment} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>إضافة الشقة</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 12, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginTop: 4, textAlign: 'right' },
  button: { backgroundColor: '#1D9BF0', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
});
