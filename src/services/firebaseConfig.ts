import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCawFSSzDXVeIVz4iyyFJ1KOsy4jmT0Zj4",
  authDomain: "aurora-482f9.firebaseapp.com",
  projectId: "aurora-482f9",
  storageBucket: "aurora-482f9.firebasestorage.app",
  messagingSenderId: "364444154741",
  appId: "1:364444154741:web:81d3e8d9fc4a5f61f5b13c"
};

console.log('🔥 Inicializando Firebase...');
console.log('Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
console.log('✅ App Firebase inicializado');

const auth = getAuth(app);
console.log('✅ Auth inicializado:', !!auth);

const db = getFirestore(app);
console.log('✅ Firestore inicializado:', !!db);

export { auth, db };
export default app;