import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth, db } from '../../lib/firebase';
import GeneralHomeScreen from './generalhomescreen';
import StudentHomeScreen from './studenthomescreen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsStudent(data.isStudent === true);
        }
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
