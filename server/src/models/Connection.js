/**
 * Model de Conexão entre Psicólogo e Paciente
 *
 * Representa uma conexão ativa entre profissional e paciente
 */

class Connection {
  constructor(data) {
    this.id = data.id || null;
    this.code = data.code; // Código de 6 caracteres
    this.psychologistId = data.psychologistId;
    this.psychologistName = data.psychologistName;
    this.patientId = data.patientId || null;
    this.patientName = data.patientName || null;
    this.patientEmail = data.patientEmail || null;
    this.status = data.status || 'pending'; // pending, active, expired
    this.createdAt = data.createdAt || new Date();
    this.connectedAt = data.connectedAt || null;
    this.expiresAt = data.expiresAt || this.calculateExpiration();
  }

  /**
   * Calcula data de expiração (24 horas)
   */
  calculateExpiration() {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    return expiration;
  }

  /**
   * Converte para objeto do Firestore
   */
  toFirestore() {
    return {
      code: this.code,
      psychologistId: this.psychologistId,
      psychologistName: this.psychologistName,
      patientId: this.patientId,
      patientName: this.patientName,
      patientEmail: this.patientEmail,
      status: this.status,
      createdAt: this.createdAt,
      connectedAt: this.connectedAt,
      expiresAt: this.expiresAt,
    };
  }

  /**
   * Cria Connection a partir de documento do Firestore
   */
  static fromFirestore(doc) {
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return new Connection({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      connectedAt: data.connectedAt?.toDate?.() || data.connectedAt,
      expiresAt: data.expiresAt?.toDate?.() || data.expiresAt,
    });
  }

  /**
   * Verifica se o código está expirado
   */
  isExpired() {
    return new Date() > this.expiresAt;
  }

  /**
   * Marca conexão como ativa
   */
  activate(patientId, patientName, patientEmail) {
    this.patientId = patientId;
    this.patientName = patientName;
    this.patientEmail = patientEmail;
    this.status = 'active';
    this.connectedAt = new Date();
  }

  /**
   * Validação
   */
  validate() {
    const errors = [];

    if (!this.code || this.code.length !== 6) {
      errors.push('Código deve ter 6 caracteres');
    }

    if (!this.psychologistId) {
      errors.push('ID do psicólogo é obrigatório');
    }

    if (!this.psychologistName) {
      errors.push('Nome do psicólogo é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = Connection;
