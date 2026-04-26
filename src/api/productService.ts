import { apiClient } from './client';
import { USE_MOCKS, mockProducts } from './mocks';
import type { Producto } from '../types';

export const productService = {
  async getByTienda(_tiendaId: string): Promise<Producto[]> {
    if (USE_MOCKS) return mockProducts;
    const { data } = await apiClient.get<Producto[]>(`/Producto/${_tiendaId}`);
    return data;
  },

  async getById(id: string): Promise<Producto> {
    if (USE_MOCKS) {
      const found = mockProducts.find((p) => p.id_producto === id);
      if (!found) throw new Error('Producto no encontrado');
      return found;
    }
    const { data } = await apiClient.get<Producto>(`/Producto/detalle/${id}`);
    return data;
  },
};
