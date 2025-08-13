import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/useAuth';

interface Apartment {
  id: string;
  title: string;
  city: string;
  price: number;
  image_url: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const user = useAuth();

  const [favorites, setFavorites] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          apartment:apartments (
            id,
            title,
            city,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.log('Error fetching favorites:', error);
        setFavorites([]);
      } else {
        // البيانات في data[i].apartment
        const apartments = data?.flatMap((item: any) => item.apartment ? [item.apartment] : []) || [];
        setFavorites(apartments);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>يرجى تسجيل الدخول لعرض المفضلة.</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>لم تقم بإضافة أي شقق للمفضلة بعد.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Apartment }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
      pathname: '/appartments/[id]',
      params: { id: item.id as string }
    })}
  >
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.city}>{item.city}</Text>
        <Text style={styles.price}>{item.price} شيكل / شهر</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 120,
    height: 90,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  city: {
    color: '#777',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'right',
  },
  price: {
    fontWeight: '600',
    color: '#1D9BF0',
    fontSize: 14,
    textAlign: 'right',
  },
});
