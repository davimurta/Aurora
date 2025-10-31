/**
 * AuthModelApi
 *
 * Camada de abstração que conecta o frontend ao backend Express.
 * Substitui as chamadas diretas ao Firebase por chamadas HTTP à API.
 */

import { authApi } from '../services/authApi';
import type {
  PacienteData,
  PsicologoData,
  UserData,
} from '../types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento local
const STORAGE_KEYS = {
  USER_ID: '@aurora:userId',
  USER_DATA: '@aurora:userData',
};

function validatePacienteData(data: PacienteData): void {
  if (data.senha !== data.confirmarSenha) {
    throw new Error('As senhas não coincidem');
  }

  if (data.senha.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }
}

function validatePsicologoData(data: PsicologoData): void {
  if (data.senha !== data.confirmarSenha) {
    throw new Error('As senhas não coincidem');
  }

  if (data.senha.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }
}

export const AuthModelApi = {
  /**
   * Busca dados do usuário do backend
   */
  async getUserDataFromBackend(uid: string): Promise<UserData | null> {
    try {
      const response = await authApi.getUserById(uid);
      if (response.success) {
        return response.user as UserData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  },

  /**
   * Login usando backend
   */
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        // Salva dados no AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user.uid);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

        // Retorna objeto compatível com Firebase User
        return {
          uid: response.user.uid,
          email: response.user.email,
          displayName: response.user.displayName,
        };
      }

      throw new Error(response.message || 'Erro ao fazer login');
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  /**
   * Registra paciente via backend
   */
  async registerPaciente(data: PacienteData): Promise<any> {
    try {
      validatePacienteData(data);

      const response = await authApi.registerPaciente(data);

      if (response.success) {
        // Salva dados no AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user.uid);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

        return {
          uid: response.user.uid,
          email: response.user.email,
          displayName: response.user.displayName,
        };
      }

      throw new Error(response.message || 'Erro ao registrar paciente');
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao registrar paciente');
    }
  },

  /**
   * Registra psicólogo via backend
   */
  async registerPsicologo(data: PsicologoData): Promise<any> {
    try {
      validatePsicologoData(data);

      const response = await authApi.registerPsicologo(data);

      if (response.success) {
        // Salva dados no AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user.uid);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

        return {
          uid: response.user.uid,
          email: response.user.email,
          displayName: response.user.displayName,
        };
      }

      throw new Error(response.message || 'Erro ao registrar psicólogo');
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao registrar psicólogo');
    }
  },

  /**
   * Reset de senha
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await authApi.resetPassword(email);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao resetar senha');
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

      if (userId) {
        await authApi.logout(userId);
      }

      // Limpa dados locais
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  },

  /**
   * Verifica se usuário está logado
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      const userDataStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (userId && userDataStr) {
        const userData = JSON.parse(userDataStr);
        return {
          uid: userId,
          email: userData.email,
          displayName: userData.displayName,
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },

  /**
   * Listener de autenticação (simula onAuthStateChanged do Firebase)
   */
  onAuthStateChanged(callback: (user: any | null) => void) {
    // Verifica imediatamente
    this.getCurrentUser().then(callback);

    // Retorna função de cleanup
    return () => {
      // Nada para cleanup no momento
    };
  },
};
