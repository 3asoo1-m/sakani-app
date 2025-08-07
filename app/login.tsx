import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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

export default function LoginScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let hasError = false;

  if (!email || !emailRegex.test(email)) {
    setEmailError('يرجى إدخال بريد إلكتروني صحيح');
    hasError = true;
  } else {
    setEmailError('');
  }

  if (!password) {
    setPasswordError('يرجى إدخال كلمة المرور');
    hasError = true;
  } else {
    setPasswordError('');
  }

  if (hasError) return;

  setLoading(true);
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (signInError) {
      let message = 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.';
      if (signInError.message.includes('Invalid login credentials')) {
        message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      }
      if (signInError.message.includes('Email not confirmed')) {
        message = 'يرجى تأكيد البريد الإلكتروني قبل تسجيل الدخول.';
      }
      console.log(signInError);
      Alert.alert('خطأ في تسجيل الدخول', message);
      setLoading(false);
      return;
    }

    const user = signInData.user;
    console.log('User ID from auth:', user?.id);

    if (!user) {
      Alert.alert('خطأ', 'لم يتم العثور على المستخدم.');
      setLoading(false);
      return;
    }

    // ✅ تحقق أولًا من تأكيد البريد الإلكتروني
    if (!user.email_confirmed_at) {
      await supabase.auth.signOut();
      Alert.alert(
        'تأكيد البريد الإلكتروني',
        'يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد أو مجلد السبام.'
      );
      router.replace('/tabs/verify-email');
      setLoading(false);
      return;
    }

    // ✅ بعد التأكد من البريد، جلب بيانات المستخدم من جدول profiles
    const { data: userData, error: userDataError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userDataError) {
      console.error('Error fetching user data:', userDataError);
      Alert.alert('خطأ', 'تعذر تحميل بيانات المستخدم.');
      setLoading(false);
      return;
    }

    Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح!');
    console.log("USER DATA AFTER LOGIN:", JSON.stringify(user, null, 2));
    router.replace('/tabs/home');
  } catch (err) {
    console.error('Login error:', err);
    Alert.alert('خطأ غير متوقع', 'حدث خطأ غير متوقع. حاول مرة أخرى.');
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/signin')}>
          <AntDesign name="arrowleft" size={24} color={isDark ? '#fff' : '#4a90e2'} />
        </TouchableOpacity>

        <Text style={styles.title}>تسجيل الدخول</Text>

        <TextInput
          style={[styles.input, emailError ? { borderColor: 'red' } : {}]}
          placeholder="البريد الإلكتروني"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (text) setEmailError('');
          }}
          returnKeyType="next"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={[styles.input, passwordError ? { borderColor: 'red' } : {}]}
          placeholder="كلمة المرور"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (text) setPasswordError('');
          }}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>دخول</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
          <Text style={styles.forgotPasswordText}>هل نسيت كلمة المرور؟</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.forgotPasswordText}>ليس لديك حساب؟</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
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
      color: isDark ? '#fff' : '#000',
      marginBottom: 40,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      borderWidth: 1.5,
      borderColor: isDark ? '#444' : '#4a90e2',
      borderRadius: 25,
      height: 50,
      paddingHorizontal: 20,
      marginBottom: 20,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#222' : '#fff',
    },
    loginButton: {
      backgroundColor: isDark ? '#1e90ff' : '#000',
      width: '100%',
      borderRadius: 25,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    forgotPasswordText: {
      color: isDark ? '#4a90e2' : '#0066cc',
      margin: 7,
      fontSize: 14,
      fontWeight: '800',
    },
    errorText: {
      color: 'red',
      fontSize: 13,
      marginTop: -15,
      marginBottom: 10,
      alignSelf: 'flex-start',
    },
  });
