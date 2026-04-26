import { apiClient } from './client';
import type { AuthResponse, LoginDTO, RegisterDTO } from '../types';

export const authService = {
  async login(payload: LoginDTO): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/Auth/login', payload);
    return data;
  },

  async register(payload: RegisterDTO): Promise<{ Message: string }> {
    const { data } = await apiClient.post<{ Message: string }>(
      '/Auth/register',
      payload
    );
    return data;
  },
};
