/**
 * Configuração Firebase com Singleton Pattern
 *
 * Padrão GoF: SINGLETON
 *
 * Propósito: Garantir que apenas uma instância da conexão Firebase
 * seja criada e reutilizada em toda a aplicação, economizando recursos
 * e mantendo consistência nas operações com o banco de dados.
 *
 * Benefícios:
 * - Uma única instância compartilhada
 * - Lazy initialization (criação sob demanda)
 * - Controle de acesso global à conexão
 */

require('dotenv').config();
const admin = require('firebase-admin');

class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }

    // Configuração do Firebase Admin SDK
    let credential;

    // Opção 1: Service Account Key (RECOMENDADO para produção)
    // Baixe o arquivo em: Firebase Console > Project Settings > Service Accounts
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS));
      console.log('🔑 Usando Service Account Key');
    }
    // Opção 2: Application Default Credentials (para Google Cloud)
    else {
      try {
        credential = admin.credential.applicationDefault();
        console.log('🔑 Usando Application Default Credentials');
      } catch (error) {
        // Opção 3: Modo de desenvolvimento (funcionalidade limitada)
        console.warn('⚠️  ATENÇÃO: Rodando sem credenciais completas do Admin SDK');
        console.warn('⚠️  Algumas funcionalidades podem não funcionar corretamente');
        console.warn('⚠️  Para produção, baixe o Service Account Key do Firebase Console');
        credential = null;
      }
    }

    // Inicializa Firebase Admin SDK
    const config = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'aurora-login-f8398',
    };

    if (credential) {
      config.credential = credential;
    }

    this.app = admin.initializeApp(config);

    this.db = admin.firestore();
    this.auth = admin.auth();
    this.storage = admin.storage();

    console.log('✅ Firebase conectado com sucesso (Singleton Pattern)');
    console.log(`📋 Project ID: ${process.env.FIREBASE_PROJECT_ID || 'aurora-login-f8398'}`);

    FirebaseConnection.instance = this;
  }

  // Métodos para acessar os serviços Firebase
  getFirestore() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }

  getStorage() {
    return this.storage;
  }

  // Método estático para obter a instância (Singleton)
  static getInstance() {
    if (!FirebaseConnection.instance) {
      FirebaseConnection.instance = new FirebaseConnection();
    }
    return FirebaseConnection.instance;
  }
}

// Exporta a instância única
module.exports = FirebaseConnection.getInstance();
