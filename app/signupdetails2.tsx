import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignUpPasswordScreen() {
  const router = useRouter();
  const {
    email,
    fullname,
    birthday,
    city,
    isStudent,
    universityName = 'No uni',
  } = useLocalSearchParams();

  // دالة عامة لفك الترميز مع التعامل مع array
  const getStringParam = (param: string | string[] | undefined): string => {
    if (!param) return '';
    if (Array.isArray(param)) return param[0];
    return param;
  };

  // فك ترميز القيم
  const emailDecoded = decodeURIComponent(getStringParam(email));
  const fullnameDecoded = decodeURIComponent(getStringParam(fullname));
  const birthdayDecoded = decodeURIComponent(getStringParam(birthday));
  const cityDecoded = decodeURIComponent(getStringParam(city));
const isStudentDecoded = decodeURIComponent(getStringParam(isStudent)) === 'true';
  const universityNameDecoded = decodeURIComponent(getStringParam(universityName));

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // حالتان لإظهار/إخفاء كلمة المرور منفصلتان لكل حقل
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);

  const validatePassword = (password: string): string | null=> {
    if (password.length < 8) {
      return 'يجب ان تكون كلمة المرور 8 أحرف على الأقل';
    }
    if (!/[A-Z]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل';
    }
    if (!/[a-z]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل';
    }
    if (!/[0-9]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل';
    }
    return null;
  }
  const handleSignUp = async () => {
    // التحقق من البيانات الأساسية
    if (!emailDecoded || !fullnameDecoded || !birthdayDecoded || !cityDecoded) {
      Alert.alert('خطأ', 'بيانات التسجيل غير كاملة، يرجى العودة وتعبئة جميع الخطوات.');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى تعبئة كل الحقول');
      return;
    }

    const errorMessage = validatePassword(password);
    if (errorMessage) {
      Alert.alert('كلمة المرور غير صالحة', errorMessage);
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('عدم تطابق', 'كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
      email: emailDecoded,
      password,
    });

    if (signUpError) throw signUpError;

    const user = data.user;
    if (!user) throw new Error('فشل إنشاء المستخدم');

    // إضافة معلومات إضافية في جدول users
    const { error: dbError } = await supabase.from('users').insert({
      id: user.id,
      fullname: fullnameDecoded,
      birthday: birthdayDecoded,
      city: cityDecoded,
      isStudent: isStudentDecoded,
      universityName: universityNameDecoded,
      email: emailDecoded,
      createdAt: new Date().toISOString(),
    });

    if (dbError) throw dbError;

    Alert.alert('تم', 'تم إنشاء الحساب بنجاح');
    router.replace('/login');
  } catch (error: any) {
    console.error(error);
    Alert.alert('خطأ', error.message || 'حدث خطأ أثناء إنشاء الحساب');
  } finally {
    setLoading(false);
  }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={isDark ? '#fff' : '#4a90e2'} />
        </TouchableOpacity>

        <Text style={styles.title}>كلمة المرور</Text>

        {/* كلمة المرور */}
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="كلمة المرور"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            textContentType="newPassword"
            autoComplete="password-new"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}
          >
            <Text style={{ color: isDark ? '#4a90e2' : '#0066cc', fontWeight: '600' }}>
              {showPassword ? 'إخفاء' : 'عرض'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* تأكيد كلمة المرور */}
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="تأكيد كلمة المرور"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            textContentType="password"
            autoComplete="password"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.showPasswordButton}
          >
            <Text style={{ color: isDark ? '#4a90e2' : '#0066cc', fontWeight: '600' }}>
              {showConfirmPassword ? 'إخفاء' : 'عرض'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signUpButton, loading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.signUpButtonText}>إنشاء الحساب</Text>
          )}
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
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1.5,
      borderColor: isDark ? '#444' : '#4a90e2',
      borderRadius: 25,
      height: 50,
      paddingHorizontal: 20,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#222' : '#fff',
    },
    showPasswordButton: {
      paddingHorizontal: 12,
    },
    signUpButton: {
      backgroundColor: isDark ? '#1a73e8' : '#000',
      width: '100%',
      borderRadius: 25,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
  });
