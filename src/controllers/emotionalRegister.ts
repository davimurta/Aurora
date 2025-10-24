import { EmotionalRegister, ChartData, moodOptions } from '../models/emotionalRegister';

export const emotionalRegisterController = {
  /** 📊 Gera os dados para o gráfico de barras mensal */
  getChartDataByMonth(monthRegisters: EmotionalRegister[]): ChartData {
    const moodCounts: Record<string, number> = {
      'Muito triste': 0,
      Triste: 0,
      Neutro: 0,
      Bem: 0,
      'Muito bem': 0,
      Radiante: 0,
    };

    // Conta quantos registros existem de cada humor
    monthRegisters.forEach((r) => {
      if (moodCounts[r.selectedMood] !== undefined) {
        moodCounts[r.selectedMood]++;
      }
    });

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
    };
  },

  /** 🧠 Retorna o rótulo do humor a partir do ID */
  getMoodLabel(moodId: number): string {
    const mood = moodOptions.find((m) => m.id === moodId);
    return mood ? mood.label : 'Neutro';
  },

  /** 📅 Verifica se há registro para uma data específica */
  hasRegisterForDate(dateString: string, monthRegisters: EmotionalRegister[]): boolean {
    if (!monthRegisters?.length) return false;

    // Normaliza formato da data (garante que não há diferença de UTC/local)
    const normalizedDate = dateString.split('T')[0];
    return monthRegisters.some((r) => r.date === normalizedDate);
  },

  /** 🕒 Gera uma string de data no formato YYYY-MM-DD respeitando fuso local */
  formatDateKey(year: number, month: number, day: number): string {
  const localDate = new Date(year, month, day);
  const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split('T')[0];
},
};
