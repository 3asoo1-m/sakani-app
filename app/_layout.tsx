// app/_layout.tsx

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { UserProvider } from '../context/userContext'; // <-- 1. استيراد الـ Provider

// منع إخفاء شاشة البداية تلقائياً
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // أضف أي خطوط أخرى تستخدمها هنا
  });

  // عرض الأخطاء المتعلقة بالخطوط
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // عرض لا شيء حتى يتم تحميل الخطوط
  }

  return (
    // 2. تغليف كل شيء بالـ UserProvider
    <UserProvider>
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="verify-email" options={{ headerShown: false }} />
        <Stack.Screen name="account-disabled" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails1" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails2" options={{ headerShown: false }} />
        <Stack.Screen name="owner/verify" options={{ headerShown: false }} />
        <Stack.Screen name="owner/upload_documents" options={{ headerShown: false }} />
        
        {/* هذه الشاشة لم تعد ضرورية في مجلد admin إذا نقلتها للتبويبات */}
        {/* <Stack.Screen name="admin/owner_requests" options={{ headerShown: false }} /> */}
        
        <Stack.Screen name="appartments/[id]" options={{ headerShown: false }} />
        
        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
    </UserProvider>
  );
}
