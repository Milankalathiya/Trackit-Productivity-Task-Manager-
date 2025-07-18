// src/services/authService.ts
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types';
import api from './api';

const API_BASE_URL = 'http://localhost:8080/api/users';

export const authService = {
  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post(`${API_BASE_URL}/register`, data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post(`${API_BASE_URL}/login`, data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};
