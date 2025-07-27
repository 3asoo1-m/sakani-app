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
import DropDownPicker from 'react-native-dropdown-picker';

export default function SignUpExtraScreen() {
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
  const fullName = decodeURIComponent(getStringParam(params.fullname));
  const birthday = decodeURIComponent(getStringParam(params.birthday));

  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState<string | null>(null);
  const [cityItems, setCityItems] = useState([
    { label: 'نابلس', value: 'نابلس' },
    { label: 'رام الله', value: 'رام الله' },
    { label: 'الخليل', value: 'الخليل' },
    { label: 'طولكرم', value: 'طولكرم' },
    { label: 'جنين', value: 'جنين' },
    { label: 'قلقيلية', value: 'قلقيلية' },
    { label: 'بيت لحم', value: 'بيت لحم' },
    { label: 'اريحا', value: 'اريحا' },
    { label: 'الناصرة', value: 'الناصرة' },
    { label: 'جلجولية', value: 'جلجولية' },

  ]);

  const [isStudent, setIsStudent] = useState(false);
  const [universityName, setUniversityName] = useState('');

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBackground = isDarkMode ? '#222' : '#f0f8ff';
  const borderColor = isDarkMode ? '#4a90e2' : '#4a90e2';

  const handleContinue = () => {
    if (!city) {
      alert('يرجى اختيار المدينة');
      return;
    }

    if (isStudent && !universityName.trim()) {
      alert('يرجى إدخال اسم الجامعة');
      return;
    }

    router.push({
      pathname: '/signupdetails2',
      params: {
        email: encodeURIComponent(email),
        fullname: encodeURIComponent(fullName),
        birthday: encodeURIComponent(birthday),
        city: encodeURIComponent(city),
        isStudent: encodeURIComponent(isStudent),
        universityName: encodeURIComponent(isStudent ? universityName : ''),
      },
    });
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

        {/* DropdownPicker */}
        <DropDownPicker
          open={cityOpen}
          value={city}
          items={cityItems}
          setOpen={setCityOpen}
          setValue={setCity}
          setItems={setCityItems}
          placeholder="اختر المدينة"
          containerStyle={styles.dropdownContainer}
          style={[styles.dropdown, { backgroundColor: inputBackground, borderColor }]}
          dropDownContainerStyle={[styles.dropdownList, { backgroundColor: inputBackground }]}
          zIndex={3000}
          zIndexInverse={1000}
          textStyle={{ color: textColor, textAlign: 'right' }}
        />

        {/* هل أنت طالب؟ */}
        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: textColor }]}>هل أنت طالب جامعة؟</Text>
          <Switch
            value={isStudent}
            onValueChange={setIsStudent}
            trackColor={{ false: '#ccc', true: '#4a90e2' }}
            thumbColor={Platform.OS === 'android' ? (isStudent ? '#4a90e2' : '#fff') : ''}
          />
        </View>

        {/* اسم الجامعة */}
        {isStudent && (
          <TextInput
            textAlign="right"
            placeholder="اسم الجامعة"
            placeholderTextColor={isDarkMode ? '#bbb' : '#4a90e2'}
            value={universityName}
            onChangeText={setUniversityName}
            style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          />
        )}

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
