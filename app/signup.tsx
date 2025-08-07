//signup.tsx
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBackground = isDarkMode ? '#333' : '#fff';
  const inputBorderColor = emailError ? '#e74c3c' : isDarkMode ? '#555' : '#4a90e2';
  const buttonBackground = isDarkMode ? '#1a73e8' : '#000';
  const buttonTextColor = '#fff';
  const dividerColor = isDarkMode ? '#555' : '#ccc';
  const footerTextColor = isDarkMode ? '#aaa' : '#666';
  const socialButtonBackground = isDarkMode ? '#222' : '#fff';
  const socialButtonBorderColor = isDarkMode ? '#555' : '#ccc';
  const socialButtonTextColor = isDarkMode ? '#eee' : '#000';

  const arabicChars = /[\u0600-\u06FF]/;

  const handleContinue = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(emailTrimmed)) {
      setEmailError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    if (arabicChars.test(emailTrimmed)) {
      setEmailError('يرجى استخدام أحرف إنجليزية فقط في البريد الإلكتروني');
      return;
    }

    setEmailError('');
    setLoading(true);

    const encodedEmail = encodeURIComponent(emailTrimmed);

    // تأخير بسيط لمحاكاة تحميل
    setTimeout(() => {
      setLoading(false);
      router.push(`/signupdetails?email=${encodedEmail}`);
    }, 300);
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor }]} 
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.header, { color: textColor }]}>إنشاء حساب</Text>

      <TextInput
        textAlign='right'
        placeholder="البريد الالكتروني"
        placeholderTextColor={isDarkMode ? '#bbb' : '#4a90e2'}
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (emailError) setEmailError('');
        }}
        style={[
          styles.input, 
          { 
            backgroundColor: inputBackground, 
            borderColor: inputBorderColor, 
            color: textColor 
          }
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      {emailError ? (
        <Text style={{ color: '#e74c3c', alignSelf: 'flex-end', marginBottom: 10 }}>{emailError}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: buttonBackground }]}
        onPress={handleContinue}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={buttonTextColor} />
        ) : (
          <Text style={[styles.continueButtonText, { color: buttonTextColor }]}>الاستمرار</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={[styles.loginLink, { color: '#4a90e2' }]}> تسجيل الدخول</Text>
        </TouchableOpacity>
        <Text style={[styles.loginText, { color: footerTextColor }]}>لديك حساب بالفعل ؟</Text>
      </View>

      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <Text style={[styles.orText, { color: footerTextColor }]}>أو</Text>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
      </View>

      {/* أزرار التواصل الاجتماعي */}
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBackground, borderColor: socialButtonBorderColor }]} activeOpacity={0.8}>
        <FontAwesome name="google" size={20} color={socialButtonTextColor} style={styles.socialIcon} />
        <Text style={[styles.socialButtonText, { color: socialButtonTextColor }]}>الاستمرار بواسطة Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBackground, borderColor: socialButtonBorderColor }]} activeOpacity={0.8}>
        <MaterialCommunityIcons name="facebook" size={20} color={socialButtonTextColor} style={styles.socialIcon} />
        <Text style={[styles.socialButtonText, { color: socialButtonTextColor }]}>الاستمرار بواسطة Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBackground, borderColor: socialButtonBorderColor }]} activeOpacity={0.8}>
        <AntDesign name="apple1" size={20} color={socialButtonTextColor} style={styles.socialIcon} />
        <Text style={[styles.socialButtonText, { color: socialButtonTextColor }]}>الاستمرار بواسطة Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, { backgroundColor: socialButtonBackground, borderColor: socialButtonBorderColor }]} activeOpacity={0.8}>
        <Entypo name="phone" size={20} color={socialButtonTextColor} style={styles.socialIcon} />
        <Text style={[styles.socialButtonText, { color: socialButtonTextColor }]}>الاستمرار بواسطة رقم هاتف</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={[styles.footerLink, { color: footerTextColor }]}>الشروط والأحكام</Text>
        </TouchableOpacity>
        <Text style={[styles.footerDivider, { color: footerTextColor }]}> | </Text>
        <TouchableOpacity>
          <Text style={[styles.footerLink, { color: footerTextColor }]}>سياسة الخصوصية</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingHorizontal: 30,
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
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  continueButton: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
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
  },
  orText: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  socialButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerLink: {
    fontSize: 12,
  },
  footerDivider: {
    marginHorizontal: 5,
    fontSize: 12,
  },
});
