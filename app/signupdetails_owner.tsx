import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const SignupDetailsOwner = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [ownershipImage, setOwnershipImage] = useState<string | null>(null);

  // دالة اختيار صورة
  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleNext = () => {
    if (!fullName || !phone || !idImage || !ownershipImage) {
      alert("رجاءً أكمل كل الحقول");
      return;
    }

    // هنا ممكن تضيف منطق حفظ البيانات مؤقتًا أو رفعها للـ backend

    router.push("/signupdetails2"); // الانتقال لشاشة إنشاء كلمة المرور
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تفاصيل إضافية للمالك</Text>

      <TextInput
        style={styles.input}
        placeholder="الاسم الكامل"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="رقم الهاتف"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setIdImage)}>
        <Text style={styles.buttonText}>
          {idImage ? "تم اختيار صورة الهوية" : "رفع صورة الهوية"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setOwnershipImage)}>
        <Text style={styles.buttonText}>
          {ownershipImage ? "تم اختيار إثبات الملكية" : "رفع إثبات الملكية"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>التالي</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupDetailsOwner;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15 },
  imageButton: { backgroundColor: "#ddd", padding: 12, borderRadius: 10, marginBottom: 15 },
  buttonText: { textAlign: "center", fontSize: 16 },
  nextButton: { backgroundColor: "#2196F3", padding: 15, borderRadius: 10, marginTop: 20 },
  nextButtonText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
