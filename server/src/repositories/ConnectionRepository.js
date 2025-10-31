const { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, limit } = require('firebase/firestore');
const Connection = require('../models/Connection');

class ConnectionRepository {
  constructor() {
    this.db = getFirestore();
    this.collectionName = 'connections';
  }

  generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async create(connectionData) {
    try {
      let code = this.generateUniqueCode();
      let exists = await this.findByCode(code);

      while (exists) {
        code = this.generateUniqueCode();
        exists = await this.findByCode(code);
      }

      connectionData.code = code;

      const connection = new Connection(connectionData);

      const validation = connection.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const connectionsRef = collection(this.db, this.collectionName);
      const docRef = await addDoc(connectionsRef, connection.toFirestore());

      connection.id = docRef.id;
      return connection;
    } catch (error) {
      throw new Error(`Erro ao criar conexão: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      const connectionsRef = collection(this.db, this.collectionName);
      const q = query(connectionsRef, where('code', '==', code.toUpperCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      return Connection.fromFirestore(snapshot.docs[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar conexão por código: ${error.message}`);
    }
  }

  async activateConnection(code, patientId, patientName, patientEmail) {
    try {
      const connection = await this.findByCode(code);

      if (!connection) {
        throw new Error('Código não encontrado');
      }

      if (connection.isExpired()) {
        throw new Error('Código expirado');
      }

      if (connection.status === 'active') {
        throw new Error('Código já foi utilizado');
      }

      connection.activate(patientId, patientName, patientEmail);

      const docRef = doc(this.db, this.collectionName, connection.id);
      await updateDoc(docRef, connection.toFirestore());

      return connection;
    } catch (error) {
      throw new Error(`Erro ao ativar conexão: ${error.message}`);
    }
  }

  async findPatientsByPsychologist(psychologistId) {
    try {
      const connectionsRef = collection(this.db, this.collectionName);
      const q = query(
        connectionsRef,
        where('psychologistId', '==', psychologistId),
        where('status', '==', 'active'),
        orderBy('connectedAt', 'desc')
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => Connection.fromFirestore(doc));
    } catch (error) {
      try {
        const connectionsRef = collection(this.db, this.collectionName);
        const q = query(
          connectionsRef,
          where('psychologistId', '==', psychologistId),
          where('status', '==', 'active')
        );

        const snapshot = await getDocs(q);
        const connections = snapshot.docs.map(doc => Connection.fromFirestore(doc));

        return connections.sort((a, b) => b.connectedAt - a.connectedAt);
      } catch (innerError) {
        throw new Error(`Erro ao buscar pacientes: ${innerError.message}`);
      }
    }
  }

  async findPsychologistByPatient(patientId) {
    try {
      const connectionsRef = collection(this.db, this.collectionName);
      const q = query(
        connectionsRef,
        where('patientId', '==', patientId),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      return Connection.fromFirestore(snapshot.docs[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar psicólogo: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      return Connection.fromFirestore(docSnap);
    } catch (error) {
      throw new Error(`Erro ao buscar conexão: ${error.message}`);
    }
  }
}

module.exports = ConnectionRepository;
