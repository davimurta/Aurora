/**
 * Serviço de API de Conexões
 *
 * Gerencia conexões entre psicólogos e pacientes
 */

import api from './api';

export interface Connection {
  id: string;
  code: string;
  psychologistId: string;
  psychologistName: string;
  patientId?: string;
  patientName?: string;
  patientEmail?: string;
  status: 'pending' | 'active' | 'expired';
  createdAt: Date;
  connectedAt?: Date;
  expiresAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  connectedAt: Date;
  connectionId: string;
}

export interface GenerateCodeResponse {
  success: boolean;
  connection: Connection;
  code: string;
  message: string;
}

export interface ConnectResponse {
  success: boolean;
  connection: Connection;
  message: string;
}

export interface PatientsResponse {
  success: boolean;
  patients: Patient[];
  count: number;
}

export const connectionApi = {
  /**
   * Psicólogo gera código de conexão
   */
  async generateCode(psychologistId: string, psychologistName: string): Promise<GenerateCodeResponse> {
    const response = await api.post<GenerateCodeResponse>('/connections/generate', {
      psychologistId,
      psychologistName,
    });
    return response.data;
  },

  /**
   * Paciente usa código para conectar
   */
  async connect(
    code: string,
    patientId: string,
    patientName: string,
    patientEmail: string
  ): Promise<ConnectResponse> {
    const response = await api.post<ConnectResponse>('/connections/connect', {
      code,
      patientId,
      patientName,
      patientEmail,
    });
    return response.data;
  },

  /**
   * Lista pacientes conectados a um psicólogo
   */
  async listPatients(psychologistId: string): Promise<PatientsResponse> {
    const response = await api.get<PatientsResponse>(
      `/connections/psychologist/${psychologistId}/patients`
    );
    return response.data;
  },

  /**
   * Busca registros diários de um paciente
   */
  async getPatientRegisters(patientId: string, year?: number, month?: number): Promise<any> {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await api.get(`/connections/patient/${patientId}/registers`, { params });
    return response.data;
  },
};
