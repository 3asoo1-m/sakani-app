// app/_layout.tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase'; // تأكد من المسار الصحيح

// منع إخفاء شاشة البداية تلقائياً
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // الاستماع لتغيرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // إذا لم يكن هناك جلسة، أعد التوجيه إلى شاشة تسجيل الدخول
      if (!session) {
        // router.replace('/signin'); // لا تستخدم router هنا مباشرة في RootLayout
        // يمكن التعامل مع هذا في _layout.tsx الخاص بـ (tabs) أو استخدام Redirect
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      {/* إخفاء الهيدر للشاشات التي يتم التحكم فيها بواسطة Tabs */}
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      {/* إخفاء الهيدر لشاشات المصادقة */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      <Stack.Screen name="account-disabled" options={{ headerShown: false }} />

      {/* شاشات التسجيل التفصيلية */}
      <Stack.Screen name="signupdetails" options={{ headerShown: false }} />
      <Stack.Screen name="signupdetails1" options={{ headerShown: false }} />
      <Stack.Screen name="signupdetails2" options={{ headerShown: false }} />

      {/* شاشات المالك */}
      <Stack.Screen name="owner/verify" options={{ headerShown: false }} />
      <Stack.Screen name="owner/upload_documents" options={{ headerShown: false }} />

      {/* شاشات المسؤول */}
      <Stack.Screen name="admin/owner_requests" options={{ headerShown: false }} />
      
      
      {/* شاشات الشقق */}
      <Stack.Screen name="appartments/[id]" options={{ headerShown: false }} />


      {/* أي شاشات أخرى تحتاج إلى هيدر يمكن إزالة headerShown: false منها */}
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  );
}
