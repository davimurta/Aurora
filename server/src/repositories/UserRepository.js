/**
 * UserRepository
 *
 * Padrão: REPOSITORY PATTERN
 *
 * Propósito: Encapsula toda a lógica de acesso a dados relacionada a usuários,
 * abstraindo os detalhes de persistência do Firebase. Isso permite que o código
 * de negócios (controllers/services) não precise conhecer os detalhes de como
 * os dados são armazenados ou recuperados.
 *
 * Benefícios:
 * - Separação de responsabilidades (SRP)
 * - Facilita testes (pode ser mockado)
 * - Facilita mudança de banco de dados no futuro
 * - Centraliza queries e operações de dados
 */

const firebase = require('../config/firebase');
const User = require('../models/User');

class UserRepository {
  constructor() {
    this.db = firebase.getFirestore();
    this.collectionName = 'users';
  }

  /**
   * Busca todos os usuários
   */
  async findAll() {
    try {
      const snapshot = await this.db.collection(this.collectionName).get();
      return snapshot.docs.map((doc) => User.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por ID
   */
  async findById(uid) {
    try {
      const doc = await this.db.collection(this.collectionName).doc(uid).get();

      if (!doc.exists) {
        return null;
      }

      return User.fromFirestore(doc);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return User.fromFirestore(snapshot.docs[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  /**
   * Busca usuários por tipo (paciente ou psicologo)
   */
  async findByType(userType) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('userType', '==', userType)
        .get();

      return snapshot.docs.map((doc) => User.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar usuários por tipo: ${error.message}`);
    }
  }

  /**
   * Busca psicólogos aprovados
   */
  async findApprovedPsychologists() {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('userType', '==', 'psicologo')
        .where('isApproved', '==', true)
        .get();

      return snapshot.docs.map((doc) => User.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar psicólogos aprovados: ${error.message}`);
    }
  }

  /**
   * Cria um novo usuário
   */
  async create(userData) {
    try {
      const user = new User(userData);

      // Valida os dados
      const validation = user.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Salva no Firestore
      const docRef = await this.db
        .collection(this.collectionName)
        .add(user.toFirestore());

      // Atualiza o UID
      user.uid = docRef.id;
      await docRef.update({ uid: docRef.id });

      return user;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Atualiza um usuário existente
   */
  async update(uid, userData) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(uid);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Usuário não encontrado');
      }

      // Mescla dados existentes com novos dados
      const existingData = doc.data();
      const updatedUser = new User({ ...existingData, ...userData, uid });
      updatedUser.updatedAt = new Date();

      // Valida os dados
      const validation = updatedUser.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Atualiza no Firestore
      await docRef.update(updatedUser.toFirestore());

      return updatedUser;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  /**
   * Remove um usuário (soft delete)
   */
  async delete(uid) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(uid);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Usuário não encontrado');
      }

      // Soft delete - marca como inativo
      await docRef.update({
        isActive: false,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  /**
   * Remove permanentemente um usuário
   */
  async hardDelete(uid) {
    try {
      await this.db.collection(this.collectionName).doc(uid).delete();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar permanentemente usuário: ${error.message}`);
    }
  }

  /**
   * Aprova um psicólogo
   */
  async approvePsychologist(uid) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(uid);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Usuário não encontrado');
      }

      const user = User.fromFirestore(doc);
      if (user.userType !== 'psicologo') {
        throw new Error('Usuário não é um psicólogo');
      }

      await docRef.update({
        isApproved: true,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      throw new Error(`Erro ao aprovar psicólogo: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
