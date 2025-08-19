import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export default function AccountTypeScreen() {
  const router = useRouter();
  // استلام البيانات من الشاشة السابقة
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // تحديد الألوان بناءً على الوضع (ليلي/نهاري)
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const subtitleColor = isDarkMode ? '#bbb' : '#666';
  const tenantBorderColor = '#4a90e2'; // أزرق
  const ownerBorderColor = '#34C759'; // أخضر
  const tenantBackgroundColor = isDarkMode ? 'rgba(74, 144, 226, 0.2)' : 'rgba(74, 144, 226, 0.1)';
  const ownerBackgroundColor = isDarkMode ? 'rgba(52, 199, 89, 0.2)' : 'rgba(52, 199, 89, 0.1)';

  // دالة التوجيه عند اختيار نوع الحساب
  const handleSelectType = (type: 'tenant' | 'owner') => {
    // تمرير جميع البيانات المستلمة إلى الشاشة التالية
    if (type === 'tenant') {
      router.push({
        pathname: '/signupdetails1',
        params: { ...params, accountType: 'tenant' },
      });
    } else {
      router.push({
        pathname: '/signupdetails_owner',
        params: { ...params, accountType: 'owner' },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* زر الرجوع */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <AntDesign name="arrowleft" size={24} color="#4a90e2" />
                </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>اختر نوع حسابك</Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            سيساعدنا هذا في تخصيص تجربتك داخل التطبيق.
          </Text>

          {/* خيارات نوع الحساب */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  borderColor: tenantBorderColor,
                  backgroundColor: tenantBackgroundColor,
                },
              ]}
              onPress={() => handleSelectType('tenant')}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionTitle, { color: textColor }]}>أبحث عن سكن</Text>
              <Text style={[styles.optionDescription, { color: subtitleColor }]}>
                إنشاء حساب كـ "مستأجر" لتصفح السكنات المتاحة وحفظها في المفضلة.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  borderColor: ownerBorderColor,
                  backgroundColor: ownerBackgroundColor,
                },
              ]}
              onPress={() => handleSelectType('owner')}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionTitle, { color: textColor }]}>أملك سكناً</Text>
              <Text style={[styles.optionDescription, { color: subtitleColor }]}>
                إنشاء حساب كـ "مالك" لعرض عقاراتك للآلاف من الطلاب.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
 backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 20,
  },
  optionButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
