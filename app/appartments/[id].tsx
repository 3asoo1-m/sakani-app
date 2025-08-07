import { useLocalSearchParams, useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ApartmentDetails() {
const { id } = useLocalSearchParams<{ id: string }>();  const router = useRouter();

  const [apartment, setApartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchApartment = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.log('خطأ في جلب بيانات الشقة:', error);
        // ممكن ترجع للصفحة السابقة أو تعرض رسالة خطأ
        router.back();
      } else {
        setApartment(data);
      }
      setLoading(false);
    };

    fetchApartment();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  if (!apartment) {
    return (
      <View style={styles.centered}>
        <Text>لم يتم العثور على تفاصيل الشقة.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: apartment.image_url }} style={styles.image} />
      <Text style={styles.title}>{apartment.title}</Text>
      <Text style={styles.price}>{apartment.price} شيكل</Text>
      <Text style={styles.status}>
        الحالة: {apartment.status === 'available' ? 'متوفرة' : 'محجوزة'}
      </Text>
      <Text style={styles.city}>المدينة: {apartment.city}</Text>
      <Text style={styles.type}>نوع السكن: {apartment.type}</Text>
      <Text style={styles.genderPref}>
        تفضيل الجنس: {apartment.gender_prefer}
      </Text>
      <Text style={styles.nearUniversity}>
        بالقرب من الجامعة: {apartment.near_university ? 'نعم' : 'لا'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#4a90e2',
  },
  status: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  city: {
    fontSize: 16,
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    marginBottom: 4,
  },
  genderPref: {
    fontSize: 16,
    marginBottom: 4,
  },
  nearUniversity: {
    fontSize: 16,
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
