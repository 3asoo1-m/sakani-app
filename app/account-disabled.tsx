import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function AccountDisabledScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        حسابك معطل حالياً
      </Text>
      <Text style={[styles.message, { color: isDark ? '#aaa' : '#555' }]}>
        يرجى التواصل مع الدعم لإعادة تفعيل حسابك أو المحاولة لاحقاً.
      </Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: isDark ? '#1a73e8' : '#000' }]}
        onPress={() => router.push('/contact-support')} // أنشئ صفحة تواصل الدعم أو غير الرابط حسب الحاجة
      >
        <Text style={styles.buttonText}>التواصل مع الدعم</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});
