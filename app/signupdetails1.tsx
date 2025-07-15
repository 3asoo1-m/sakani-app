import { AntDesign } from '@expo/vector-icons'; // أيقونة السهم للرجوع
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SignUpExtraScreen() {
  const router = useRouter();

  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState(null);
  const [cityItems, setCityItems] = useState([
    { label: 'نابلس', value: 'نابلس' },
    { label: 'رام الله', value: 'رام الله' },
    { label: 'الخليل', value: 'الخليل' },
    { label: 'طولكرم', value: 'طولكرم' },
    { label: 'جنين', value: 'جنين' },
    { label: 'قلقيلية', value: 'قلقيلية' },
    { label: 'بيت لحم', value: 'بيت لحم' },
    { label: 'اريحا', value: 'اريحا'}
  ]);

  const [isStudent, setIsStudent] = useState(false);
  const [universityName, setUniversityName] = useState('');

  const handleContinue = () => {
    if (!city) {
      alert('يرجى اختيار المدينة');
      return;
    }
    console.log('City:', city, 'isStudent:', isStudent, 'University:', universityName);
    // يمكنك هنا تنفيذ أي إجراء مثل الانتقال للشاشة التالية أو حفظ البيانات
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.innerContainer}>

        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#4a90e2" />
        </TouchableOpacity>

        <Text style={styles.header}>معلومات إضافية</Text>

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
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          zIndex={3000} // مهم عشان يظهر فوق باقي العناصر
          zIndexInverse={1000}
        />

        {/* هل أنت طالب؟ */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>هل أنت طالب جامعة؟</Text>
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
            textAlign='right'
            placeholder="اسم الجامعة"
            value={universityName}
            onChangeText={setUniversityName}
            style={styles.input}
            placeholderTextColor="#4a90e2"
          />
        )}

        {/* زر استمرار */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>استمرار</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 3000, // عشان يعلى فوق بقية العناصر
  },
  dropdown: {
    backgroundColor: '#f0f8ff',
    borderColor: '#4a90e2',
  },
  dropdownList: {
    backgroundColor: '#f0f8ff',
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
    color: '#000',
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
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
