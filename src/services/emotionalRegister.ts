import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { EmotionalRegister, CreateRegisterData } from '../models/emotionalRegister';

export const emotionalRegisterService = {
  /** 🔹 Salva (ou atualiza) o registro diário no Firebase */
  async save(userId: string, data: CreateRegisterData): Promise<void> {
    // 🔹 Garante que a data salva no Firebase é local (sem UTC)
    const now = new Date();
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateString = localDate.toISOString().split('T')[0]; // Ex: "2025-10-24"
    const registerId = `${userId}_${dateString}`;

    const registerData: EmotionalRegister = {
      id: registerId,
      userId,
      ...data,
      date: dateString, // sempre "YYYY-MM-DD"
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, 'emotionalRegisters', registerId), registerData, { merge: true });
    console.log('✅ [save] Registro salvo com data:', dateString);
  },

  /** 🔹 Busca todos os registros do mês (corrigido com timezone e tipagem) */
  async getByMonth(userId: string, year: number, month: number): Promise<EmotionalRegister[]> {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const q = query(
      collection(db, 'emotionalRegisters'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    const snapshot = await getDocs(q);

    const registers = snapshot.docs.map((docSnap) => {
      const raw: any = docSnap.data();
      const rawDate = raw?.date;

      let dateStr: string;
      if (rawDate && typeof rawDate === 'object' && typeof rawDate.toDate === 'function') {
        // 🔹 Timestamp do Firestore
        dateStr = rawDate.toDate().toISOString().split('T')[0];
      } else if (typeof rawDate === 'string') {
        // 🔹 String normal
        dateStr = rawDate.split('T')[0];
      } else {
        // 🔹 Valor inesperado
        dateStr = String(rawDate ?? '');
      }

      const parsed: EmotionalRegister = {
        ...raw,
        date: dateStr,
      };

      return parsed;
    });

    console.log('🔥 [getByMonth] Datas carregadas:', registers.map((r) => r.date));
    return registers;
  },

  /** 🔹 Busca o registro de um dia específico */
  async getByDate(userId: string, dateString: string): Promise<EmotionalRegister | null> {
    const q = query(
      collection(db, 'emotionalRegisters'),
      where('userId', '==', userId),
      where('date', '==', dateString)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('❌ [getByDate] Nenhum registro encontrado para', dateString);
      return null;
    }

    const raw: any = snapshot.docs[0].data();
    const rawDate = raw?.date;

    let dateStr: string;
    if (rawDate && typeof rawDate === 'object' && typeof rawDate.toDate === 'function') {
      dateStr = rawDate.toDate().toISOString().split('T')[0];
    } else if (typeof rawDate === 'string') {
      dateStr = rawDate.split('T')[0];
    } else {
      dateStr = String(rawDate ?? '');
    }

    const parsed: EmotionalRegister = { ...raw, date: dateStr };

    console.log('✅ [getByDate] Registro encontrado:', parsed.date, 'esperado:', dateString);
    return parsed;
  },
};
