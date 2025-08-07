//forgotpassword.tsx
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { supabase } from '../lib/supabase';


export default function ForgotPasswordScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
  const emailTrimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
    Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
    return;
  }

  setLoading(true);

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
      redirectTo: 'https://your-app-url.com/update-password', // غيّر هذا لاحقًا حسب عنوان التطبيق
    });

    if (error) {
      throw error;
    }

    Alert.alert(
      'تم الإرسال',
      'إذا كان البريد الذي أدخلته مرتبطًا بحساب، ستتلقى رسالة لإعادة تعيين كلمة المرور.'
    );
    router.back();
  } catch (error: any) {
    console.log('Reset password error:', error.message);

    Alert.alert(
      'فشل في إرسال الرابط',
      'حدث خطأ أثناء محاولة إرسال رابط إعادة تعيين كلمة المرور. حاول مرة أخرى لاحقًا.'
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign
            name="arrowleft"
            size={24}
            color={isDark ? '#fff' : '#4a90e2'}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          نسيت كلمة المرور
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="أدخل بريدك الإلكتروني"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          returnKeyType="done"
          onSubmitEditing={handleReset}
        />

        <TouchableOpacity
          style={[styles.resetButton, loading && { opacity: 0.7 }]}
          onPress={handleReset}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'جاري الإرسال...' : 'إعادة تعيين كلمة المرور'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingHorizontal: 30,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#4a90e2',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#1e90ff',
    width: '100%',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
