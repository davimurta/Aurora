class Connection {
  constructor(data) {
    this.id = data.id || null;
    this.code = data.code;
    this.psychologistId = data.psychologistId;
    this.psychologistName = data.psychologistName;
    this.patientId = data.patientId || null;
    this.patientName = data.patientName || null;
    this.patientEmail = data.patientEmail || null;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt || new Date();
    this.connectedAt = data.connectedAt || null;
    this.expiresAt = data.expiresAt || this.calculateExpiration();
  }

  calculateExpiration() {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    return expiration;
  }

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

  isExpired() {
    return new Date() > this.expiresAt;
  }

  activate(patientId, patientName, patientEmail) {
    this.patientId = patientId;
    this.patientName = patientName;
    this.patientEmail = patientEmail;
    this.status = 'active';
    this.connectedAt = new Date();
  }

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
