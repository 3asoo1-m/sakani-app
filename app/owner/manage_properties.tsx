import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/userContext';
import { supabase } from '../../lib/supabase';

export default function ManageProperties() {
  const { profile } = useUser();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('owner_id', profile.id);

      if (error) console.log('خطأ في جلب العقارات:', error);
      else setProperties(data || []);
      setLoading(false);
    };

    fetchProperties();
  }, [profile]);

  const navigateToAddProperty = () => {
    router.push('/owner/add_property');
  };

  const navigateToEditProperty = (id: string) => {
    router.push({
  pathname: '/owner/edit_property', // هذا الملف ستنشئه لاحقًا
  params: { id },
});

  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddProperty}>
        <Text style={styles.addButtonText}>إضافة عقار جديد</Text>
      </TouchableOpacity>

      {properties.length === 0 ? (
        <Text style={styles.noProperties}>لا توجد عقارات حالياً</Text>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.propertyCard}
              onPress={() => navigateToEditProperty(item.id)}
            >
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.propertyImage}
                />
              )}
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName}>{item.title}</Text>
                <Text style={styles.propertyAddress}>{item.city}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: { backgroundColor: '#1E90FF', padding: 15, borderRadius: 10, marginBottom: 15 },
  addButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  noProperties: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#555' },
  propertyCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    alignItems: 'center',
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
  propertyInfo: { flex: 1 },
  propertyName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  propertyAddress: { fontSize: 14, color: '#666' },
});
