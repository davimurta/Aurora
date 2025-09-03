import { EmotionalRegister, ChartData, moodOptions } from '../models/emotionalRegister'

export const emotionalRegisterController = {
  getChartDataByMonth(monthRegisters: EmotionalRegister[]): ChartData {
    const moodCounts: Record<string, number> = {
      'Muito triste': 0,
      Triste: 0,
      Neutro: 0,
      Bem: 0,
      'Muito bem': 0,
      Radiante: 0,
    }

    monthRegisters.forEach((register) => {
      if (moodCounts.hasOwnProperty(register.selectedMood)) {
        moodCounts[register.selectedMood]++
      }
    })

    return {
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
  },

  getMoodLabel(moodId: number): string {
    const mood = moodOptions.find((m) => m.id === moodId)
    return mood ? mood.label : 'Neutro'
  },

  hasRegisterForDate(dateString: string, monthRegisters: EmotionalRegister[]): boolean {
    return monthRegisters.some((register) => register.date === dateString)
  },

  formatDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  },
}