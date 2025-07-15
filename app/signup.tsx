import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; // Google
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    // Regex بسيط لفحص البريد
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // إذا البريد صحيح → انتقل للصفحة التالية مع الباراميتر
    router.push({
      pathname: '/signupdetails',
      params: { email }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Title */}
      <Text style={styles.header}>إنشاء حساب</Text>

      {/* Email input */}
      <TextInput
        textAlign='right'
        placeholder="البريد الالكتروني"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#4a90e2"
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>الاستمرار</Text>
      </TouchableOpacity>

      {/* Already have account */}
      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}> تسجيل الدخول</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>لديك حساب بالفعل ؟</Text>
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>أو</Text>
        <View style={styles.divider} />
      </View>

      {/* Social buttons */}
      <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
        <FontAwesome name="google" size={20} color="#000" style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>الاستمرار بواسطة Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
        <MaterialCommunityIcons name="facebook" size={20} color="#000" style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>الاستمرار بواسطة Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
        <AntDesign name="apple1" size={20} color="#000" style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>الاستمرار بواسطة Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
        <Entypo name="phone" size={20} color="#000" style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>الاستمرار بواسطة رقم هاتف</Text>
      </TouchableOpacity>

      {/* Footer links */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>الشروط والأحكام</Text>
        </TouchableOpacity>
        <Text style={styles.footerDivider}> | </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>سياسة الخصوصية</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
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
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#000',
    width: '100%',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 8,
    color: '#666',
    fontSize: 12,
  },
  socialButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerLink: {
    fontSize: 12,
    color: '#666',
  },
  footerDivider: {
    color: '#666',
    marginHorizontal: 5,
  },
});
