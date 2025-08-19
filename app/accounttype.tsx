//accounttype.tsx
import { AntDesign } from '@expo/vector-icons'; // أيقونة السهم للرجوع
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export default function AccountTypeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // دالة لتحويل القيمة الى نص مفرد (تعالج string | string[] | undefined)
  const getStringParam = (param: string | string[] | undefined): string => {
    if (!param) return '';
    if (Array.isArray(param)) return param[0];
    return param;
  };

  // قراءة القيم مع تأمينها
  const params = useLocalSearchParams();
  const email = decodeURIComponent(getStringParam(params.email));
  const gender = decodeURIComponent(getStringParam(params.gender));
  const fullName = decodeURIComponent(getStringParam(params.fullname));
  const birthday = decodeURIComponent(getStringParam(params.birthday));

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBackground = isDarkMode ? '#222' : '#f0f8ff';
  const borderColor = isDarkMode ? '#4a90e2' : '#4a90e2';


  const handleSelectType = (type: 'tenant' | 'owner') => {
    // تمرير جميع البيانات المستلمة إلى الشاشة التالية
    if (type === 'tenant') {
      router.push({
      pathname: '/signupdetails1',
      params: {
        email: encodeURIComponent(email),
        fullname: encodeURIComponent(fullName),
        birthday: encodeURIComponent(birthday),
        gender: encodeURIComponent(gender),
        },
    });
    } else {
      router.push({
      pathname: '/signupdetails_owner',
      params: {
        email: encodeURIComponent(email),
        fullname: encodeURIComponent(fullName),
        birthday: encodeURIComponent(birthday),
        gender: encodeURIComponent(gender),
        },
    });
  };
    }
};






  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.innerContainer}>
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color={isDarkMode ? '#fff' : '#4a90e2'} />
        </TouchableOpacity>

        <Text style={[styles.header, { color: textColor }]}>معلومات إضافية</Text>

        


        {/* زر استمرار */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: isDarkMode ? '#1a73e8' : '#000' }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[styles.continueButtonText, { color: '#fff' }]}>استمرار</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 3000,
  },
  dropdown: {
    borderWidth: 1.5,
    borderRadius: 10,
  },
  dropdownList: {
    borderWidth: 1.5,
    borderRadius: 10,
  },
  switchContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  continueButton: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
