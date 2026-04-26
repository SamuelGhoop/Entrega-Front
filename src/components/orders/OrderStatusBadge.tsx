import type { EstadoOrden } from '../../types';
import { EstadoOrdenLabel } from '../../types';

interface OrderStatusBadgeProps {
  estado: EstadoOrden;
}

const colorByEstado: Record<EstadoOrden, string> = {
  0: 'bg-blue-100 text-blue-700',
  1: 'bg-amber-100 text-amber-700',
  2: 'bg-emerald-100 text-emerald-700',
  3: 'bg-ink-300 text-ink-700',
};

export function OrderStatusBadge({ estado }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorByEstado[estado]}`}
    >
      {EstadoOrdenLabel[estado]}
    </span>
  );
}
