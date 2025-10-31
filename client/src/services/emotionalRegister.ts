/**
 * Emotional Register Service
 *
 * Usa o BACKEND para salvar/buscar registros emocionais
 * (em vez de salvar direto no Firebase)
 */

import { registersApi } from './registersApi';
import { EmotionalRegister, CreateRegisterData } from '../models/emotionalRegister';

export const emotionalRegisterService = {
  /** 🔹 Salva (ou atualiza) o registro diário no BACKEND */
  async save(userId: string, data: CreateRegisterData): Promise<void> {
    // 🔹 Garante que a data salva é local (sem UTC)
    const now = new Date();
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateString = localDate.toISOString().split('T')[0]; // Ex: "2025-10-24"

    try {
      await registersApi.saveRegister({
        userId,
        selectedMood: data.selectedMood,
        moodId: data.moodId,
        intensityValue: data.intensityValue,
        diaryText: data.diaryText,
        date: dateString,
      });

      console.log('✅ [save] Registro salvo no backend com data:', dateString);
    } catch (error) {
      console.error('❌ [save] Erro ao salvar registro:', error);
      throw error;
    }
  },

  /** 🔹 Busca todos os registros do mês (do BACKEND) */
  async getByMonth(userId: string, year: number, month: number): Promise<EmotionalRegister[]> {
    try {
      const response = await registersApi.getRegistersByMonth(userId, year, month + 1);

      // Converte para o formato esperado pelo frontend
      const registers: EmotionalRegister[] = response.registers.map((r: any) => ({
        id: r.id,
        userId: r.userId,
        selectedMood: r.selectedMood,
        moodId: r.moodId,
        intensityValue: r.intensityValue,
        diaryText: r.diaryText,
        date: r.date, // Já vem no formato YYYY-MM-DD
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));

      console.log('🔥 [getByMonth] user:', userId, '| ano:', year, 'mês:', month + 1, '| registros:', registers.length);

      return registers;
    } catch (error) {
      console.error('❌ [getByMonth] Erro:', error);
      return [];
    }
  },

  /** 🔹 Busca o registro de um dia específico (do BACKEND) */
  async getByDate(userId: string, dateString: string): Promise<EmotionalRegister | null> {
    try {
      const response = await registersApi.getRegisterByDate(userId, dateString);

      if (!response.success || !response.register) {
        console.log('❌ [getByDate] Nenhum registro encontrado para', dateString);
        return null;
      }

      const r = response.register;
      const register: EmotionalRegister = {
        id: r.id,
        userId: r.userId,
        selectedMood: r.selectedMood,
        moodId: r.moodId,
        intensityValue: r.intensityValue,
        diaryText: r.diaryText,
        date: r.date,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };

      console.log('✅ [getByDate] Registro encontrado:', register.date, 'esperado:', dateString);
      return register;
    } catch (error: any) {
      // Se for 404, retorna null (não encontrado)
      if (error.response?.status === 404) {
        console.log('❌ [getByDate] Nenhum registro encontrado para', dateString);
        return null;
      }

      console.error('❌ [getByDate] Erro:', error);
      throw error;
    }
  },
};
