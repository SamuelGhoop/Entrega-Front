import { apiClient } from './client';
import type { CheckoutDTO, EstadoOrden, Orden } from '../types';

export const orderService = {
  async checkout(payload: CheckoutDTO): Promise<Orden> {
    const { data } = await apiClient.post<Orden>('/Orden/checkout', payload);
    return data;
  },

  async confirmarPago(ordenId: string): Promise<string> {
    const { data } = await apiClient.patch<string>(
      `/Orden/${ordenId}/confirmar-pago`
    );
    return data;
  },

  async getByStudent(): Promise<Orden[]> {
    const { data } = await apiClient.get<Orden[]>('/Orden/student');
    return data;
  },

  async getByTienda(tiendaId: string): Promise<Orden[]> {
    const { data } = await apiClient.get<Orden[]>(`/Orden/tienda/${tiendaId}`);
    return data;
  },

  async updateEstado(ordenId: string, estado: EstadoOrden): Promise<string> {
    const { data } = await apiClient.patch<string>(
      `/Orden/${ordenId}/estado`,
      estado,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  },

  async getETA(tiendaId: string): Promise<{ minutos_estimados: number }> {
    const { data } = await apiClient.get<{ minutos_estimados: number }>(
      `/Orden/eta/${tiendaId}`
    );
    return data;
  },
};
