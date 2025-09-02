import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../services/firebaseConfig'
import { useAuthController } from '../hooks/useAuthController'

export interface EmotionalRegister {
  id: string
  userId: string
  selectedMood: string
  moodId: number
  intensityValue: number
  diaryText: string
  date: string
  createdAt: undefined
}

export interface CreateRegisterData {
  selectedMood: string
  moodId: number
  intensityValue: number
  diaryText: string
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
  }>
}

export const useEmotionalRegister = () => {
  const { user } = useAuthController()
  const [loading, setLoading] = useState(false)
  const [registers, setRegisters] = useState<EmotionalRegister[]>([])

  const moodOptions = [
    {
      id: 1,
      icon: 'sentiment-very-dissatisfied',
      label: 'Muito triste',
      color: '#FF6B6B',
    },
    {
      id: 2,
      icon: 'sentiment-dissatisfied',
      label: 'Triste',
      color: '#FF8E53',
    },
    { id: 3, icon: 'sentiment-neutral', label: 'Neutro', color: '#FFD93D' },
    { id: 4, icon: 'sentiment-satisfied', label: 'Bem', color: '#6BCF7F' },
    {
      id: 5,
      icon: 'sentiment-very-satisfied',
      label: 'Muito bem',
      color: '#4ECDC4',
    },
    { id: 6, icon: 'mood', label: 'Radiante', color: '#45B7D1' },
  ]

  const saveRegister = async (data: CreateRegisterData): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    setLoading(true)
    try {
      const today = new Date()
      const dateString = today.toISOString().split('T')[0]

      const registerId = `${user.uid}_${dateString}`

      const registerData = {
        id: registerId,
        userId: user.uid,
        selectedMood: data.selectedMood,
        moodId: data.moodId,
        intensityValue: data.intensityValue,
        diaryText: data.diaryText,
        date: dateString,
        createdAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'emotionalRegisters', registerId), registerData)

      throw new Error('Erro ao salvar registro emocional')
    } finally {
      setLoading(false)
    }
  }

  const getRegistersByMonth = async (year: number, month: number): Promise<EmotionalRegister[]> => {
    if (!user) {
      return []
    }

    setLoading(true)
    try {
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
      const lastDay = new Date(year, month + 1, 0).getDate()
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(
        2,
        '0'
      )}`

      const q = query(
        collection(db, 'emotionalRegisters'),
        where('userId', '==', user.uid),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      )

      const querySnapshot = await getDocs(q)

      const monthRegisters: EmotionalRegister[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as EmotionalRegister
        monthRegisters.push(data)
      })

      setRegisters(monthRegisters)

      return monthRegisters
    } catch {
      return []
    } finally {
      setLoading(false)
    }
  }

  const getRegisterByDate = async (dateString: string): Promise<EmotionalRegister | null> => {
    if (!user) {
      return null
    }

    try {
      const q = query(
        collection(db, 'emotionalRegisters'),
        where('userId', '==', user.uid),
        where('date', '==', dateString)
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as EmotionalRegister
        return data
      }

      return null
    } catch {
      return null
    }
  }

  const getChartDataByMonth = (monthRegisters: EmotionalRegister[]): ChartData => {
    const moodCounts = {
      'Muito triste': 0,
      Triste: 0,
      Neutro: 0,
      Bem: 0,
      'Muito bem': 0,
      Radiante: 0,
    }

    monthRegisters.forEach((register) => {
      if (Object.hasOwn(moodCounts, register.selectedMood)) {
        moodCounts[register.selectedMood as keyof typeof moodCounts]++
      }
    })

    const chartData = {
      labels: ['😢', '😟', '😐', '😊', '😄', '🤩'],
      datasets: [
        {
          data: [
            moodCounts['Muito triste'],
            moodCounts['Triste'],
            moodCounts['Neutro'],
            moodCounts['Bem'],
            moodCounts['Muito bem'],
            moodCounts['Radiante'],
          ],
        },
      ],
    }

    return chartData
  }

  const getMoodLabel = (moodId: number): string => {
    const mood = moodOptions.find((m) => m.id === moodId)
    return mood ? mood.label : 'Neutro'
  }

  const hasRegisterForDate = (dateString: string, monthRegisters: EmotionalRegister[]): boolean => {
    const hasRegister = monthRegisters.some((register) => register.date === dateString)
    return hasRegister
  }

  const formatDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return {
    loading,
    registers,
    saveRegister,
    getRegistersByMonth,
    getRegisterByDate,
    getChartDataByMonth,
    getMoodLabel,
    hasRegisterForDate,
    formatDateKey,
    moodOptions,
  }
}
