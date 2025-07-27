import * as AuthSession from 'expo-auth-session';
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import React from 'react';
import { auth } from '../lib/firebase'; // عدل حسب مكان ملف firebase

const FB_APP_ID = '766091355879479';

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'sakaniapp', // تأكد تطابقه مع app.json
});

const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
};

const generateRandomState = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export function useFacebookLogin() {
  const state = React.useMemo(() => generateRandomState(), []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri,
      scopes: ['public_profile', 'email'],
      responseType: 'token',
      state,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.params.access_token;

      const credential = FacebookAuthProvider.credential(accessToken);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('تم تسجيل الدخول في Firebase:', userCredential.user);
          // هنا ممكن تنقل المستخدم للصفحة الرئيسية مثلاً
        })
        .catch((error) => {
          console.error('خطأ تسجيل الدخول في Firebase:', error);
          // عرض رسالة خطأ أو معالجة أخرى
        });
    }
  }, [response]);

  return { request, promptAsync, response };
}
