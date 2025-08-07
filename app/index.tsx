import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        // لو في خطأ نرسل لتسجيل الدخول كخيار آمن
        router.replace('/signin');
        setLoading(false);
        return;
      }

      if (!session) {
        // لا توجد جلسة - اذهب إلى شاشة تسجيل الدخول
        router.replace('/signin');
        setLoading(false);
        return;
      }

      const user = session.user;

      if (!user.email_confirmed_at) {
        // البريد غير مؤكد - اذهب لشاشة تأكيد البريد
        router.replace('/screens/verify-email');
        setLoading(false);
        return;
      }

      // البريد مؤكد - اذهب للشاشة الرئيسية
      router.replace('/tabs/home');
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    // عرض شاشة تحميل اثناء التحقق
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // لا تعرض شيء لأن التوجيه يتم تلقائياً
  return null;
}
