import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default function SignupInfoScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleContinue = () => {
    if (!fullName || !birthday) {
      alert('يرجى تعبئة جميع الحقول');
      return;
    }

    router.push('/signupdetails1'); // اسم الصفحة التالية
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#4a90e2" />
        </TouchableOpacity>

        <Text style={styles.title}>أخبرنا عنك</Text>

        <TextInput
          style={styles.input}
          placeholder="الاسم الكامل"
          value={fullName}
          onChangeText={setFullName}
          returnKeyType="done"
        />

        <TextInput
          style={styles.input}
          placeholder="تاريخ الميلاد (مثلاً: 2005/08/05)"
          value={birthday}
          onChangeText={setBirthday}
          keyboardType="numeric"
          returnKeyType="done"
        />

        {/* زر استمرار */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>استمرار</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
