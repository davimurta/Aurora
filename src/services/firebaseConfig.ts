import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAW75zDx9MJasZMKPQhgMkduqrznuSiRKk",
  authDomain: "aurora-96140.firebaseapp.com",
  projectId: "aurora-96140",
  storageBucket: "aurora-96140.firebasestorage.app",
  messagingSenderId: "573597509865",
  appId: "1:573597509865:web:1b88e3a1f9f3823edb6878"
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