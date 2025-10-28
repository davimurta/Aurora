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
const path = require('path');
const fs = require('fs');

/**
 * Limpa e formata a private key para o formato correto
 */
function formatPrivateKey(key) {
  if (!key) return null;

  // Remove aspas extras se existirem
  let formattedKey = key.replace(/^["']|["']$/g, '');

  // Substitui literais \n por quebras de linha reais
  formattedKey = formattedKey.replace(/\\n/g, '\n');

  // Remove espaços em branco extras no início e fim
  formattedKey = formattedKey.trim();

  return formattedKey;
}

class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }

    // Configuração do Firebase Admin SDK
    let credential;
    let credentialMethod = 'none';

    // Opção 1: Credenciais diretas do .env (RECOMENDADO)
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      try {
        const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

        if (!privateKey) {
          throw new Error('Private key vazia após formatação');
        }

        credential = admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        });

        credentialMethod = 'environment variables';
        console.log('🔑 Usando credenciais do .env');
      } catch (error) {
        console.error('❌ Erro ao carregar credenciais do .env:', error.message);
        credential = null;
      }
    }
    // Opção 2: Service Account Key File
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        // Tenta múltiplos caminhos possíveis
        const possiblePaths = [
          // Caminho relativo à pasta server/
          path.resolve(__dirname, '../..', process.env.GOOGLE_APPLICATION_CREDENTIALS),
          // Caminho relativo à pasta raiz do projeto
          path.resolve(__dirname, '../../..', process.env.GOOGLE_APPLICATION_CREDENTIALS),
          // Caminho absoluto (se fornecido)
          path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        ];

        let keyPath = null;
        let foundPath = false;

        // Tenta cada caminho até encontrar o arquivo
        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            keyPath = testPath;
            foundPath = true;
            console.log('✅ Service Account Key encontrado em:', keyPath);
            break;
          }
        }

        if (!foundPath) {
          console.error('❌ Service Account Key não encontrado. Tentei:');
          possiblePaths.forEach((p) => console.error('   -', p));
          throw new Error('Arquivo serviceAccountKey.json não encontrado');
        }

        const serviceAccount = require(keyPath);
        credential = admin.credential.cert(serviceAccount);
        credentialMethod = 'service account file';
        console.log('🔑 Usando Service Account Key File');
      } catch (error) {
        console.error('❌ Erro ao carregar Service Account Key:', error.message);
        credential = null;
      }
    }
    // Opção 3: Application Default Credentials (para Google Cloud)
    else {
      try {
        credential = admin.credential.applicationDefault();
        credentialMethod = 'application default';
        console.log('🔑 Usando Application Default Credentials');
      } catch (error) {
        console.warn('⚠️  ATENÇÃO: Nenhuma credencial Firebase foi encontrada!');
        console.warn('⚠️  Opção 1: Configure o .env com FIREBASE_PRIVATE_KEY e FIREBASE_CLIENT_EMAIL');
        console.warn('⚠️  Opção 2: Coloque serviceAccountKey.json na pasta server/');
        credential = null;
      }
    }

    // Inicializa Firebase Admin SDK
    const config = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'aurora-482f9',
    };

    if (credential) {
      config.credential = credential;
    }

    try {
      this.app = admin.initializeApp(config);
      this.db = admin.firestore();
      this.auth = admin.auth();
      this.storage = admin.storage();

      console.log('✅ Firebase conectado com sucesso (Singleton Pattern)');
      console.log(`📋 Project ID: ${config.projectId}`);
      console.log(`🔐 Credential Method: ${credentialMethod}`);
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase:', error.message);
      console.error('❌ Stack completo:', error.stack);
      throw error;
    }

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
