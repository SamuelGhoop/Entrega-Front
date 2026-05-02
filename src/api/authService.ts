import { ApiError, apiClient } from './client';
import {
  USE_MOCKS,
  makeMockToken,
  mockHelpers,
  mockStores,
  mockUsers,
} from './mocks';
import type {
  AuthResponse,
  CreateVendorDTO,
  LoginDTO,
  RegisterDTO,
} from '../types';

export const authService = {
  async login(payload: LoginDTO): Promise<AuthResponse> {
    if (USE_MOCKS) {
      const user = mockUsers.find(
        (u) =>
          u.email.toLowerCase() === payload.Email.toLowerCase() &&
          u.password === payload.Password
      );
      if (!user) throw new ApiError(401, null, 'Credenciales incorrectas.');
      return { token: makeMockToken(user) };
    }
    return await apiClient.post<AuthResponse>('/Auth/login', payload);
  },

  async register(payload: RegisterDTO): Promise<{ message: string }> {
    if (USE_MOCKS) {
      const exists = mockUsers.some(
        (u) => u.email.toLowerCase() === payload.Email.toLowerCase()
      );
      if (exists) {
        throw new ApiError(400, null, 'Ese correo ya está registrado (mock).');
      }
      mockUsers.push({
        id: `mock-student-${mockUsers.length + 1}`,
        email: payload.Email,
        password: payload.Password,
        role: 'Student',
      });
      return { message: `Usuario ${payload.Email} creado (mock).` };
    }
    return await apiClient.post<{ message: string }>(
      '/Auth/register',
      payload
    );
  },

  async createVendor(payload: CreateVendorDTO): Promise<{ message: string }> {
    if (USE_MOCKS) {
      const exists = mockUsers.some(
        (u) => u.email.toLowerCase() === payload.Email.toLowerCase()
      );
      if (exists) {
        throw new ApiError(400, null, 'Ese correo ya está registrado (mock).');
      }
      const newId = `mock-vendor-${mockUsers.length + 1}`;
      mockUsers.push({
        id: newId,
        email: payload.Email,
        password: payload.Password,
        role: 'Vendor',
      });
      mockStores.push({
        id_tienda: mockHelpers.makeUuid(),
        nombre_tienda: payload.nombre_tienda,
        isActive: 1,
        vendorId: newId,
      });
      return {
        message: `Vendor ${payload.Email} y tienda ${payload.nombre_tienda} creados (mock).`,
      };
    }
    return await apiClient.post<{ message: string }>(
      '/Auth/create-vendor',
      payload
    );
  },
};
