import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function SignupDetailsOwner() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [appartmentaddress, setAppartmentAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [ownershipImage, setOwnershipImage] = useState<string | null>(null);

  // ألوان حسب الوضع ليلي/نهاري
  const backgroundColor = isDarkMode ? "#121212" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";
  const inputBackground = isDarkMode ? "#333" : "#fff";
  const inputBorderColor = isDarkMode ? "#555" : "#ccc";
  const buttonBackground = isDarkMode ? "#1a73e8" : "#000";
  const buttonTextColor = "#fff";

  // دالة اختيار صورة
  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleContinue = () => {
    if (!appartmentaddress || !phone || !idImage || !ownershipImage) {
      alert("رجاءً أكمل كل الحقول");
      return;
    }

    router.push("/signupdetails2"); // شاشة كلمة المرور
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.scrollContainer}>
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#4a90e2" />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>
          تفاصيل إضافية للمالك
        </Text>

        {/* عنوان السكن"المراد تأجيره"*/}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBackground, borderColor: inputBorderColor, color: textColor },
          ]}
          placeholder="عنوان السكن المراد تأجيره"
          placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
          value={appartmentaddress}
          onChangeText={setAppartmentAdress}
          returnKeyType="done"
          textAlign="right"
        />

        {/* رقم الهاتف */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBackground, borderColor: inputBorderColor, color: textColor },
          ]}
          placeholder="رقم الهاتف"
          placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="done"
          textAlign="right"
        />

        {/* رفع صورة الهوية */}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: inputBackground, borderColor: inputBorderColor }]}
          onPress={() => pickImage(setIdImage)}
        >
          <Text style={{ color: textColor, fontSize: 16, textAlign: "center" }}>
            {idImage ? "✅ تم اختيار صورة الهوية" : "📎 رفع صورة الهوية"}
          </Text>
        </TouchableOpacity>

        {/* رفع إثبات الملكية */}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: inputBackground, borderColor: inputBorderColor }]}
          onPress={() => pickImage(setOwnershipImage)}
        >
          <Text style={{ color: textColor, fontSize: 16, textAlign: "center" }}>
            {ownershipImage ? "✅ تم اختيار إثبات الملكية" : "📎 رفع إثبات الملكية"}
          </Text>
        </TouchableOpacity>

        {/* زر استمرار */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: buttonBackground }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[styles.continueButtonText, { color: buttonTextColor }]}>
            استمرار
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 80 : 50,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    justifyContent: "center",
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  uploadButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  continueButton: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
