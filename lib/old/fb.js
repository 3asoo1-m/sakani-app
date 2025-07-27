// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// تكوين مشروع Firebase الخاص بك
const firebaseConfig = {
  apiKey: "AIzaSyBZE6AFnnQG4dybxY6vDKujwVmKDo8-8Qg",
  authDomain: "sakani-app001.firebaseapp.com",
  projectId: "sakani-app001",
  storageBucket: "sakani-app001.firebasestorage.app",
  messagingSenderId: "941292940397",
  appId: "1:941292940397:web:5e059174d7bf68c02fe364"
};

// تهيئة التطبيق فقط مرة واحدة
const app = initializeApp(firebaseConfig);

// تهيئة خدمات Firebase التي ستستخدمها
const auth = getAuth(app);
const db = getFirestore(app);

// تصدير auth و db لاستخدامهما في باقي التطبيق
export { auth, db };

