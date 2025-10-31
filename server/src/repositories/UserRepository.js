const firebase = require('../config/firebase');
const User = require('../models/User');

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

  async create(userData) {
    try {
      const user = new User(userData);

      const validation = user.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const docRef = doc(this.db, this.collectionName, user.uid);
      await setDoc(docRef, user.toFirestore());

      return user;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async update(uid, userData) {
    try {
      const docRef = doc(this.db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const existingData = docSnap.data();
      const updatedUser = new User({ ...existingData, ...userData, uid });
      updatedUser.updatedAt = new Date();

      const validation = updatedUser.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      await updateDoc(docRef, updatedUser.toFirestore());

      return updatedUser;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async delete(uid) {
    try {
      const docRef = doc(this.db, this.collectionName, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }

      await updateDoc(docRef, {
        isActive: false,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  async hardDelete(uid) {
    try {
      const docRef = doc(this.db, this.collectionName, uid);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar permanentemente usuário: ${error.message}`);
    }
  }

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
