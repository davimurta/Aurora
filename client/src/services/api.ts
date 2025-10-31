/**
 * Configuração da API
 *
 * Cliente HTTP para comunicação com o backend Node.js/Express
 */

import axios from 'axios';

// URL base do backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Cria instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (se necessário)
api.interceptors.request.use(
  (config) => {
    // Se tiver token armazenado, adiciona ao header
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros da API
    if (error.response) {
      // Erro retornado pelo servidor
      const message = error.response.data?.message || 'Erro ao comunicar com o servidor';
      console.error('API Error:', message);
      throw new Error(message);
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Network Error:', error.message);
      throw new Error('Erro de conexão. Verifique sua internet.');
    } else {
      // Erro ao configurar a requisição
      console.error('Request Error:', error.message);
      throw new Error('Erro ao fazer requisição');
    }
  }
);

export default api;
