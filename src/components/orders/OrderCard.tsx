import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import type { Orden } from '../../types';
import { formatCOP } from '../../lib/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  orden: Orden;
  showLink?: boolean;
}

export function OrderCard({ orden, showLink = false }: OrderCardProps) {
  const fecha = orden.fecha_creacion
    ? new Date(orden.fecha_creacion).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '—';

  return (
    <article className="rounded-xl border border-ink-300 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-ink-500" aria-hidden="true" />
          <span className="text-xs font-mono text-ink-500">
            #{orden.id_orden.slice(0, 8)}
          </span>
        </div>
        <OrderStatusBadge estado={orden.estado} />
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-ink-500">Total</dt>
          <dd className="font-semibold text-ink-900">
            {formatCOP(orden.total)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-500">ETA</dt>
          <dd className="font-semibold text-ink-900">
            {orden.minutos_estimados} min
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-ink-500">Creada</dt>
          <dd className="text-ink-700">{fecha}</dd>
        </div>
      </dl>

      {showLink && (
        <Link
          to={`/ordenes/${orden.id_orden}`}
          className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Ver tracking →
        </Link>
      )}
    </article>
  );
}
