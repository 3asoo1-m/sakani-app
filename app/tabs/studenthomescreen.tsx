import { useRouter } from 'expo-router';
import React from 'react';
import { I18nManager, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

I18nManager.forceRTL(true); // لضمان الكتابة من اليمين

const featuredListings = [
  {
    image: require('../../assets/images/sakan1.jpg'),
    title: 'شقة في حي الجامعة',
    location: 'نابلس، شارع الجامعة',
    price: '300 دينار شهريًا',
    description: 'شقة مفروشة قريبة من الجامعة.',
  },
  {
    image: require('../../assets/images/sakan2.jpg'),
    title: 'غرفة في سكن طلابي',
    location: 'نابلس، رفيديا',
    price: '150 دينار شهريًا',
    description: 'غرفة في سكن طلابي مشترك.',
  },
  {
    image: require('../../assets/images/sakan3.jpg'),
    title: 'شقة فاخرة في وسط المدينة',
    location: 'رام الله، الماصيون',
    price: '500 دينار شهريًا',
    description: 'شقة حديثة مع كافة الخدمات.',
  },
];

export default function StudentHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{flex: 1}}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>ابحث عن السكن المثالي لك!</Text>
        <Text style={styles.heroSubtitle}>اكتشف شقق وغرف تناسب احتياجاتك الطلابية بسهولة.</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/tabs/search')}
        >
          <Text style={styles.ctaText}>ابدأ البحث</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Listings */}
      <Text style={styles.sectionTitle}>السكنات المميزة</Text>
      {featuredListings.map((item, index) => (
        <View key={index} style={styles.card}>
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardLocation}>{item.location}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

{/* #4caf50ff for background color */}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingHorizontal: 16 },
  header: {
    paddingVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  logo: { width: 120, height: 40, resizeMode: 'contain', marginBottom: 10 },
  hero: {
    backgroundColor: '#979797ff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  ctaText: {
    color: '#5b5b5bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#555',
  },
});
