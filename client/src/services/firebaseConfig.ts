import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCawFSSzDXVeIVz4iyyFJ1KOsy4jmT0Zj4",
  authDomain: "aurora-482f9.firebaseapp.com",
  projectId: "aurora-482f9",
  storageBucket: "aurora-482f9.firebasestorage.app",
  messagingSenderId: "364444154741",
  appId: "1:364444154741:web:81d3e8d9fc4a5f61f5b13c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;