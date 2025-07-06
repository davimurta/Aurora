import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDItn0WJilcoJu47FIu3G84MM6hKZ5_ovQ",
  authDomain: "aurora-89693.firebaseapp.com",
  projectId: "aurora-89693",
  storageBucket: "aurora-89693.firebasestorage.app",
  messagingSenderId: "350816802966",
  appId: "1:350816802966:web:53d5708dcc8e90517a4ab7"
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