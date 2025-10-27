/**
 * Serviço de API de Autenticação
 *
 * Consome as rotas de autenticação do backend
 */

import api from './api';
import type { PacienteData, PsicologoData } from '../types/auth.types';

export interface LoginResponse {
  success: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
    userType: 'paciente' | 'psicologo';
  };
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  user: {
    uid: string;
    email: string;
    displayName: string;
    userType: 'paciente' | 'psicologo';
  };
  message: string;
}

export const authApi = {
  /**
   * Login com email e senha
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Registro de paciente
   */
  async registerPaciente(data: PacienteData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/register', {
      email: data.email,
      password: data.senha,
      displayName: data.nome,
      userType: 'paciente',
      // Dados adicionais do paciente
      idade: calculateAge(data.dataNascimento),
      genero: 'Não informado', // Adicione se tiver no formulário
      telefone: data.telefone,
    });
    return response.data;
  },

  /**
   * Registro de psicólogo
   */
  async registerPsicologo(data: PsicologoData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/register', {
      email: data.email,
      password: data.senha,
      displayName: data.nome,
      userType: 'psicologo',
      // Dados adicionais do psicólogo
      crp: data.crp,
      especialidade: data.especialidade,
      bio: data.biografia,
      telefone: data.telefone,
    });
    return response.data;
  },

  /**
   * Reset de senha
   */
  async resetPassword(email: string): Promise<void> {
    await api.post('/reset-password', { email });
  },

  /**
   * Logout
   */
  async logout(userId: string): Promise<void> {
    await api.post('/logout', { userId });
  },

  /**
   * Busca dados do usuário
   */
  async getUserById(userId: string): Promise<any> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

/**
 * Calcula idade a partir da data de nascimento
 */
function calculateAge(birthDate: string): number {
  const [day, month, year] = birthDate.split('/').map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
