import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { decode } from 'base64-arraybuffer';
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from "react-native";
import { supabase } from "../../lib/supabase"; // Import Supabase client

export default function AddProperty() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  // الحقول
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(""); // This will map to \'city\' in DB
  const [price, setPrice] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [beds, setBeds] = useState("");
  const [area, setArea] = useState("");
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [ownershipDoc, setOwnershipDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // New fields for \'apartments\' table that are not in the form
  const [status, setStatus] = useState("available"); // Default status
  const [type, setType] = useState("student_female"); // Default type
  const [genderPrefer, setGenderPrefer] = useState("any"); // Default gender preference
  const [nearUniversity, setNearUniversity] = useState(false); // Default near university

  const colors = {
    background: isDarkMode ? "#121212" : "#f9f9f9",
    text: isDarkMode ? "#fff" : "#222",
    card: isDarkMode ? "#1e1e1e" : "#fff",
    input: isDarkMode ? "#333" : "#f0f0f0",
    inputBorder: isDarkMode ? "#555" : "#ddd",
    button: "#1E90FF",
    buttonText: "#fff",
    successButton: "#34C759",
    error: "#FF3B30",
  };

  // اختيار صور العقار
  const pickPropertyImages = async () => {
    if (propertyImages.length >= 5) {
      Alert.alert("مسموح فقط 5 صور");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const selected = result.assets.map((asset) => asset.uri);
      setPropertyImages((prev) => [...prev, ...selected].slice(0, 5));
    }
  };

  const removeImage = (uri: string) =>
    setPropertyImages((prev) => prev.filter((i) => i !== uri));

  // اختيار ملف إثبات الملكية
  const pickOwnershipDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });
      console.log("Picked document:", result);
      if (!result.canceled) {
        setOwnershipDoc(result);
      } else {
        console.log("تم إلغاء اختيار الملف");
      }
    } catch (e) {
      console.log("Error picking document:", e);
    }
  };

  const uploadFile = async (uri: string, fileType: string, folder: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileType.split("/")[1]}`;
    const { data, error } = await supabase.storage.from("property-assets").upload(`${folder}/${fileName}`, blob);

    if (error) {
      throw error;
    }
    return data.path;
  };

  const handleSubmit = async () => {
    if (!title || !location || !price || !contactName || !contactPhone) {
      Alert.alert("الرجاء ملء جميع الحقول الأساسية");
      return;
    }

    // تحقق من القيم المسموح بها
    const allowedGenders = ["any", "male", "female"];
    const allowedStatus = ["available", "unavailable"];
    const allowedTypes = ["student_female", "student_female", "family", "shared"]; // عدل حسب جدولك

    if (!allowedGenders.includes(genderPrefer)) {
      Alert.alert("خطأ", "القيمة المختارة لتفضيل الجنس غير صالحة.");
      return;
    }
    if (!allowedStatus.includes(status)) {
      Alert.alert("خطأ", "القيمة المختارة لحالة العقار غير صالحة.");
      return;
    }
    if (!allowedTypes.includes(type)) {
      Alert.alert("خطأ", "القيمة المختارة لنوع العقار غير صالحة.");
      return;
    }

    setLoading(true);

    try {
      // 1. الحصول على المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("المستخدم غير مسجل دخوله. يرجى تسجيل الدخول مرة أخرى.");

      // 2. جلب الدور من جدول profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.role !== "owner_approved") {
        Alert.alert("غير مسموح", "فقط المستخدمين الذين تمت الموافقة عليهم كمالكين يمكنهم إضافة عقارات.");
        return;
      }

      // رفع الصور
      const uploadedImageUrls: string[] = [];
      for (const imageUri of propertyImages) {
        const fileType = imageUri.split('.').pop() || 'jpg';
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileType}`;
        const { data, error } = await supabase.storage
          .from("property-assets")
          .upload(`images/${fileName}`, decode(base64), { contentType: `image/${fileType}`, upsert: true });

        if (error) throw error;

        // الحصول على الرابط العام للصورة
        const { data: publicData } = supabase.storage.from("property-assets").getPublicUrl(data.path);
        uploadedImageUrls.push(publicData.publicUrl);
      }


      // 4. رفع ملف إثبات الملكية
      let uploadedDocUrl: string | null = null;
      if (ownershipDoc?.uri) {
        const fileType = ownershipDoc.name.split('.').pop() || 'pdf';
        const base64 = await FileSystem.readAsStringAsync(ownershipDoc.uri, { encoding: FileSystem.EncodingType.Base64 });
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileType}`;
        const { data, error } = await supabase.storage
          .from("property-assets")
          .upload(`documents/${fileName}`, decode(base64), { contentType: `application/${fileType}`, upsert: true });

        if (error) throw error;
        uploadedDocUrl = supabase.storage.from("property-assets").getPublicUrl(data.path).data.publicUrl;
      }



      // 5. إدراج البيانات في جدول apartments
      const { data, error } = await supabase.from("apartments").insert([
        {
          title,
          city: location,
          price: parseFloat(price),
          image_url: uploadedImageUrls[0] || null,
          image_url2: uploadedImageUrls[1] || null,
          image_url3: uploadedImageUrls[2] || null,
          image_url4: uploadedImageUrls[3] || null,
          image_url5: uploadedImageUrls[4] || null,
          status,
          type,
          gender_prefer: genderPrefer,
          near_university: nearUniversity,
          contact_name: contactName,
          contact_phone: contactPhone,
          description,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          beds: beds ? parseInt(beds) : null,
          area: area ? parseFloat(area) : null,
          ownershipDoc: uploadedDocUrl,
          owner_id: user.id,
        },
      ]);

      if (error) {
        Alert.alert("خطأ في حفظ البيانات", error.message);
        return;
      }

      Alert.alert("تم إضافة العقار بنجاح ✅");

      // إعادة تهيئة الحقول
      setTitle("");
      setLocation("");
      setPrice("");
      setContactName("");
      setContactPhone("");
      setDescription("");
      setBathrooms("");
      setBeds("");
      setArea("");
      setPropertyImages([]);
      setOwnershipDoc(null);

    } catch (err: any) {
      console.error("Error submitting property:", err);
      Alert.alert("خطأ", err.message || "حدث خطأ أثناء إضافة العقار.");
    } finally {
      setLoading(false);
    }
  };




  // دالة لإنشاء حقل إدخال
  const renderField = (
    icon: any,
    label: string,
    value: string,
    setter: any,
    placeholder: string,
    keyboardType?: any
  ) => (
    <View style={styles.inputRow}>
      <View style={styles.inputIcon}>{icon}</View>
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
        value={value}
        onChangeText={setter}
        keyboardType={keyboardType || "default"}
        textAlign="right"
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            {/* زر الرجوع */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.heading, { color: colors.text }]}>إضافة عقار جديد</Text>

            {/* معلومات أساسية */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {renderField(
                <MaterialIcons name="home" size={24} color={colors.button} />,
                "اسم العقار",
                title,
                setTitle,
                "أدخل اسم العقار"
              )}
              {renderField(
                <Feather name="map-pin" size={24} color={colors.button} />,
                "موقع العقار",
                location,
                setLocation,
                "أدخل الموقع"
              )}
              {renderField(
                <Feather name="dollar-sign" size={24} color={colors.button} />,
                "السعر/شهري",
                price,
                setPrice,
                "أدخل السعر",
                "numeric"
              )}
            </View>

            {/* بيانات التواصل */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {renderField(
                <Feather name="user" size={24} color={colors.button} />,
                "اسم للتواصل",
                contactName,
                setContactName,
                "أدخل الاسم"
              )}
              {renderField(
                <Feather name="phone" size={24} color={colors.button} />,
                "رقم الهاتف",
                contactPhone,
                setContactPhone,
                "مثال: 0591234567",
                "phone-pad"
              )}
            </View>

            {/* مواصفات العقار */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {renderField(<Feather name="file-text" size={24} color={colors.button} />, "وصف العقار", description, setDescription, "أدخل وصف العقار")}
              {renderField(<MaterialIcons name="bathtub" size={24} color={colors.button} />, "عدد الحمامات", bathrooms, setBathrooms, "عدد الحمامات", "numeric")}
              {renderField(<MaterialIcons name="bed" size={24} color={colors.button} />, "عدد الأسرة", beds, setBeds, "عدد الأسرة", "numeric")}
              {renderField(<MaterialIcons name="square-foot" size={24} color={colors.button} />, "مساحة العقار (م²)", area, setArea, "أدخل المساحة", "numeric")}
            </View>
            {/* Gender Preference */}
            <View style={[styles.inputRow, { flexDirection: "column", alignItems: "flex-end" }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>تفضيل الجنس</Text>
              <View style={[styles.pickerContainer, { borderColor: colors.inputBorder, backgroundColor: colors.input }]}>
                <Picker
                  selectedValue={genderPrefer}
                  onValueChange={(itemValue) => setGenderPrefer(itemValue)}
                >
                  <Picker.Item label="أي" value="any" />
                  <Picker.Item label="ذكور" value="male" />
                  <Picker.Item label="إناث" value="female" />
                </Picker>
              </View>
            </View>

            {/* Property Type */}
            <View style={[styles.inputRow, { flexDirection: "column", alignItems: "flex-end" }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>نوع العقار</Text>
              <View style={[styles.pickerContainer, { borderColor: colors.inputBorder, backgroundColor: colors.input }]}>
                <Picker
                  selectedValue={type}
                  onValueChange={(value) => setType(value)}
                >
                  <Picker.Item label="طلاب" value="student_male" />
                  <Picker.Item label="طالبات" value="student_female" />
                  <Picker.Item label="عائلات" value="family" />
                  <Picker.Item label="مشترك" value="shared" />
                </Picker>
              </View>
            </View>

            {/* Status */}
            <View style={[styles.inputRow, { flexDirection: "column", alignItems: "flex-end" }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>حالة العقار</Text>
              <View style={[styles.pickerContainer, { borderColor: colors.inputBorder, backgroundColor: colors.input }]}>
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                >
                  <Picker.Item label="متاح" value="available" />
                  <Picker.Item label="غير متاح" value="unavailable" />
                </Picker>
              </View>
            </View>


            {/* الصور */}
            <View style={[styles.card, { backgroundColor: colors.card, alignItems: "center" }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>صور العقار</Text>
                <Text style={[styles.sectionSubTitle, { color: colors.text }]}>
                  (بحد أقصى 5 صور)
                </Text>
              </View>

              <View style={styles.imageContainer}>
                {propertyImages.length < 5 && (
                  <TouchableOpacity
                    style={[styles.addImageButton, { backgroundColor: colors.button }]}
                    onPress={pickPropertyImages}
                  >
                    <Text style={{ color: colors.buttonText, fontSize: 28 }}>+</Text>
                  </TouchableOpacity>
                )}

                {propertyImages.map((uri) => (
                  <View key={uri} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(uri)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* إثبات الملكية */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>إثبات ملكية العقار</Text>
                <Text style={[styles.sectionSubTitle, { color: colors.text }]}>
                  (PDF, 10MB أو صورة بحجم أقصى)
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.button, flexDirection: "row", justifyContent: "center" }]}
                onPress={pickOwnershipDoc}
              >
                <Ionicons name="document-attach" size={20} color={colors.buttonText} />
                <Text style={{ color: colors.buttonText, fontWeight: "600", marginLeft: 8 }}>
                  {ownershipDoc ? "تغيير الملف" : "إضافة ملف"}
                </Text>
              </TouchableOpacity>

              {ownershipDoc && (
                <View style={{ marginTop: 10, position: "relative" }}>
                  <View style={[styles.docContainer, { backgroundColor: colors.input, borderColor: colors.inputBorder }]}>
                    <Ionicons name="document" size={24} color={colors.text} />
                    <Text style={[styles.docText, { color: colors.text }]} numberOfLines={1}>
                      {ownershipDoc.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setOwnershipDoc(null)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* زر الحفظ */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.successButton }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text style={[styles.submitButtonText, { color: "#fff" }]}>جاري الحفظ...</Text>
              ) : (
                <Text style={[styles.submitButtonText, { color: "#fff" }]}>حفظ العقار</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ====== Styles ======
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 20,
    left: 20,
    zIndex: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  inputRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 18,
  },
  inputIcon: { marginLeft: 10 },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    width: 100,
    textAlign: "right",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    minHeight: 50,
  },
  addButton: {
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12 },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: { color: "#fff", fontWeight: "bold" },
  docContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  docText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
    textAlignVertical: "center",
    marginLeft: 10,
    marginTop: 0,
    marginBottom: 0,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  submitButtonText: { fontSize: 17, fontWeight: "bold" },
  sectionHeader: { alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  sectionSubTitle: { fontSize: 14 },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 14,
    width: "100%",
    marginTop: 8,
  },

  imageContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
});
