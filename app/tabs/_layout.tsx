// app/tabs/_layout.tsx

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase'; // تأكد من أن هذا المسار صحيح

export default function TabLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          setIsAdmin(profile?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(true);
      fetchUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1D9BF0',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 0, height: 65, paddingBottom: 10 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, focused }) => <FontAwesome name="home" size={focused ? 28 : 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'بحث',
          tabBarIcon: ({ color, focused }) => <FontAwesome name="search" size={focused ? 28 : 24} color={color} />,
        }}
      />
      
      {/* ▼▼▼▼▼ هذا هو الحل الصحيح والنهائي ▼▼▼▼▼ */}
      <Tabs.Screen
        name="owner_requests"
        options={{
          // إذا لم يكن المستخدم أدمن، فإن `href: null` يخبر Expo Router
          // أن يتجاهل هذا التبويب تمامًا ويخفيه من الواجهة.
          // @ts-ignore 
          href: isAdmin ? 'owner_requests' : null,
          
          title: 'الطلبات',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="pending-actions" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'المفضلة',
          tabBarIcon: ({ color, focused }) => <FontAwesome name="heart" size={focused ? 28 : 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'ملفي',
          tabBarIcon: ({ color, focused }) => <FontAwesome name="user" size={focused ? 28 : 24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});
