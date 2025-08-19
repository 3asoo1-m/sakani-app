// app/tabs/_layout.tsx
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
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
      {/* تأكد من عدم وجود أيقونة أو شاشة للمسؤول هنا */}
    </Tabs>
  );
}
