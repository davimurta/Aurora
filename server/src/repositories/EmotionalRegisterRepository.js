/**
 * EmotionalRegisterRepository
 *
 * Padrão: REPOSITORY PATTERN
 *
 * Propósito: Encapsula toda a lógica de acesso a dados relacionada a registros
 * emocionais diários, abstraindo os detalhes de persistência do Firebase.
 *
 * Benefícios:
 * - Separação de responsabilidades (SRP)
 * - Facilita testes (pode ser mockado)
 * - Facilita mudança de banco de dados no futuro
 * - Centraliza queries e operações de dados
 */

const firebase = require('../config/firebase');
const EmotionalRegister = require('../models/EmotionalRegister');

// Importa funções do Firebase Client SDK
const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} = require('firebase/firestore');

class EmotionalRegisterRepository {
  constructor() {
    this.db = firebase.getFirestore();
    this.collectionName = 'emotionalRegisters';
  }

  /**
   * Busca todos os registros de um usuário
   */
  async findByUserId(userId, limitCount = 100) {
    try {
      const registersRef = collection(this.db, this.collectionName);
      const q = query(
        registersRef,
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return EmotionalRegister.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar registros do usuário: ${error.message}`);
    }
  }

  /**
   * Busca registros de um usuário em um mês específico
   */
  async findByMonth(userId, year, month) {
    try {
      console.log('🔵 [EmotionalRegisterRepository] findByMonth chamado');
      console.log('🔵 [EmotionalRegisterRepository] userId:', userId);
      console.log('🔵 [EmotionalRegisterRepository] year:', year);
      console.log('🔵 [EmotionalRegisterRepository] month:', month);

      const registersRef = collection(this.db, this.collectionName);
      // month já vem correto (1-12) do frontend, NÃO precisa +1
      const monthPrefix = `${year}-${String(month).padStart(2, '0')}-`;

      console.log('🔵 [EmotionalRegisterRepository] monthPrefix:', monthPrefix);

      // Busca todos do usuário e filtra em memória (evita necessidade de índice composto)
      const q = query(
        registersRef,
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);

      console.log('🔵 [EmotionalRegisterRepository] Total de registros do usuário:', snapshot.docs.length);

      const allRegisters = snapshot.docs.map((doc) => {
        return EmotionalRegister.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });

      console.log('🔵 [EmotionalRegisterRepository] Registros formatados:', allRegisters.length);
      console.log('🔵 [EmotionalRegisterRepository] Datas dos registros:', allRegisters.map(r => r.date));

      // Filtra pelo mês específico
      const filtered = allRegisters.filter(register => {
        const matches = register.date.startsWith(monthPrefix);
        console.log(`  - ${register.date} starts with ${monthPrefix}? ${matches}`);
        return matches;
      });

      console.log('✅ [EmotionalRegisterRepository] Registros filtrados:', filtered.length);

      return filtered;
    } catch (error) {
      console.error('❌ [EmotionalRegisterRepository] Erro:', error);
      throw new Error(`Erro ao buscar registros do mês: ${error.message}`);
    }
  }

  /**
   * Busca um registro específico por data
   */
  async findByDate(userId, dateString) {
    try {
      const registerId = `${userId}_${dateString}`;
      const docRef = doc(this.db, this.collectionName, registerId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return EmotionalRegister.fromFirestore({
        id: docSnap.id,
        data: () => docSnap.data(),
        exists: true,
      });
    } catch (error) {
      throw new Error(`Erro ao buscar registro por data: ${error.message}`);
    }
  }

  /**
   * Cria ou atualiza um registro emocional
   */
  async save(registerData) {
    try {
      const register = new EmotionalRegister(registerData);

      // Valida os dados
      const validation = register.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Define ID único baseado em userId e data
      const registerId = `${register.userId}_${register.date}`;
      register.id = registerId;

      // Atualiza updatedAt
      register.updatedAt = new Date();

      // Salva no Firestore
      const docRef = doc(this.db, this.collectionName, registerId);
      await setDoc(docRef, register.toFirestore(), { merge: true });

      return register;
    } catch (error) {
      throw new Error(`Erro ao salvar registro: ${error.message}`);
    }
  }

  /**
   * Remove um registro
   */
  async delete(userId, dateString) {
    try {
      const registerId = `${userId}_${dateString}`;
      const docRef = doc(this.db, this.collectionName, registerId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Registro não encontrado');
      }

      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar registro: ${error.message}`);
    }
  }

  /**
   * Calcula estatísticas do mês (quantidade de cada humor)
   */
  async getMonthStatistics(userId, year, month) {
    try {
      const registers = await this.findByMonth(userId, year, month);

      const statistics = {
        total: registers.length,
        byMood: {
          1: 0, // Muito triste
          2: 0, // Triste
          3: 0, // Neutro
          4: 0, // Bem
          5: 0, // Muito bem
          6: 0, // Radiante
        },
        averageIntensity: 0,
      };

      if (registers.length === 0) {
        return statistics;
      }

      let totalIntensity = 0;
      registers.forEach(register => {
        statistics.byMood[register.moodId]++;
        totalIntensity += register.intensityValue;
      });

      statistics.averageIntensity = Math.round(totalIntensity / registers.length);

      return statistics;
    } catch (error) {
      throw new Error(`Erro ao calcular estatísticas: ${error.message}`);
    }
  }
}

module.exports = EmotionalRegisterRepository;
