import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

function translateGender(genderArabic: string):string{
  switch (genderArabic) {
    case 'female':
      return 'أنثى';
    case 'male':
      return 'ذكر';
    case 'both':
      return 'أفضل عدم الإجابة';
    default:
      return 'غير معروف'; // القيمة الافتراضية
  }
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const fetchUserData = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace('/signin');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.log('خطأ في جلب بيانات المستخدم:', error);
    } else {
      setUserData(data);
    }

    setLoading(false);
  };

  fetchUserData();
}, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text>تعذر تحميل البيانات</Text>
      </View>
    );
  }

  const Item = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Pressable style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
      {/* أيقونة (i) في أقصى اليسار */}
      <View style={styles.infoIcon}>
        <MaterialIcons name="info-outline" size={16} color="#aaa" />
      </View>
      
      {/* النصوص في المنتصف */}
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      
      {/* أيقونة الحقل في أقصى اليمين */}
      <View style={styles.itemIcon}>{icon}</View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* صورة المستخدم */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=' + userData.email }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{userData.fullname}</Text>
        </View>

        <View style={styles.card}>
          <Item icon={<Feather name="mail" size={20} color="#444" />} label="البريد الإلكتروني" value={userData.email} />
          <Item icon={<Feather name="calendar" size={20} color="#444" />} label="تاريخ الميلاد" value={userData.birthday} />
          <Item icon={<Feather name="user" size={20} color="#444" />}label="الجنس" value={translateGender(userData.gender)} />
       <Item icon={<Feather name="map-pin" size={20} color="#444" />} label="المدينة" value={userData.city || ''} />
          <Item icon={<Ionicons name="school-outline" size={20} color="#444" />} label="طالب جامعي؟" value={userData.isstudent ? 'نعم' : 'لا'} />
          {userData.isstudent && userData.university && (
            <Item icon={<Ionicons name="business-outline" size={20} color="#444" />} label="اسم الجامعة" value={userData.university} />
          )}
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#ffffffee',
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  item: {
    flexDirection: 'row', // اتجاه من اليسار لليمين
    alignItems: 'center',
    marginBottom: 18,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  itemPressed: {
    backgroundColor: '#f2f2f2',
    transform: [{ scale: 0.98 }],
  },
  infoIcon: {
    marginRight: 'auto', // تدفع الأيقونة لليسار
    paddingLeft: 5,
  },
  itemIcon: {
    width: 30,
    alignItems: 'center',
    marginLeft: 15,
  },
  itemText: {
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
  itemLabel: {
    fontSize: 13,
    color: '#888',
    textAlign: 'right',
  },
  itemValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    textAlign: 'right',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF5C5C',
    padding: 14,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});