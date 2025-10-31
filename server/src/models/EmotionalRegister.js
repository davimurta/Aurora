class EmotionalRegister {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || '';
    this.selectedMood = data.selectedMood || '';
    this.moodId = data.moodId || 3; // Neutro por padrão
    this.intensityValue = data.intensityValue || 50;
    this.diaryText = data.diaryText || '';
    this.date = data.date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  validate() {
    const errors = [];

    if (!this.userId || this.userId.trim() === '') {
      errors.push('userId é obrigatório');
    }

    if (!this.selectedMood || this.selectedMood.trim() === '') {
      errors.push('selectedMood é obrigatório');
    }

    if (typeof this.moodId !== 'number' || this.moodId < 1 || this.moodId > 6) {
      errors.push('moodId deve estar entre 1 e 6');
    }

    if (typeof this.intensityValue !== 'number' || this.intensityValue < 0 || this.intensityValue > 100) {
      errors.push('intensityValue deve estar entre 0 e 100');
    }

    if (!this.diaryText || this.diaryText.trim() === '') {
      errors.push('diaryText é obrigatório');
    }

    if (this.diaryText && this.diaryText.length > 500) {
      errors.push('diaryText não pode ter mais de 500 caracteres');
    }

    if (!this.date || !/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
      errors.push('date deve estar no formato YYYY-MM-DD');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  toFirestore() {
    return {
      id: this.id,
      userId: this.userId,
      selectedMood: this.selectedMood,
      moodId: this.moodId,
      intensityValue: this.intensityValue,
      diaryText: this.diaryText.trim(),
      date: this.date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return new EmotionalRegister({
      id: doc.id,
      ...data,
    });
  }

  toPublic() {
    return {
      id: this.id,
      userId: this.userId,
      selectedMood: this.selectedMood,
      moodId: this.moodId,
      intensityValue: this.intensityValue,
      diaryText: this.diaryText,
      date: this.date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static getMoodLabel(moodId) {
    const moods = {
      1: 'Muito triste',
      2: 'Triste',
      3: 'Neutro',
      4: 'Bem',
      5: 'Muito bem',
      6: 'Radiante',
    };
    return moods[moodId] || 'Neutro';
  }

  static formatDateKey(year, month, day) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  }
}

module.exports = EmotionalRegister;
