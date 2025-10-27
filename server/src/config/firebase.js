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

const admin = require('firebase-admin');

class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }

    // Inicializa Firebase Admin SDK
    // Nota: Em produção, use variáveis de ambiente para as credenciais
    this.app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // Ou use um service account JSON:
      // credential: admin.credential.cert(require('./serviceAccountKey.json')),
    });

    this.db = admin.firestore();
    this.auth = admin.auth();
    this.storage = admin.storage();

    console.log('✅ Firebase conectado com sucesso (Singleton Pattern)');

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
