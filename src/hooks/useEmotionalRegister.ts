import { useState } from 'react'
import { useAuthController } from './useAuthController'
import { EmotionalRegister, CreateRegisterData, moodOptions } from '../models/emotionalRegister'
import { emotionalRegisterService } from '../services/emotionalRegister'
import { emotionalRegisterController } from '../controllers/emotionalRegister'

export const useEmotionalRegister = () => {
  const { user } = useAuthController()
  const [loading, setLoading] = useState(false)
  const [registers, setRegisters] = useState<EmotionalRegister[]>([])

  const saveRegister = async (data: CreateRegisterData) => {
    if (!user) throw new Error('Usuário não autenticado')

    setLoading(true)
    try {
      await emotionalRegisterService.save(user.uid, data)
    } finally {
      setLoading(false)
    }
  }

  const getRegistersByMonth = async (year: number, month: number) => {
    if (!user) return []
    setLoading(true)

    try {
      const monthRegisters = await emotionalRegisterService.getByMonth(user.uid, year, month)
      setRegisters(monthRegisters)
      return monthRegisters
    } finally {
      setLoading(false)
    }
  }

  const getRegisterByDate = async (date: string) => {
    if (!user) return null
    return emotionalRegisterService.getByDate(user.uid, date)
  }

  return {
    loading,
    registers,
    saveRegister,
    getRegistersByMonth,
    getRegisterByDate,
    getChartDataByMonth: emotionalRegisterController.getChartDataByMonth,
    getMoodLabel: emotionalRegisterController.getMoodLabel,
    hasRegisterForDate: emotionalRegisterController.hasRegisterForDate,
    formatDateKey: emotionalRegisterController.formatDateKey,
    moodOptions,
  }
}