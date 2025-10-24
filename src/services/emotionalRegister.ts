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
  // Busca TUDO do usuário (sem precisar de índice composto)
  const q = query(
    collection(db, 'emotionalRegisters'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const all = snapshot.docs.map(d => d.data() as any);

  // Normaliza "date" para string YYYY-MM-DD, independente de Timestamp/string
  const normalized: EmotionalRegister[] = all.map((raw: any) => {
    let dateStr: string;

    if (raw?.date && typeof raw.date === 'object' && typeof raw.date.toDate === 'function') {
      dateStr = raw.date.toDate().toISOString().split('T')[0];
    } else if (typeof raw?.date === 'string') {
      dateStr = raw.date.split('T')[0];
    } else {
      dateStr = '';
    }

    return { ...raw, date: dateStr } as EmotionalRegister;
  });

  // Filtra pelo mês corrente
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`; // ex: "2025-10-"
  const monthRegisters = normalized.filter(r => r.date?.startsWith(monthPrefix));

  // DEBUG (pode remover depois)
  console.log('🔥 [getByMonth] user:', userId, '| prefix:', monthPrefix, '| datas:', monthRegisters.map(r => r.date));

  return monthRegisters;
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
