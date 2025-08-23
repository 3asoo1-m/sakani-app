import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkEmailConfirmed = async () => {
    setLoading(true);

    const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      Alert.alert('خطأ', 'فشل تحديث الجلسة');
      setLoading(false);
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser();

if (error) {
  Alert.alert('خطأ', 'فشل التحقق من البريد');
  setLoading(false);
  return;
}

console.log('تاريخ تأكيد البريد:', user?.email_confirmed_at);

if (user?.email_confirmed_at) {
  router.replace('/tabs/home'); // أو المسار اللي عندك
} else {
  Alert.alert('لم يتم التأكيد بعد', 'يرجى تأكيد بريدك الإلكتروني أولاً');
}

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>يرجى تأكيد بريدك الإلكتروني</Text>
      <Text style={{ textAlign: 'center', marginBottom: 30 }}>
        لقد قمنا بإرسال رابط تأكيد إلى بريدك. بعد تأكيده، اضغط على الزر أدناه.
      </Text>

      <Button title="تحقق الآن" onPress={checkEmailConfirmed} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
}
