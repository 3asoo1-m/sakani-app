//signin.tsx
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFacebookLogin } from '../lib/facebookLogin';

export default function SignInScreen() {
  const router = useRouter();
  const { request, promptAsync, response } = useFacebookLogin();

  React.useEffect(() => {
    if (response?.type === 'success') {
      router.replace('/tabs/home'); // توجيه بعد تسجيل الدخول بنجاح
    }
  }, [response]);
  return (
    <View style={styles.container}>
      {/* Close button top right */}
      <TouchableOpacity style={styles.closeButton}>
        <Feather name="x" size={24} color="#666" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        جزاك الله كل خيرا يا اوس
      </Text>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>

        <TouchableOpacity style={styles.appleButton} activeOpacity={0.8}>
          <AntDesign name="apple1" size={20} color="#000" style={styles.icon} />
          <Text style={styles.appleButtonText}>الاستمرار بواسطة Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
          <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.googleButtonText}>الاستمرار بواسطة Google</Text>
        </TouchableOpacity>

        {/* زر فيسبوك الجديد */}
        <TouchableOpacity
          style={styles.facebookButton}
          activeOpacity={0.8}
          disabled={!request}
          onPress={() => promptAsync()}
        >
                <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
               <Text style={styles.facebookButtonText}>الاستمرار بواسطة Facebook</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.signupButton}
          activeOpacity={0.8}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.signupButtonText}>تسجيل حساب</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    right: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 60,
  },
  dot: {
    color: '#000',
    fontSize: 28,
  },
  buttonsContainer: {
    paddingHorizontal: 30,
  },
  icon: {
    marginRight: 8,
  },
  appleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  appleButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  facebookButton: {
    flexDirection: 'row',
    backgroundColor: '#1877F2', // اللون الأزرق الخاص بفيسبوك
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  facebookButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  signupButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  loginButton: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});
