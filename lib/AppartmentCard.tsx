import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ApartmentCardProps = {
  imageUri: string;
  title: string;
  price: string;
  status: 'available' | 'booked';
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onPress?: (event: GestureResponderEvent) => void; // <--- أضفنا onPress
};

export default function ApartmentCard({
  imageUri,
  title,
  price,
  status,
  isFavorite = false,
  onFavoriteToggle,
  onPress,
}: ApartmentCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.price}>{price}</Text>

        <View style={styles.footer}>
          <View
            style={[
              styles.status,
              status === 'available' ? styles.available : styles.booked,
            ]}
          >
            <Text style={styles.statusText}>
              {status === 'available' ? 'متوفر' : 'محجوز'}
            </Text>
          </View>

          {onFavoriteToggle && (
            <TouchableOpacity onPress={onFavoriteToggle}>
              <AntDesign
                name={isFavorite ? 'heart' : 'hearto'}
                size={24}
                color={isFavorite ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  available: {
    backgroundColor: '#d4edda',
  },
  booked: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
});
