/**
 * UserRepository - Usando Firebase CLIENT SDK
 *
 * Padrão: REPOSITORY PATTERN
 *
 * SOLUÇÃO SIMPLES: Removida dependência do Admin SDK
 * Agora usa apenas o Client SDK (sem problemas de permissão!)
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

// Importa funções do Firebase Client SDK
const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
} = require('firebase/firestore');

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
      const usersRef = collection(this.db, this.collectionName);
      const snapshot = await getDocs(usersRef);

      return snapshot.docs.map((doc) => {
        return User.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por ID
   */
  async findById(uid) {
    try {
      const docRef = doc(this.db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return User.fromFirestore({
        id: docSnap.id,
        data: () => docSnap.data(),
        exists: true,
      });
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email) {
    try {
      const usersRef = collection(this.db, this.collectionName);
      const q = query(usersRef, where('email', '==', email), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const firstDoc = snapshot.docs[0];
      return User.fromFirestore({
        id: firstDoc.id,
        data: () => firstDoc.data(),
        exists: true,
      });
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  /**
   * Busca usuários por tipo (paciente ou psicologo)
   */
  async findByType(userType) {
    try {
      const usersRef = collection(this.db, this.collectionName);
      const q = query(usersRef, where('userType', '==', userType));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return User.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar usuários por tipo: ${error.message}`);
    }
  }

  /**
   * Busca psicólogos aprovados
   */
  async findApprovedPsychologists() {
    try {
      const usersRef = collection(this.db, this.collectionName);
      const q = query(
        usersRef,
        where('userType', '==', 'psicologo'),
        where('isApproved', '==', true)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return User.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
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

      // Salva no Firestore usando o UID do Firebase Auth
      const docRef = doc(this.db, this.collectionName, user.uid);
      await setDoc(docRef, user.toFirestore());

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
      const docRef = doc(this.db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      // Mescla dados existentes com novos dados
      const existingData = docSnap.data();
      const updatedUser = new User({ ...existingData, ...userData, uid });
      updatedUser.updatedAt = new Date();

      // Valida os dados
      const validation = updatedUser.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Atualiza no Firestore
      await updateDoc(docRef, updatedUser.toFirestore());

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
      const docRef = doc(this.db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      // Soft delete - marca como inativo
      await updateDoc(docRef, {
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
      const docRef = doc(this.db, this.collectionName, uid);
      await deleteDoc(docRef);
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
      const docRef = doc(this.db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const user = User.fromFirestore({
        id: docSnap.id,
        data: () => docSnap.data(),
        exists: true,
      });

      if (user.userType !== 'psicologo') {
        throw new Error('Usuário não é um psicólogo');
      }

      await updateDoc(docRef, {
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
