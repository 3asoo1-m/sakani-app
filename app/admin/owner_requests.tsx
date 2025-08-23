import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

interface OwnerRequest {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  id_image_url: string;
  proof_image_url: string;
  role: string;
  verification_status: string;
}

export default function OwnerRequestsScreen() {
  const [requests, setRequests] = useState<OwnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOwnerRequests = async () => {
    setRefreshing(true);
    setLoading(true);
    try {
      // 1. التحقق من دور المستخدم (للتأكد من أنه مسؤول)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('خطأ', 'يجب تسجيل الدخول للوصول إلى هذه الصفحة.');
        router.replace('/signin');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile.role !== 'admin') {
        Alert.alert('غير مصرح', 'ليس لديك صلاحية الوصول إلى هذه الصفحة.');
        router.replace('/tabs/home'); // أو أي صفحة أخرى
        return;
      }

      // 2. جلب طلبات المالكين المعلقة
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'owner_pending_approval');

      if (error) {
        throw error;
      }
      setRequests(data as OwnerRequest[]);
    } catch (error: any) {
      Alert.alert('خطأ في جلب الطلبات', error.message);
      console.error('Error fetching owner requests:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOwnerRequests();
  }, []);

  const handleApprove = async (userId: string) => {
    Alert.alert(
      'تأكيد الموافقة',
      'هل أنت متأكد من الموافقة على هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'موافق',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .update({ role: 'owner_approved', verification_status: 'approved' })
                .eq('id', userId);

              if (error) throw error;
              Alert.alert('نجاح', 'تمت الموافقة على الطلب بنجاح.');
              fetchOwnerRequests(); // إعادة جلب الطلبات لتحديث القائمة
            } catch (error: any) {
              Alert.alert('خطأ', error.message);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (userId: string) => {
    Alert.alert(
      'تأكيد الرفض',
      'هل أنت متأكد من رفض هذا الطلب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'موافق',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .update({ role: 'owner_rejected', verification_status: 'rejected' })
                .eq('id', userId);

              if (error) throw error;
              Alert.alert('نجاح', 'تم رفض الطلب بنجاح.');
              fetchOwnerRequests(); // إعادة جلب الطلبات لتحديث القائمة
            } catch (error: any) {
              Alert.alert('خطأ', error.message);
            }
          },
        },
      ]
    );
  };

  const renderRequestItem = ({ item }: { item: OwnerRequest }) => (
    <View style={styles.requestCard}>
      <Text style={styles.requestName}>{item.fullname}</Text>
      <Text style={styles.requestDetail}>البريد: {item.email}</Text>
      <Text style={styles.requestDetail}>الهاتف: {item.phone_number}</Text>

      <View style={styles.imageLinksContainer}>
        <TouchableOpacity onPress={() => Linking.openURL(item.id_image_url)} style={styles.imageLinkButton}>
          <Feather name="image" size={18} color="#1E90FF" />
          <Text style={styles.imageLinkText}>صورة الهوية</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(item.proof_image_url)} style={styles.imageLinkButton}>
          <Feather name="file-text" size={18} color="#1E90FF" />
          <Text style={styles.imageLinkText}>إثبات الملكية</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>موافقة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
          <Feather name="x-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>رفض</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>طلبات المالكين المعلقة</Text>
      </View>
      {requests.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-circle-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>لا توجد طلبات معلقة حالياً.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onRefresh={fetchOwnerRequests}
          refreshing={refreshing}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  requestDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  imageLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  imageLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#E3F2FD', // لون أزرق فاتح
  },
  imageLinkText: {
    marginLeft: 5,
    color: '#1E90FF',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  approveButton: {
    flexDirection: 'row',
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
});
