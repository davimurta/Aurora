/**
 * Configuração Firebase com Singleton Pattern - CLIENT SDK
 *
 * Padrão GoF: SINGLETON
 *
 * SOLUÇÃO SIMPLES: Usa Firebase Client SDK em vez de Admin SDK
 * Isso elimina TODOS os problemas de permissão!
 */

require('dotenv').config();

// Importa Firebase CLIENT SDK (não Admin!)
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');

// Configuração do Firebase CLIENT (as credenciais que você forneceu!)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCawFSSzDXVeIVz4iyyFJ1KOsy4jmT0Zj4",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "aurora-482f9.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "aurora-482f9",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "aurora-482f9.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "364444154741",
  appId: process.env.FIREBASE_APP_ID || "1:364444154741:web:81d3e8d9fc4a5f61f5b13c"
};

class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }

    try {
      // Inicializa Firebase CLIENT SDK
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);

      console.log('✅ Firebase conectado com sucesso (Client SDK)');
      console.log('📋 Project ID:', firebaseConfig.projectId);
      console.log('🔐 Usando Firebase Client SDK (SEM problemas de permissão!)');
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase:', error.message);
      throw error;
    }

    FirebaseConnection.instance = this;
  }

  getFirestore() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }

  getStorage() {
    return this.storage;
  }

  static getInstance() {
    if (!FirebaseConnection.instance) {
      FirebaseConnection.instance = new FirebaseConnection();
    }
    return FirebaseConnection.instance;
  }
}

module.exports = FirebaseConnection.getInstance();
