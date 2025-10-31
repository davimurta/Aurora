const firebase = require('../config/firebase');

class AuthStrategy {
  async authenticate(credentials) {
    throw new Error('Método authenticate() deve ser implementado');
  }

  async validateCredentials(credentials) {
    throw new Error('Método validateCredentials() deve ser implementado');
  }
}

class EmailPasswordStrategy extends AuthStrategy {
  async authenticate(credentials) {
    const { email, password } = credentials;

    await this.validateCredentials(credentials);

    try {
      const auth = firebase.getAuth();
      const userRecord = await auth.getUserByEmail(email);

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

class AnonymousStrategy extends AuthStrategy {
  async authenticate(credentials) {
    try {
      const auth = firebase.getAuth();

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
    return true;
  }
}
class TokenStrategy extends AuthStrategy {
  async authenticate(credentials) {
    const { token } = credentials;

    await this.validateCredentials(credentials);

    try {
      const auth = firebase.getAuth();

      const decodedToken = await auth.verifyIdToken(token);

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

class AuthContext {
  constructor() {
    this.strategy = null;
    this.strategies = {
      'email-password': new EmailPasswordStrategy(),
      anonymous: new AnonymousStrategy(),
      token: new TokenStrategy(),
    };
  }

  setStrategy(strategyName) {
    if (!this.strategies[strategyName]) {
      throw new Error(`Estratégia de autenticação '${strategyName}' não encontrada`);
    }

    this.strategy = this.strategies[strategyName];
    return this;
  }

  async authenticate(credentials) {
    if (!this.strategy) {
      throw new Error('Nenhuma estratégia de autenticação foi definida');
    }

    return await this.strategy.authenticate(credentials);
  }

  registerStrategy(name, strategy) {
    if (!(strategy instanceof AuthStrategy)) {
      throw new Error('Estratégia deve estender AuthStrategy');
    }

    this.strategies[name] = strategy;
  }

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
