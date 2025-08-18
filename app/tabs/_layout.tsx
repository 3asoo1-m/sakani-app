//app/tabs/_layout.tsx
import { FontAwesome } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';


export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.log('Error getting session:', error.message);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(!!session?.user);
      }
      setIsLoading(false);
    };

    // Check once on mount
    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
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
          }

          return (
            <FontAwesome
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
    </Tabs>
  );
}