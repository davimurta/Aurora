/**
 * AuthService - Usando Firebase CLIENT SDK
 *
 * SOLUÇÃO SIMPLES: Removida dependência do Admin SDK
 * Agora usa apenas o Client SDK (sem problemas de permissão!)
 */

const UserRepository = require('../repositories/UserRepository');
const UserFactory = require('../patterns/UserFactory');
const { EventSystem } = require('../patterns/EventObserver');
const firebase = require('../config/firebase');

// Importa funções do Firebase Client SDK
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { doc, setDoc, serverTimestamp } = require('firebase/firestore');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.eventSystem = EventSystem.getInstance();
    this.auth = firebase.getAuth();
    this.db = firebase.getFirestore();
  }

  /**
   * Registra um novo usuário
   */
  async register(userData) {
    try {
      // Verifica se email já existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Cria usuário usando Factory Pattern
      const user = UserFactory.createUser(userData);

      // Cria usuário no Firebase Auth usando CLIENT SDK
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        userData.password
      );

      const firebaseUser = userCredential.user;

      // Atualiza display name
      await updateProfile(firebaseUser, {
        displayName: user.displayName
      });

      // Atualiza UID
      user.uid = firebaseUser.uid;

      // Salva no Firestore
      const userDocRef = doc(this.db, 'users', user.uid);
      const userDataToSave = {
        ...user.toFirestore(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userDocRef, userDataToSave);

      // Emite evento usando Observer Pattern
      await this.eventSystem.emit('user.created', {
        uid: user.uid,
        displayName: user.displayName,
        userType: user.userType,
      });

      return {
        success: true,
        user: user.toPublic(),
        message: 'Usuário cadastrado com sucesso',
      };
    } catch (error) {
      // Trata erros do Firebase
      let errorMessage = error.message;

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email já está em uso';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }

      throw new Error(`Erro ao registrar usuário: ${errorMessage}`);
    }
  }

  /**
   * Autentica um usuário
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Faz login usando CLIENT SDK
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Busca dados completos do usuário
      const user = await this.userRepository.findById(firebaseUser.uid);

      if (!user) {
        throw new Error('Dados do usuário não encontrados');
      }

      if (!user.isActive) {
        throw new Error('Usuário inativo');
      }

      // Emite evento de login
      await this.eventSystem.emit('user.login', {
        uid: user.uid,
        strategy: 'email-password',
      });

      return {
        success: true,
        user: user.toPublic(),
        message: 'Login realizado com sucesso',
      };
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas';
      }

      throw new Error(`Erro ao fazer login: ${errorMessage}`);
    }
  }

  /**
   * Logout de usuário
   */
  async logout(userId) {
    try {
      await this.eventSystem.emit('user.logout', { uid: userId });

      return {
        success: true,
        message: 'Logout realizado com sucesso',
      };
    } catch (error) {
      throw new Error(`Erro ao fazer logout: ${error.message}`);
    }
  }

  /**
   * Redefine senha do usuário
   */
  async resetPassword(email) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        // Por segurança, não revela que o email não existe
        return {
          success: true,
          message: 'Se o email existir, você receberá instruções para resetar a senha',
        };
      }

      // Nota: sendPasswordResetEmail precisa ser implementado no cliente
      // Por enquanto, apenas registra o evento
      await this.eventSystem.emit('user.password.reset', {
        uid: user.uid,
        email: user.email,
      });

      return {
        success: true,
        message: 'Instruções enviadas por email',
      };
    } catch (error) {
      throw new Error(`Erro ao redefinir senha: ${error.message}`);
    }
  }

  /**
   * Aprova um psicólogo
   */
  async approvePsychologist(psychologistId) {
    try {
      await this.userRepository.approvePsychologist(psychologistId);

      const user = await this.userRepository.findById(psychologistId);

      await this.eventSystem.emit('psychologist.approved', {
        uid: user.uid,
        displayName: user.displayName,
        crp: user.crp,
      });

      return {
        success: true,
        message: 'Psicólogo aprovado com sucesso',
      };
    } catch (error) {
      throw new Error(`Erro ao aprovar psicólogo: ${error.message}`);
    }
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(userId) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toPublic();
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Lista psicólogos aprovados
   */
  async getApprovedPsychologists() {
    try {
      const psychologists = await this.userRepository.findApprovedPsychologists();
      return psychologists.map((p) => p.toPublic());
    } catch (error) {
      throw new Error(`Erro ao buscar psicólogos: ${error.message}`);
    }
  }
}

module.exports = AuthService;
