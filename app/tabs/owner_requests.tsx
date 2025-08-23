// app/tabs/owner_requests.tsx

import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase'; // تأكد من صحة المسار

interface OwnerRequest {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  id_image_url: string;
  proof_image_url: string;
}

export default function OwnerRequestsScreen() {
  const [requests, setRequests] = useState<OwnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOwnerRequests = useCallback(async () => {
    try {
      // لم نعد بحاجة للتحقق من دور المستخدم هنا، لأن الوصول للصفحة محمي
      const { data, error } = await supabase
        .from('profiles')
        .select('id, fullname, email, phone_number, id_image_url, proof_image_url')
        .eq('role', 'owner_pending_approval');

      if (error) throw error;
      setRequests(data as OwnerRequest[]);
    } catch (error: any) {
      Alert.alert('خطأ في جلب الطلبات', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnerRequests();
  }, [fetchOwnerRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOwnerRequests();
  };

  const updateRequestStatus = async (userId: string, newRole: 'owner_approved' | 'owner_rejected', newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, verification_status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      
      // تحديث القائمة لإزالة الطلب الذي تم التعامل معه
      setRequests(prevRequests => prevRequests.filter(req => req.id !== userId));
      
      Alert.alert('نجاح', `تم ${newStatus === 'approved' ? 'الموافقة على' : 'رفض'} الطلب بنجاح.`);

    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    }
  };

  const handleApprove = (userId: string) => {
    Alert.alert('تأكيد الموافقة', 'هل أنت متأكد من الموافقة على هذا الطلب؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'موافق', onPress: () => updateRequestStatus(userId, 'owner_approved', 'approved') },
    ]);
  };

  const handleReject = (userId: string) => {
    Alert.alert('تأكيد الرفض', 'هل أنت متأكد من رفض هذا الطلب؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'موافق', onPress: () => updateRequestStatus(userId, 'owner_rejected', 'rejected') },
    ]);
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
        <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => handleApprove(item.id)}>
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>موافقة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleReject(item.id)}>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1E90FF"]} tintColor={"#1E90FF"}/>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f6f8' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8' },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  listContainer: { padding: 15 },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  requestName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333', textAlign: 'right' },
  requestDetail: { fontSize: 14, color: '#666', marginBottom: 4, textAlign: 'right' },
  imageLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  imageLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
  },
  imageLinkText: { marginLeft: 8, color: '#1E90FF', fontWeight: '600' },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: { backgroundColor: '#34C759', marginRight: 5 },
  rejectButton: { backgroundColor: '#FF3B30', marginLeft: 5 },
  actionButtonText: { color: '#fff', marginLeft: 8, fontWeight: 'bold', fontSize: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 },
  emptyStateText: { fontSize: 18, color: '#888', marginTop: 15, fontWeight: '500' },
});
