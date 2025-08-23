import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard, // 1. استيراد Keyboard
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback, // 2. استيراد المكون الذي يسمح بالضغط
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyOwnerScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [phoneNumber, setPhoneNumber] = useState('');

  // تحديد الألوان بناءً على الوضع
  const backgroundColor = isDarkMode ? '#121212' : '#f9f9f9';
  const textColor = isDarkMode ? '#fff' : '#222';
  const cardBackgroundColor = isDarkMode ? '#1e1e1e' : '#fff';
  const inputBackgroundColor = isDarkMode ? '#333' : '#f0f0f0';
  const inputBorderColor = isDarkMode ? '#555' : '#ddd';
  const buttonBackgroundColor = '#1E90FF';
  const buttonTextColor = '#fff';

  const handleContinue = () => {
    if (!phoneNumber.trim() || !/^\d+$/.test(phoneNumber)) {
      Alert.alert('خطأ', 'يرجى إدخال رقم هاتف صحيح.');
      return;
    }
    router.push({
      // ملاحظة: قمت بتصحيح المسار ليتوافق مع الهيكل الذي اتفقنا عليه
      pathname: '/owner/upload_documents', 
      params: { phone: phoneNumber },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {/* 3. KeyboardAvoidingView يغلف كل شيء */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 4. TouchableWithoutFeedback لإخفاء لوحة المفاتيح */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* زر الرجوع */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color={textColor} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Feather name="shield" size={40} color={buttonBackgroundColor} />
              <Text style={[styles.title, { color: textColor }]}>التحقق من حساب المالك</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
                نحتاج إلى بعض المعلومات الإضافية لتأمين حسابك وتفعيله كمالك.
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
              <Text style={[styles.inputLabel, { color: textColor }]}>رقم الهاتف</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackgroundColor,
                    borderColor: inputBorderColor,
                    color: textColor,
                  },
                ]}
                placeholder="مثال: 0599123456"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                textAlign="left"
              />
            </View>

            {/* زر المتابعة */}
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: buttonBackgroundColor }]}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={[styles.continueButtonText, { color: buttonTextColor }]}>
                متابعة إلى رفع المستندات
              </Text>
              <Feather name="chevron-left" size={22} color={buttonTextColor} />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // 5. تعديل بسيط على الـ container ليعمل بشكل أفضل مع TouchableWithoutFeedback
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    // تعديل بسيط لضمان ظهوره بشكل جيد مع SafeAreaView
    top: Platform.OS === 'ios' ? 40 : 20, 
    left: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
