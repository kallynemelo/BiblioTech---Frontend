import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Altere para o IP da sua máquina ao rodar no dispositivo físico
// Ex: 'http://192.168.1.100:3000/api'
// Para emulador Android use: 'http://10.0.2.2:3000/api'
// Para iOS Simulator use: 'http://localhost:3000/api'
const BASE_URL = 'https://bibliotech-backend-rbys.onrender.com/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição — injeta token JWT automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || 'Erro no servidor';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Sem conexão com o servidor. Verifique se o backend está rodando.'));
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====

export const authService = {
  login: (data) => api.post('/auth/login', data),
};

// ===== CRUD de Livros =====

export const bookService = {
  getAll: (params = {}) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export default api;