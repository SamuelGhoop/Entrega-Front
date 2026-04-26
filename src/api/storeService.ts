import { apiClient } from './client';
import { USE_MOCKS, mockStores } from './mocks';
import type { Tienda, Categoria } from '../types';

export const storeService = {
  async getAll(): Promise<Tienda[]> {
    if (USE_MOCKS) return mockStores;
    const { data } = await apiClient.get<Tienda[]>('/Tienda');
    return data;
  },

  async getById(id: string): Promise<Tienda> {
    if (USE_MOCKS) {
      const found = mockStores.find((s) => s.id_tienda === id);
      if (!found) throw new Error('Tienda no encontrada');
      return found;
    }
    const { data } = await apiClient.get<Tienda>(`/Tienda/${id}`);
    return data;
  },

  async getCategorias(tiendaId: string): Promise<Categoria[]> {
    if (USE_MOCKS) return [];
    const { data } = await apiClient.get<Categoria[]>(`/Categoria/${tiendaId}`);
    return data;
  },
};
