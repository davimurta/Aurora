import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDeABR2p5kDU7pYXW_VhzPxTki85F0vl04",
  authDomain: "aurora-login-f8398.firebaseapp.com",
  projectId: "aurora-login-f8398",
  storageBucket: "aurora-login-f8398.firebasestorage.app",
  messagingSenderId: "13804949485",
  appId: "1:13804949485:web:a90e834dfc5282b59ae1e4",
  measurementId: "G-4QQW10Y38H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;