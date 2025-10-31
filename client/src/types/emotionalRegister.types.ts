export type MoodLevel = 0 | 20 | 40 | 60 | 80 | 100;

export interface EmotionalRegister {
  userId: string;           // UID vindo do UserData.uid
  dateISO: string;          // "YYYY-MM-DD"
  mood: MoodLevel;          // porcentagem de humor
  notes?: string;           // texto livre do registro
  createdAt: number;        // timestamp
  updatedAt: number;        // timestamp
}
