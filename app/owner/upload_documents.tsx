import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// استيراد المكتبات الضرورية للرفع الفعلي
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../lib/supabase';

export default function UploadDocumentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { phone } = useLocalSearchParams();

  const [idImage, setIdImage] = useState<string | null>(null);
  const [ownershipImage, setOwnershipImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const backgroundColor = isDarkMode ? '#121212' : '#f9f9f9';
  const textColor = isDarkMode ? '#fff' : '#222';
  const cardBackgroundColor = isDarkMode ? '#1e1e1e' : '#fff';
  const buttonBackgroundColor = '#1E90FF';
  const buttonTextColor = '#fff';
  const uploadButtonBg = isDarkMode ? '#333' : '#f0f0f0';

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('الصلاحية مطلوبة', 'نحتاج إلى صلاحية الوصول إلى الصور لرفع المستندات.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!idImage || !ownershipImage) {
      Alert.alert('الحقول ناقصة', 'يرجى رفع صورة الهوية وإثبات الملكية.');
      return;
    }

    setLoading(true);

    try {
      // 1. الحصول على هوية المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('المستخدم غير مسجل دخوله. يرجى تسجيل الدخول مرة أخرى.');

      // 2. رفع صورة الهوية
      const idImageType = idImage.split('.').pop() || 'jpg';
      const idImageBase64 = await FileSystem.readAsStringAsync(idImage, { encoding: 'base64' });
      const idImagePath = `${user.id}/id_card.${idImageType}`;
      const { error: uploadIdError } = await supabase.storage
        .from('verification_files')
        .upload(idImagePath, decode(idImageBase64), { 
          contentType: `image/${idImageType}`,
          upsert: true, // للسماح باستبدال الملف إذا كان موجوداً
        });
      if (uploadIdError) throw new Error(`فشل رفع صورة الهوية: ${uploadIdError.message}`);

      // 3. رفع إثبات الملكية
      const ownerImageType = ownershipImage.split('.').pop() || 'jpg';
      const ownerImageBase64 = await FileSystem.readAsStringAsync(ownershipImage, { encoding: 'base64' });
      const ownerImagePath = `${user.id}/ownership_proof.${ownerImageType}`;
      const { error: uploadOwnerError } = await supabase.storage
        .from('verification_files')
        .upload(ownerImagePath, decode(ownerImageBase64), { 
          contentType: `image/${ownerImageType}`,
          upsert: true,
        });
      if (uploadOwnerError) throw new Error(`فشل رفع إثبات الملكية: ${uploadOwnerError.message}`);

      // 4. الحصول على الروابط العامة للصور
      const { data: idUrlData } = supabase.storage.from('verification_files').getPublicUrl(idImagePath);
      const { data: ownerUrlData } = supabase.storage.from('verification_files').getPublicUrl(ownerImagePath);

      // 5. تحديث جدول profiles بالبيانات الجديدة
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone_number: phone,
          id_image_url: idUrlData.publicUrl,
          proof_image_url: ownerUrlData.publicUrl,
          role: 'owner_pending_approval', // تحديث دور المستخدم
          verification_status: 'pending_review', // تحديث حالة التحقق
        })
        .eq('id', user.id);
      if (updateError) throw new Error(`فشل تحديث الملف الشخصي: ${updateError.message}`);

      Alert.alert(
        'تم استلام طلبك بنجاح',
        'سيقوم فريقنا بمراجعة المستندات والرد عليك في أقرب وقت ممكن.'
      );
      router.replace('../../tabs/profile'); // العودة إلى شاشة الملف الشخصي

    } catch (error: any) {
      Alert.alert('حدث خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color={textColor} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Feather name="upload-cloud" size={40} color={buttonBackgroundColor} />
            <Text style={[styles.title, { color: textColor }]}>رفع المستندات</Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
              الخطوة الأخيرة! يرجى رفع صور واضحة لمستنداتك.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.uploadLabel, { color: textColor }]}>1. صورة الهوية الشخصية</Text>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: uploadButtonBg }]}
              onPress={() => pickImage(setIdImage)}
            >
              {idImage ? (
                <Image source={{ uri: idImage }} style={styles.previewImage} />
              ) : (
                <>
                  <Feather name="image" size={24} color="#888" />
                  <Text style={styles.uploadButtonText}>اضغط هنا للاختيار</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={[styles.uploadLabel, { color: textColor }]}>2. إثبات ملكية السكن</Text>
            <Text style={[styles.uploadHint, { color: isDarkMode ? '#999' : '#777' }]}>
              (مثل: فاتورة خدمات حديثة، عقد ملكية، إلخ)
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: uploadButtonBg }]}
              onPress={() => pickImage(setOwnershipImage)}
            >
              {ownershipImage ? (
                <Image source={{ uri: ownershipImage }} style={styles.previewImage} />
              ) : (
                <>
                  <Feather name="file-text" size={24} color="#888" />
                  <Text style={styles.uploadButtonText}>اضغط هنا للاختيار</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: buttonBackgroundColor }, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={buttonTextColor} />
            ) : (
              <>
                <Text style={[styles.submitButtonText, { color: buttonTextColor }]}>إرسال الطلب للمراجعة</Text>
                <Feather name="check-circle" size={22} color={buttonTextColor} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// ... (الأنماط styles تبقى كما هي)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'right',
  },
  uploadHint: {
    fontSize: 13,
    textAlign: 'right',
    marginBottom: 10,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  uploadButtonText: {
    marginTop: 8,
    color: '#888',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  submitButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
