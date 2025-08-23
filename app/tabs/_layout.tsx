// app/tabs/_layout.tsx
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native'; // إضافة ActivityIndicator و View
import { supabase } from '../../lib/supabase'; // تأكد من المسار الصحيح لـ supabase

export default function TabLayout() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

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

          if (error) {
            console.error('Error fetching user role:', error.message);
          } else if (profile) {
            setUserRole(profile.role);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();

    // الاستماع لتغيرات حالة المصادقة لتحديث الدور
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserRole(); // إعادة جلب الدور عند تسجيل الدخول/الخروج
      } else {
        setUserRole(null);
        setLoadingRole(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loadingRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f9f9f9',
          borderTopColor: '#ddd',
          height: 60,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof FontAwesome.glyphMap = 'question';
          let IconComponent: any = FontAwesome; // المكون الافتراضي للأيقونات

          switch (route.name) {
            case 'home':
              iconName = 'home';
              break;
            case 'search':
              iconName = 'search';
              break;
            case 'favorites':
              iconName = 'heart';
              break;
            case 'notifications':
              iconName = 'bell';
              break;
            case 'profile':
              iconName = 'user';
              break;
            case 'admin/dashboard': // اسم الشاشة الجديدة للوحة التحكم
              IconComponent = MaterialIcons; // استخدام MaterialIcons لهذا التبويب
              iconName = 'dashboard' as keyof typeof FontAwesome.glyphMap; // أيقونة لوحة التحكم
              break;
          }

          return (
            <IconComponent
              name={iconName}
              size={24}
              color={focused ? '#1D9BF0' : '#888'}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />

      {userRole === 'admin' && (
        <Tabs.Screen
          name="admin/dashboard" // هذا المسار معرف تلقائياً بواسطة _sitemap
          options={{
            title: 'لوحة التحكم',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons name={focused ? 'dashboard' : 'dashboard'} color={color} size={24} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
