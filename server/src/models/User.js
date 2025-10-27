/**
 * Model: User
 *
 * Representa a estrutura de dados de um usuário no sistema.
 * Este modelo define as propriedades básicas e métodos auxiliares
 * para manipulação de dados de usuários.
 */

class User {
  constructor(data) {
    this.uid = data.uid || null;
    this.email = data.email || '';
    this.displayName = data.displayName || '';
    this.userType = data.userType || 'paciente'; // 'paciente' ou 'psicologo'
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;

    // Dados específicos de paciente
    if (this.userType === 'paciente') {
      this.idade = data.idade || null;
      this.genero = data.genero || '';
      this.telefone = data.telefone || '';
    }

    // Dados específicos de psicólogo
    if (this.userType === 'psicologo') {
      this.crp = data.crp || '';
      this.especialidade = data.especialidade || '';
      this.bio = data.bio || '';
      this.telefone = data.telefone || '';
      this.isApproved = data.isApproved || false;
    }
  }

  /**
   * Converte o modelo para um objeto simples (para salvar no Firebase)
   */
  toFirestore() {
    const data = {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      userType: this.userType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
    };

    // Adiciona campos específicos do tipo de usuário
    if (this.userType === 'paciente') {
      data.idade = this.idade;
      data.genero = this.genero;
      data.telefone = this.telefone;
    } else if (this.userType === 'psicologo') {
      data.crp = this.crp;
      data.especialidade = this.especialidade;
      data.bio = this.bio;
      data.telefone = this.telefone;
      data.isApproved = this.isApproved;
    }

    return data;
  }

  /**
   * Cria uma instância de User a partir de dados do Firestore
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({ ...data, uid: doc.id });
  }

  /**
   * Valida se os dados do usuário são válidos
   */
  validate() {
    const errors = [];

    if (!this.email || !this.email.includes('@')) {
      errors.push('Email inválido');
    }

    if (!this.displayName || this.displayName.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!['paciente', 'psicologo'].includes(this.userType)) {
      errors.push('Tipo de usuário inválido');
    }

    if (this.userType === 'psicologo' && (!this.crp || this.crp.length < 5)) {
      errors.push('CRP inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Retorna representação pública do usuário (sem dados sensíveis)
   */
  toPublic() {
    const publicData = {
      uid: this.uid,
      displayName: this.displayName,
      userType: this.userType,
    };

    if (this.userType === 'psicologo') {
      publicData.especialidade = this.especialidade;
      publicData.bio = this.bio;
      publicData.isApproved = this.isApproved;
    }

    return publicData;
  }
}

module.exports = User;
