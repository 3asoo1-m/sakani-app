import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
import { auth } from '../lib/firebase'; // عدل المسار حسب مكان ملف firebase.js

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const styles = getStyles(isDark);

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
    await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح!');
    router.replace('/tabs/home');
  } catch (error: any) {
    console.log('Firebase auth error:', error);

    if (error.code === 'auth/user-disabled') {
      router.replace('/account-disabled');
      return;
    }

    let message = 'حدث خطأ غير متوقع. حاول مرة أخرى.';

    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'البريد الإلكتروني غير صالح.';
    }

    Alert.alert('فشل في تسجيل الدخول', message);
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={isDark ? '#fff' : '#4a90e2'} />
        </TouchableOpacity>

        <Text style={styles.title}>تسجيل الدخول</Text>

        <TextInput
  style={[
    styles.input,
    emailError ? { borderColor: 'red' } : {},
  ]}
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
{emailError ? (
  <Text style={styles.errorText}>{emailError}</Text>
) : null}

        <TextInput
  style={[
    styles.input,
    passwordError ? { borderColor: 'red' } : {},
  ]}
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
{passwordError ? (
  <Text style={styles.errorText}>{passwordError}</Text>
) : null}

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
          <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
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
      fontSize: 14,
      fontWeight: '500',
    },
    errorText: {
  color: 'red',
  fontSize: 13,
  marginTop: -15,
  marginBottom: 10,
  alignSelf: 'flex-start',
},
  });
