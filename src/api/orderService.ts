import { apiClient } from './client';
import {
  USE_MOCKS,
  getCurrentMockUserId,
  mockHelpers,
  mockOrdenes,
  mockStores,
} from './mocks';
import type { CheckoutDTO, EstadoOrden, Orden } from '../types';

export const orderService = {
  async checkout(payload: CheckoutDTO): Promise<Orden> {
    if (USE_MOCKS) {
      const firstItem = payload.items[0];
      const firstProduct = firstItem
        ? mockHelpers.findProducto(firstItem.productoId)
        : undefined;
      const tiendaId = firstProduct?.tiendaId ?? mockStores[0].id_tienda;
      const total = payload.items.reduce((sum, item) => {
        const p = mockHelpers.findProducto(item.productoId);
        return sum + (p?.precio ?? 0) * item.cantidad;
      }, 0);
      const orden: Orden = {
        id_orden: mockHelpers.makeUuid(),
        estado: 0,
        total,
        minutos_estimados: 15,
        pago_confirmado: false,
        fecha_pago: null,
        fecha_creacion: new Date().toISOString(),
        isActive: 1,
        studentId: getCurrentMockUserId(),
        tiendaId,
        tienda: mockHelpers.findStore(tiendaId) ?? null,
      };
      mockOrdenes.unshift(orden);
      return orden;
    }
    return await apiClient.post<Orden>('/Orden/checkout', payload);
  },

  async confirmarPago(ordenId: string): Promise<string> {
    if (USE_MOCKS) {
      const orden = mockOrdenes.find((o) => o.id_orden === ordenId);
      if (orden) {
        orden.pago_confirmado = true;
        orden.fecha_pago = new Date().toISOString();
      }
      return 'Pago confirmado (mock)';
    }
    return await apiClient.patch<string>(`/Orden/${ordenId}/confirmar-pago`);
  },

  async getByStudent(): Promise<Orden[]> {
    if (USE_MOCKS) {
      const userId = getCurrentMockUserId();
      return mockOrdenes.filter((o) => o.studentId === userId);
    }
    return await apiClient.get<Orden[]>('/Orden/student');
  },

  async getByTienda(tiendaId: string): Promise<Orden[]> {
    if (USE_MOCKS) {
      return mockOrdenes.filter((o) => o.tiendaId === tiendaId);
    }
    return await apiClient.get<Orden[]>(`/Orden/tienda/${tiendaId}`);
  },

  async updateEstado(ordenId: string, estado: EstadoOrden): Promise<string> {
    if (USE_MOCKS) {
      const orden = mockOrdenes.find((o) => o.id_orden === ordenId);
      if (orden) orden.estado = estado;
      return 'Estado actualizado (mock)';
    }
    return await apiClient.patch<string>(`/Orden/${ordenId}/estado`, estado);
  },

  async getETA(tiendaId: string): Promise<{ minutos_estimados: number }> {
    if (USE_MOCKS) return { minutos_estimados: 15 };
    return await apiClient.get<{ minutos_estimados: number }>(
      `/Orden/eta/${tiendaId}`
    );
  },
};
