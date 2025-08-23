// app/context/UserContext.tsx

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // تأكد من أن هذا المسار صحيح لمشروعك

// تعريف نوع بيانات المستخدم لتسهيل العمل وتجنب الأخطاء
interface UserProfile {
  id: string;
  role: 'tenant' | 'owner_pending_approval' | 'owner_approved' | 'owner_rejected' | 'admin';
  // يمكنك إضافة أي حقول أخرى تحتاجها من جدول profiles هنا
  [key: string]: any; 
}

// تعريف نوع البيانات التي سيوفرها الـ Context
interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refetchProfile: () => void; // دالة لإعادة جلب البيانات عند الحاجة
}

// إنشاء الـ Context بقيمة ابتدائية
const UserContext = createContext<UserContextType>({
  profile: null,
  loading: true,
  isAdmin: false,
  refetchProfile: () => {},
});

// إنشاء الـ Provider الذي سيغلف التطبيق
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    // لا تبدأ التحميل إذا كانت البيانات موجودة بالفعل إلا إذا كان ضرورياً
    // setLoading(true); 
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile in Context:', error);
        setProfile(null); // أعد القيمة إلى null في حالة الخطأ
      } else {
        setProfile(data as UserProfile);
      }
    } else {
        setProfile(null); // لا يوجد مستخدم مسجل دخوله
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();

    // الاستماع لتغيرات المصادقة لتحديث الملف الشخصي عند تسجيل الدخول/الخروج
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

    // --- 3. طباعة للتحقق من القيمة النهائية لـ isAdmin ---
  const isAdmin = profile?.role === 'admin';
  console.log('--- UserContext: Final Check ---');
  console.log(`Profile Role: ${profile?.role}, IsAdmin Flag: ${isAdmin}`);

  
  const value = {
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    refetchProfile: fetchProfile, // توفير الدالة لإعادة الجلب
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// إنشاء Hook مخصص لتسهيل استخدام الـ Context في المكونات الأخرى
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
