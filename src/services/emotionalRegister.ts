import { collection, doc, getDocs, query, setDoc, where, serverTimestamp } from 'firebase/firestore'
import { db } from './firebaseConfig'
import { EmotionalRegister, CreateRegisterData } from '../models/emotionalRegister'

export const emotionalRegisterService = {
  async save(userId: string, data: CreateRegisterData): Promise<void> {
    const today = new Date()
    const dateString = today.toISOString().split('T')[0]
    const registerId = `${userId}_${dateString}`

    const registerData = {
      id: registerId,
      userId,
      ...data,
      date: dateString,
      createdAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'emotionalRegisters', registerId), registerData)
  },

  async getByMonth(userId: string, year: number, month: number): Promise<EmotionalRegister[]> {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const q = query(
      collection(db, 'emotionalRegisters'),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as EmotionalRegister)
  },

  async getByDate(userId: string, dateString: string): Promise<EmotionalRegister | null> {
    const q = query(
      collection(db, 'emotionalRegisters'),
      where('userId', '==', userId),
      where('date', '==', dateString)
    )

    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    return snapshot.docs[0].data() as EmotionalRegister
  },
}