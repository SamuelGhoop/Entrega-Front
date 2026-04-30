import { apiClient } from './client';
import type {
  AuthResponse,
  CreateVendorDTO,
  LoginDTO,
  RegisterDTO,
} from '../types';

export const authService = {
  async login(payload: LoginDTO): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/Auth/login', payload);
  },

  async register(payload: RegisterDTO): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(
      '/Auth/register',
      payload
    );
  },

  async createVendor(payload: CreateVendorDTO): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(
      '/Auth/create-vendor',
      payload
    );
  },
};
