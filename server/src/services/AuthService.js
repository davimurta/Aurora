/**
 * AuthService
 *
 * Camada de serviço para operações de autenticação.
 * Orquestra a lógica de negócios relacionada a autenticação,
 * utilizando repositories, factories e strategies.
 */

const UserRepository = require('../repositories/UserRepository');
const UserFactory = require('../patterns/UserFactory');
const { AuthContext } = require('../patterns/AuthStrategy');
const { EventSystem } = require('../patterns/EventObserver');
const firebase = require('../config/firebase');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.authContext = new AuthContext();
    this.eventSystem = EventSystem.getInstance();
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

      // Cria usuário no Firebase Auth
      const auth = firebase.getAuth();
      const firebaseUser = await auth.createUser({
        email: user.email,
        password: userData.password,
        displayName: user.displayName,
      });

      // Atualiza UID
      user.uid = firebaseUser.uid;

      // Salva no Firestore usando Repository
      await this.userRepository.create(user.toFirestore());

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
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  /**
   * Autentica um usuário usando Strategy Pattern
   */
  async login(credentials, strategyName = 'email-password') {
    try {
      // Define a estratégia de autenticação
      this.authContext.setStrategy(strategyName);

      // Autentica usando a estratégia selecionada
      const authResult = await this.authContext.authenticate(credentials);

      // Busca dados completos do usuário
      const user = await this.userRepository.findById(authResult.user.uid);

      if (!user) {
        throw new Error('Dados do usuário não encontrados');
      }

      if (!user.isActive) {
        throw new Error('Usuário inativo');
      }

      // Emite evento de login
      await this.eventSystem.emit('user.login', {
        uid: user.uid,
        strategy: strategyName,
      });

      return {
        success: true,
        user: user.toPublic(),
        strategy: authResult.strategy,
        message: 'Login realizado com sucesso',
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  /**
   * Logout de usuário
   */
  async logout(userId) {
    try {
      // Firebase Admin SDK não tem logout, mas podemos registrar o evento
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
          message: 'Email de redefinição enviado, se o usuário existir',
        };
      }

      // Gera link de redefinição de senha
      const auth = firebase.getAuth();
      const resetLink = await auth.generatePasswordResetLink(email);

      await this.eventSystem.emit('user.password.reset', {
        uid: user.uid,
        email: user.email,
      });

      // Em produção, enviar email com o link
      console.log(`🔑 Link de redefinição: ${resetLink}`);

      return {
        success: true,
        message: 'Email de redefinição enviado',
        resetLink, // Remover em produção
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
