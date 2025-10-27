/**
 * UserFactory
 *
 * Padrão GoF: FACTORY METHOD
 *
 * Propósito: Criar instâncias de diferentes tipos de usuários (Paciente ou Psicólogo)
 * sem que o código cliente precise conhecer os detalhes de construção.
 * O Factory encapsula a lógica de criação e inicialização de objetos complexos.
 *
 * Benefícios:
 * - Encapsula a lógica de criação
 * - Facilita adição de novos tipos de usuários
 * - Reduz acoplamento
 * - Centraliza inicialização de objetos
 */

const User = require('../models/User');

class UserFactory {
  /**
   * Cria uma instância de usuário baseado no tipo
   * @param {Object} userData - Dados do usuário
   * @param {string} userData.userType - Tipo do usuário ('paciente' ou 'psicologo')
   * @returns {User} Instância de User configurada para o tipo específico
   */
  static createUser(userData) {
    const { userType } = userData;

    switch (userType) {
      case 'paciente':
        return this.createPaciente(userData);

      case 'psicologo':
        return this.createPsicologo(userData);

      default:
        throw new Error(`Tipo de usuário inválido: ${userType}`);
    }
  }

  /**
   * Cria um usuário do tipo Paciente
   * @private
   */
  static createPaciente(userData) {
    const pacienteData = {
      ...userData,
      userType: 'paciente',
      idade: userData.idade || null,
      genero: userData.genero || '',
      telefone: userData.telefone || '',
      isActive: true,
    };

    const user = new User(pacienteData);

    // Validações específicas de paciente
    if (userData.idade && (userData.idade < 13 || userData.idade > 120)) {
      throw new Error('Idade deve estar entre 13 e 120 anos');
    }

    return user;
  }

  /**
   * Cria um usuário do tipo Psicólogo
   * @private
   */
  static createPsicologo(userData) {
    const psicologoData = {
      ...userData,
      userType: 'psicologo',
      crp: userData.crp || '',
      especialidade: userData.especialidade || '',
      bio: userData.bio || '',
      telefone: userData.telefone || '',
      isApproved: false, // Por padrão, psicólogos precisam ser aprovados
      isActive: true,
    };

    const user = new User(psicologoData);

    // Validações específicas de psicólogo
    if (!userData.crp || userData.crp.length < 5) {
      throw new Error('CRP é obrigatório e deve ter pelo menos 5 caracteres');
    }

    if (!userData.especialidade) {
      throw new Error('Especialidade é obrigatória para psicólogos');
    }

    return user;
  }

  /**
   * Cria um usuário mock para testes
   */
  static createMockUser(userType = 'paciente') {
    const mockData = {
      email: `teste_${Date.now()}@example.com`,
      displayName: `Usuário Teste ${Date.now()}`,
      userType,
    };

    if (userType === 'paciente') {
      mockData.idade = 25;
      mockData.genero = 'Outro';
      mockData.telefone = '11999999999';
    } else if (userType === 'psicologo') {
      mockData.crp = 'CRP-01/12345';
      mockData.especialidade = 'Psicologia Clínica';
      mockData.bio = 'Psicólogo especializado em terapia cognitivo-comportamental';
      mockData.telefone = '11888888888';
    }

    return this.createUser(mockData);
  }

  /**
   * Cria múltiplos usuários em lote
   */
  static createBatch(usersData) {
    return usersData.map((userData) => this.createUser(userData));
  }

  /**
   * Converte dados do Firebase Auth para User
   */
  static fromFirebaseAuth(firebaseUser, additionalData = {}) {
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      ...additionalData,
    };

    return this.createUser(userData);
  }
}

module.exports = UserFactory;
