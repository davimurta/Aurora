/**
 * Serviço de API de Registros Emocionais
 *
 * Consome as rotas de registros emocionais do backend
 */

import api from './api';

export interface EmotionalRegister {
  id: string;
  userId: string;
  selectedMood: string;
  moodId: number;
  intensityValue: number;
  diaryText: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistersResponse {
  success: boolean;
  registers: EmotionalRegister[];
  count: number;
  month?: number;
  year?: number;
}

export interface RegisterResponse {
  success: boolean;
  register: EmotionalRegister;
}

export interface StatisticsResponse {
  success: boolean;
  statistics: {
    total: number;
    byMood: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
    };
    averageIntensity: number;
  };
  month: number;
  year: number;
}

export const registersApi = {
  /**
   * Lista todos os registros de um usuário
   */
  async getUserRegisters(userId: string, limit?: number): Promise<RegistersResponse> {
    const params: any = {};
    if (limit) params.limit = limit;

    const response = await api.get<RegistersResponse>(`/registers/${userId}`, { params });
    return response.data;
  },

  /**
   * Busca registros de um usuário em um mês específico
   */
  async getRegistersByMonth(userId: string, year: number, month: number): Promise<RegistersResponse> {
    const response = await api.get<RegistersResponse>(
      `/registers/${userId}/month/${year}/${month}`
    );
    return response.data;
  },

  /**
   * Busca um registro específico por data
   */
  async getRegisterByDate(userId: string, date: string): Promise<RegisterResponse> {
    const response = await api.get<RegisterResponse>(`/registers/${userId}/date/${date}`);
    return response.data;
  },

  /**
   * Cria ou atualiza um registro emocional
   */
  async saveRegister(registerData: {
    userId: string;
    selectedMood: string;
    moodId: number;
    intensityValue: number;
    diaryText: string;
    date?: string;
  }): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/registers', registerData);
    return response.data;
  },

  /**
   * Remove um registro
   */
  async deleteRegister(userId: string, date: string): Promise<void> {
    await api.delete(`/registers/${userId}/date/${date}`);
  },

  /**
   * Busca estatísticas de um mês
   */
  async getMonthStatistics(userId: string, year: number, month: number): Promise<StatisticsResponse> {
    const response = await api.get<StatisticsResponse>(
      `/registers/${userId}/statistics/${year}/${month}`
    );
    return response.data;
  },
};
