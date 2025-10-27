/**
 * AuthStrategy
 *
 * Padrão GoF: STRATEGY
 *
 * Propósito: Define uma família de algoritmos de autenticação, encapsula cada um deles
 * e os torna intercambiáveis. O Strategy permite que o algoritmo varie independentemente
 * dos clientes que o utilizam.
 *
 * Benefícios:
 * - Flexibilidade para trocar estratégias em tempo de execução
 * - Facilita adição de novos métodos de autenticação
 * - Elimina condicionais complexas
 * - Princípio Open/Closed (aberto para extensão, fechado para modificação)
 */

const firebase = require('../config/firebase');

/**
 * Interface abstrata para estratégias de autenticação
 */
class AuthStrategy {
  async authenticate(credentials) {
    throw new Error('Método authenticate() deve ser implementado');
  }

  async validateCredentials(credentials) {
    throw new Error('Método validateCredentials() deve ser implementado');
  }
}

/**
 * STRATEGY 1: Autenticação com Email e Senha
 */
class EmailPasswordStrategy extends AuthStrategy {
  async authenticate(credentials) {
    const { email, password } = credentials;

    // Valida credenciais
    await this.validateCredentials(credentials);

    try {
      // Autentica usando Firebase Auth
      const auth = firebase.getAuth();
      const userRecord = await auth.getUserByEmail(email);

      // Nota: Em produção, usar Firebase Client SDK para verificar senha
      // Aqui apenas validamos se o usuário existe
      if (!userRecord) {
        throw new Error('Usuário não encontrado');
      }

      return {
        success: true,
        user: userRecord,
        strategy: 'email-password',
      };
    } catch (error) {
      throw new Error(`Falha na autenticação: ${error.message}`);
    }
  }

  async validateCredentials(credentials) {
    const { email, password } = credentials;

    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
  }
}

/**
 * STRATEGY 2: Autenticação Anônima (para usuários guest)
 */
class AnonymousStrategy extends AuthStrategy {
  async authenticate(credentials) {
    try {
      const auth = firebase.getAuth();

      // Cria usuário anônimo no Firebase
      const userRecord = await auth.createUser({
        displayName: 'Usuário Anônimo',
      });

      return {
        success: true,
        user: userRecord,
        strategy: 'anonymous',
        isAnonymous: true,
      };
    } catch (error) {
      throw new Error(`Falha na autenticação anônima: ${error.message}`);
    }
  }

  async validateCredentials(credentials) {
    // Autenticação anônima não requer validação de credenciais
    return true;
  }
}

/**
 * STRATEGY 3: Autenticação com Token (para integrações)
 */
class TokenStrategy extends AuthStrategy {
  async authenticate(credentials) {
    const { token } = credentials;

    await this.validateCredentials(credentials);

    try {
      const auth = firebase.getAuth();

      // Verifica o token usando Firebase Admin
      const decodedToken = await auth.verifyIdToken(token);

      // Busca usuário
      const userRecord = await auth.getUser(decodedToken.uid);

      return {
        success: true,
        user: userRecord,
        strategy: 'token',
        decodedToken,
      };
    } catch (error) {
      throw new Error(`Token inválido: ${error.message}`);
    }
  }

  async validateCredentials(credentials) {
    const { token } = credentials;

    if (!token || token.length < 10) {
      throw new Error('Token inválido');
    }
  }
}

/**
 * Context: Gerenciador de estratégias de autenticação
 */
class AuthContext {
  constructor() {
    this.strategy = null;
    this.strategies = {
      'email-password': new EmailPasswordStrategy(),
      anonymous: new AnonymousStrategy(),
      token: new TokenStrategy(),
    };
  }

  /**
   * Define a estratégia de autenticação a ser usada
   */
  setStrategy(strategyName) {
    if (!this.strategies[strategyName]) {
      throw new Error(`Estratégia de autenticação '${strategyName}' não encontrada`);
    }

    this.strategy = this.strategies[strategyName];
    return this;
  }

  /**
   * Executa a autenticação com a estratégia selecionada
   */
  async authenticate(credentials) {
    if (!this.strategy) {
      throw new Error('Nenhuma estratégia de autenticação foi definida');
    }

    return await this.strategy.authenticate(credentials);
  }

  /**
   * Registra uma nova estratégia customizada
   */
  registerStrategy(name, strategy) {
    if (!(strategy instanceof AuthStrategy)) {
      throw new Error('Estratégia deve estender AuthStrategy');
    }

    this.strategies[name] = strategy;
  }

  /**
   * Lista estratégias disponíveis
   */
  getAvailableStrategies() {
    return Object.keys(this.strategies);
  }
}

module.exports = {
  AuthStrategy,
  EmailPasswordStrategy,
  AnonymousStrategy,
  TokenStrategy,
  AuthContext,
};
