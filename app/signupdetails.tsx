//signupdetails.tsx
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SignupInfoScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const emailDecoded = decodeURIComponent(Array.isArray(email) ? email[0] : email);
  const [fullName, setFullName] = useState('');

  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [genderItems, setGenderItems] = useState([
        { label: 'ذكر', value: 'male' },
        { label: 'أنثى', value: 'female' },
        { label: 'أفضل عدم الإجابة', value: 'both' },
      ]);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const borderColor = isDarkMode ? '#4a90e2' : '#4a90e2';

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBackground = isDarkMode ? '#333' : '#fff';
  const inputBorderColor = isDarkMode ? '#555' : '#ccc';
  const buttonBackground = isDarkMode ? '#1a73e8' : '#000';
  const buttonTextColor = '#fff';

  // دالة لتحويل التاريخ إلى نص (yyyy/mm/dd)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // التعامل مع تغيير التاريخ من DatePicker
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // في iOS يبقى ظاهر
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleContinue = () => {
    if (!fullName.trim()) {
      alert('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!birthday) {
      alert('يرجى اختيار تاريخ الميلاد');
      return;
    }
    if (!gender) {
      alert('يرجى اختيار الجنس');
      return;
    }
    

    const encodedEmail = encodeURIComponent(emailDecoded);
    const encodedGender = encodeURIComponent(gender);
    const encodedFullName = encodeURIComponent(fullName);
    const encodedBirthday = encodeURIComponent(formatDate(birthday));

    router.push(
      `/signupdetails1?email=${encodedEmail}&fullname=${encodedFullName}&birthday=${encodedBirthday}&gender=${encodedGender}`
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.scrollContainer}>
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#4a90e2" />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>أخبرنا عنك</Text>

        {/* حقل الاسم الكامل */}
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorderColor, color: textColor }]}
          placeholder="الاسم الكامل"
          placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
          value={fullName}
          onChangeText={setFullName}
          returnKeyType="done"
          textAlign="right"
        />
        <DropDownPicker
          open={genderOpen}
          value={gender}
          items={genderItems}
          setOpen={setGenderOpen}
          setValue={setGender}
          setItems={setGenderItems}
          placeholder="اختر الجنس"
          containerStyle={styles.dropdownContainer}
          style={[styles.dropdown, { backgroundColor: inputBackground, borderColor }]}
          dropDownContainerStyle={[styles.dropdownList, { backgroundColor: inputBackground }]}
          zIndex={3000}
          zIndexInverse={1000}
          textStyle={{ color: textColor, textAlign: 'right' }}
        />

        {/* اختيار تاريخ الميلاد */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.datePickerButton, { backgroundColor: inputBackground, borderColor: inputBorderColor }]}
        >
          <Text style={{ color: birthday ? textColor : (isDarkMode ? '#bbb' : '#888'), fontSize: 16, textAlign: 'right' }}>
            {birthday ? formatDate(birthday) : 'اختر تاريخ الميلاد'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthday || new Date(1998, 0, 1)} // قيمة مبدئية
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={onChange}
            maximumDate={new Date()} // لا يمكن اختيار تاريخ مستقبلي
          />
        )}

        {/* زر استمرار */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: buttonBackground }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[styles.continueButtonText, { color: buttonTextColor }]}>استمرار</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  continueButton: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
