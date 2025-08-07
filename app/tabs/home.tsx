import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import ApartmentCard from '../../lib/AppartmentCard';
import { supabase } from '../../lib/supabase';

export default function Home() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.log('خطأ في جلب الملف الشخصي:', profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      let query = supabase.from('apartments').select('*').eq('status', 'available');

      query = query.eq('city', profileData.city);

      if (profileData.isstudent) {
        query = query.eq('near_university', true);
      }

      if (profileData.gender) {
        query = query.or(`gender_prefer.eq.${profileData.gender},gender_prefer.is.null`);
      }

      const { data: apartmentsData, error: apartmentsError } = await query;

      if (apartmentsError) {
        console.log('خطأ في جلب الشقق:', apartmentsError);
        setLoading(false);
        return;
      }

      setApartments(apartmentsData || []);
    } catch (error) {
      console.log('خطأ عام:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 15 }}>
        مرحباً، {profile?.fullname || 'مستخدم'}
      </Text>

      <FlatList
        data={apartments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ApartmentCard
            title={item.title}
            imageUri={item.image_url}
            price={item.price.toString()}
            status={item.status}
            onPress={() => router.push({
              pathname: '/appartments/[id]',
              params: { id: item.id }
              })}
          />
        )}
        ListEmptyComponent={<Text>لا توجد شقق متاحة حالياً تناسب ملفك.</Text>}
      />
    </View>
  );
}
