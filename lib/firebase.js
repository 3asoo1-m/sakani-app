// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBZE6AFnnQG4dybxY6vDKujwVmKDo8-8Qg",
  authDomain: "sakani-app001.firebaseapp.com",
  projectId: "sakani-app001",
  storageBucket: "sakani-app001.firebasestorage.app",
  messagingSenderId: "941292940397",
  appId: "1:941292940397:web:5e059174d7bf68c02fe364"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

