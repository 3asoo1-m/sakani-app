import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import GeneralHomeScreen from './generalhomescreen';
import StudentHomeScreen from './studenthomescreen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState<boolean | null>(null);

useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Error fetching user:', authError?.message || 'No user');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('isStudent')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching user data:', error?.message);
      } else {
        setIsStudent(data.isStudent === true);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1D9BF0" />
      </View>
    );
  }

  return isStudent ? <StudentHomeScreen /> : <GeneralHomeScreen />;
}
