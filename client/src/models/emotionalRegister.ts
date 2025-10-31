import type { FieldValue } from 'firebase/firestore';

/** 🔹 Modelo principal dos registros emocionais */
export type EmotionalRegister = {
  id: string;
  userId: string;
  selectedMood: string;
  moodId: number;
  intensityValue: number;
  diaryText: string;
  date: string;
  createdAt: FieldValue | number;   // ✅ Aceita Firestore ou local
  updatedAt?: FieldValue | number;  // ✅ Também aceita Firestore ou local
};

/** 🔹 Tipo usado ao criar um novo registro */
export type CreateRegisterData = {
  selectedMood: string;
  moodId: number;
  intensityValue: number;
  diaryText: string;
};

/** 🔹 Tipo do gráfico usado na tela de histórico */
export type ChartData = {
  labels: string[];
  datasets: Array<{ data: number[] }>;
};

/** 🔹 Lista fixa de humores usados nas telas */
export const moodOptions = [
  { id: 1, icon: 'sentiment-very-dissatisfied', label: 'Muito triste', color: '#FF6B6B' },
  { id: 2, icon: 'sentiment-dissatisfied', label: 'Triste', color: '#FF8E53' },
  { id: 3, icon: 'sentiment-neutral', label: 'Neutro', color: '#FFD93D' },
  { id: 4, icon: 'sentiment-satisfied', label: 'Bem', color: '#6BCF7F' },
  { id: 5, icon: 'sentiment-very-satisfied', label: 'Muito bem', color: '#4ECDC4' },
  { id: 6, icon: 'mood', label: 'Radiante', color: '#45B7D1' },
];
