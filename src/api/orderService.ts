import { apiClient } from './client';
import type { CheckoutDTO, EstadoOrden, Orden } from '../types';

export const orderService = {
  async checkout(payload: CheckoutDTO): Promise<Orden> {
    return await apiClient.post<Orden>('/Orden/checkout', payload);
  },

  async confirmarPago(ordenId: string): Promise<string> {
    return await apiClient.patch<string>(`/Orden/${ordenId}/confirmar-pago`);
  },

  async getByStudent(): Promise<Orden[]> {
    return await apiClient.get<Orden[]>('/Orden/student');
  },

  async getByTienda(tiendaId: string): Promise<Orden[]> {
    return await apiClient.get<Orden[]>(`/Orden/tienda/${tiendaId}`);
  },

  async updateEstado(ordenId: string, estado: EstadoOrden): Promise<string> {
    return await apiClient.patch<string>(`/Orden/${ordenId}/estado`, estado);
  },

  async getETA(tiendaId: string): Promise<{ minutos_estimados: number }> {
    return await apiClient.get<{ minutos_estimados: number }>(
      `/Orden/eta/${tiendaId}`
    );
  },
};
