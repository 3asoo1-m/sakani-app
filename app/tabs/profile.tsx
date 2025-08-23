import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'; // إضافة useCallback
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

function translateGender(genderArabic: string): string {
  switch (genderArabic) {
    case 'female':
      return 'أنثى';
    case 'male':
      return 'ذكر';
    case 'both':
      return 'أفضل عدم الإجابة';
    default:
      return 'غير معروف';
  }
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // حالة جديدة للتحديث
  const router = useRouter();

  // دالة جلب بيانات المستخدم - تم تعديلها لتكون قابلة للاستدعاء عند التحديث
  const fetchUserData = useCallback(async () => {
    setRefreshing(true); // بدء التحديث
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace('/signin');
      setRefreshing(false); // إنهاء التحديث حتى لو كان هناك خطأ
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
    setRefreshing(false); // إنهاء التحديث
  }, []); // لا توجد تبعيات لأنها لا تعتمد على أي قيم متغيرة داخلها

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // استدعاء fetchUserData عند تحميل المكون أو عند تغيرها

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  const navigateToBecomeOwner = () => {
    router.push('/owner/verify');
  };

  const renderOwnerCard = () => {
    if (!userData) return null;

    const role = userData.role || 'tenant';

    switch (role) {
      case 'tenant':
        return (
          <View style={styles.ownerCard}>
            <Ionicons name="business-outline" size={32} color="#1E90FF" />
            <View style={styles.ownerCardTextContainer}>
              <Text style={styles.ownerCardTitle}>هل تملك عقاراً؟</Text>
              <Text style={styles.ownerCardSubtitle}>اعرضه الآن على سَكَني و صل لآلاف الطلاب.</Text>
            </View>
            <TouchableOpacity style={styles.ownerButton} onPress={navigateToBecomeOwner}>
              <Text style={styles.ownerButtonText}>ابدأ الآن</Text>
              <Feather name="chevron-left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        );

      case 'owner_pending_approval':
        return (
          <View style={[styles.ownerCard, styles.pendingCard]}>
            <Ionicons name="time-outline" size={32} color="#FF9500" />
            <View style={styles.ownerCardTextContainer}>
              <Text style={[styles.ownerCardTitle, { color: '#FF9500' }]}>طلبك قيد المراجعة</Text>
              <Text style={styles.ownerCardSubtitle}>
                سيقوم فريقنا بمراجعة مستنداتك والرد عليك في أقرب وقت ممكن.
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#FF9500' }]}>
              <Text style={styles.statusBadgeText}>قيد المراجعة</Text>
            </View>
          </View>
        );

      case 'owner_approved':
        return (
          <View style={[styles.ownerCard, styles.approvedCard]}>
            <Ionicons name="checkmark-circle" size={32} color="#34C759" />
            <View style={styles.ownerCardTextContainer}>
              <Text style={[styles.ownerCardTitle, { color: '#34C759' }]}>حسابك مفعل كمالك</Text>
              <Text style={styles.ownerCardSubtitle}>
                يمكنك الآن إضافة وإدارة عقاراتك على المنصة.
              </Text>
            </View>
            <TouchableOpacity style={[styles.ownerButton, { backgroundColor: '#34C759' }]}>
              <Text style={styles.ownerButtonText}>إدارة عقاراتي</Text>
              <Feather name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        );

      case 'owner_rejected':
        return (
          <View style={[styles.ownerCard, styles.rejectedCard]}>
            <Ionicons name="close-circle" size={32} color="#FF3B30" />
            <View style={styles.ownerCardTextContainer}>
              <Text style={[styles.ownerCardTitle, { color: '#FF3B30' }]}>تم رفض طلبك</Text>
              <Text style={styles.ownerCardSubtitle}>
                لم تتم الموافقة على طلبك. يمكنك إعادة التقديم بمستندات محدثة.
              </Text>
            </View>
            <TouchableOpacity style={[styles.ownerButton, { backgroundColor: '#FF3B30' }]} onPress={navigateToBecomeOwner}>
              <Text style={styles.ownerButtonText}>إعادة التقديم</Text>
              <Feather name="refresh-cw" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
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
      <View style={styles.infoIcon}>
        <MaterialIcons name="info-outline" size={16} color="#aaa" />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      <View style={styles.itemIcon}>{icon}</View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={ // إضافة RefreshControl هنا
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUserData}
            colors={['#1E90FF']} // لون مؤشر التحميل
            tintColor={'#1E90FF'} // لون مؤشر التحميل على iOS
          />
        }
      >
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
          <Item icon={<Feather name="user" size={20} color="#444" />} label="الجنس" value={translateGender(userData.gender )} />
          <Item icon={<Feather name="map-pin" size={20} color="#444" />} label="المدينة" value={userData.city || ''} />
          <Item icon={<Ionicons name="school-outline" size={20} color="#444" />} label="طالب جامعي؟" value={userData.isstudent ? 'نعم' : 'لا'} />
          {userData.isstudent && userData.university && (
            <Item icon={<Ionicons name="business-outline" size={20} color="#444" />} label="اسم الجامعة" value={userData.university} />
          )}
        </View>

        {renderOwnerCard()}

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
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 20,
    paddingBottom: 50,
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
    flexDirection: 'row',
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
    marginRight: 'auto',
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
    marginTop: 20,
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
  ownerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  approvedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  rejectedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  ownerCardTextContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  ownerCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  ownerCardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  ownerButton: {
    flexDirection: 'row-reverse',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
