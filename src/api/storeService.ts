import { apiClient } from './client';
import { USE_MOCKS, mockCategorias, mockHelpers, mockStores } from './mocks';
import type { Tienda, Categoria } from '../types';

export const storeService = {
  async getAll(): Promise<Tienda[]> {
    if (USE_MOCKS) return [...mockStores];
    return await apiClient.get<Tienda[]>('/Tienda');
  },

  async getById(id: string): Promise<Tienda> {
    if (USE_MOCKS) {
      const found = mockStores.find((s) => s.id_tienda === id);
      if (!found) throw new Error('Tienda no encontrada');
      return found;
    }
    return await apiClient.get<Tienda>(`/Tienda/${id}`);
  },

  async getCategorias(tiendaId: string): Promise<Categoria[]> {
    if (USE_MOCKS) {
      return mockCategorias.filter((c) => c.tiendaId === tiendaId);
    }
    return await apiClient.get<Categoria[]>(`/Categoria/${tiendaId}`);
  },

  async createCategoria(
    payload: Omit<Categoria, 'id_categoria'>
  ): Promise<Categoria> {
    if (USE_MOCKS) {
      const nueva: Categoria = {
        ...payload,
        id_categoria: mockHelpers.makeUuid(),
      };
      mockCategorias.push(nueva);
      return nueva;
    }
    return await apiClient.post<Categoria>('/Categoria', payload);
  },
};
