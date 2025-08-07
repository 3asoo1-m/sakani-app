// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlRAVnxbTAc9z79jvrqT_mCwD0fA_Fixk",
  authDomain: "sakani-app01.firebaseapp.com",
  projectId: "sakani-app01",
  storageBucket: "sakani-app01.firebasestorage.app",
  messagingSenderId: "1064831568177",
  appId: "1:1064831568177:web:d7760c58e0a4efacfe0810",
  measurementId: "G-H28MNE3PW6",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and export it for use in your app
export const auth = getAuth(app);
