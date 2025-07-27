import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../lib/firebase'; // تأكد من صحة المسارات

const ADMIN_UID = 'VqQRuK0k6sf5XAqirtMccNIxOaR2';

export default function AdminScreen() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid === ADMIN_UID) {
        setIsAdmin(true);
      }
      setChecked(true);
    });

    return () => unsubscribe();
  }, []);
  const handleAddHousing = async () => {
    if (!title || !city || !price) {
      Alert.alert('الرجاء تعبئة جميع الحقول المطلوبة.');
      return;
    }

    try {
      await addDoc(collection(db, 'housings'), {
        title,
        description,
        city,
        price: Number(price),
        imageUrl,
        available,
        createdAt: serverTimestamp(),
      });

      Alert.alert('تمت إضافة السكن بنجاح!');
      // إعادة تعيين الحقول
      setTitle('');
      setDescription('');
      setCity('');
      setPrice('');
      setImageUrl('');
      setAvailable(true);
    } catch (error) {
      console.error(error);
      Alert.alert('حدث خطأ أثناء الإضافة');
    }
    
  };

  if (!checked) return <Text style={styles.loading}>جاري التحقق من الصلاحيات...</Text>;
  if (!isAdmin) return <Text style={styles.error}>ليس لديك صلاحية الوصول.</Text>;

  return (
    <SafeAreaView style={{flex: 1}}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>إضافة سكن جديد</Text>

      <TextInput style={styles.input} placeholder="عنوان السكن" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="الوصف" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="المدينة" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="السعر الشهري" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="رابط الصورة (اختياري)" value={imageUrl} onChangeText={setImageUrl} />

      <Button title={available ? 'السكن متاح' : 'السكن غير متاح'} onPress={() => setAvailable(!available)} color={available ? 'green' : 'gray'} />
      <View style={{ marginTop: 20 }}>
        <Button title="إضافة السكن" onPress={handleAddHousing} />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 8, backgroundColor: '#fff'
  },
  error: { color: 'red', textAlign: 'center', marginTop: 30 },
  loading: { textAlign: 'center', marginTop: 30, fontSize: 16 },
});
