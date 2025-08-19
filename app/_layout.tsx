// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native'; // استيراد ActivityIndicator و View و StyleSheet
import { supabase } from '../lib/supabase'; // تأكد من المسار الصحيح لتهيئة Supabase

export default function RootLayout() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting user session:', error.message);
        setUserEmail(null);
      } else if (user) {
        setUserEmail(user.email || null);
      } else {
        setUserEmail(null);
      }
      setIsLoadingAuth(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email || null);
        setIsLoadingAuth(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoadingAuth) {
    // عرض شاشة تحميل بسيطة بدلاً من الشاشة السوداء
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // إذا لم يكن هناك مستخدم مسجل دخول، أعد التوجيه إلى شاشة تسجيل الدخول
  if (!userEmail) {
    return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* أضف هنا جميع الشاشات التي يمكن الوصول إليها قبل تسجيل الدخول */}
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails1" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails2" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="accounttype" options={{ headerShown: false }} />
        <Stack.Screen name="account-disabled" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails_owner" options={{ headerShown: false }} />
        <Stack.Screen name="contact-support" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="screens/verify-email" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // إذا كان المستخدم مسجلاً دخول، تحقق من بريده الإلكتروني
  if (userEmail === 'mahmood.ali.d99@gmail.com') {
    // المسؤول: وجهه إلى لوحة تحكم المسؤول
    return (
      <Stack>
        <Stack.Screen name="screens/admin/dashboard" options={{ headerShown: false }} />
        {/* أضف هنا جميع الشاشات التي يمكن للمسؤول الوصول إليها */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails1" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails2" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="accounttype" options={{ headerShown: false }} />
        <Stack.Screen name="account-disabled" options={{ headerShown: false }} />
        <Stack.Screen name="contact-support" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails_owner" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="appartments/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="screens/verify-email" options={{ headerShown: false }} />
      </Stack>
    );
  } else {
    // المستخدم العادي، وجهه إلى علامات التبويب (Tabs)
    return (
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        {/* أضف هنا جميع الشاشات التي يمكن للمستخدم العادي الوصول إليها */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails1" options={{ headerShown: false }} />
        <Stack.Screen name="accounttype" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails2" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="account-disabled" options={{ headerShown: false }} />
        <Stack.Screen name="contact-support" options={{ headerShown: false }} />
        <Stack.Screen name="signupdetails_owner" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="appartments/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="screens/verify-email" options={{ headerShown: false }} />
      </Stack>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
