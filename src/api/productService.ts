import { apiClient } from './client';
import { USE_MOCKS, mockProducts } from './mocks';
import type { Producto } from '../types';

export const productService = {
  async getByTienda(tiendaId: string): Promise<Producto[]> {
    if (USE_MOCKS) {
      return mockProducts.filter((p) => !p.tiendaId || p.tiendaId === tiendaId);
    }
    return await apiClient.get<Producto[]>(`/Producto/${tiendaId}`);
  },

  async getById(id: string): Promise<Producto> {
    if (USE_MOCKS) {
      const found = mockProducts.find((p) => p.id_producto === id);
      if (!found) throw new Error('Producto no encontrado');
      return found;
    }
    return await apiClient.get<Producto>(`/Producto/detalle/${id}`);
  },

  async create(producto: Omit<Producto, 'id_producto'>): Promise<Producto> {
    return await apiClient.post<Producto>('/Producto', producto);
  },
};
