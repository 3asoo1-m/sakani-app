// lib/useUserData.ts

import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

export function useUserData(user: User | null) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // 🔹 أضف error

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
      } catch (e: any) {
        setError(e); // 🔹 خزّن الخطأ
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { userData, loading, error }; // 🔹 رجّع error
}
