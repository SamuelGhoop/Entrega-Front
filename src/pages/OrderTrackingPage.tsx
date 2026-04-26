import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { orderService } from '../api/orderService';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge';
import { formatCOP } from '../lib/format';
import type { EstadoOrden, Orden } from '../types';
import { EstadoOrdenLabel } from '../types';

const STEPS: EstadoOrden[] = [0, 1, 2, 3];

export function OrderTrackingPage() {
  const { ordenId = '' } = useParams<{ ordenId: string }>();
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    orderService
      .getByStudent()
      .then((all) => {
        const found = all.find((o) => o.id_orden === ordenId);
        if (!found) {
          setError('Esta orden no existe o no es tuya.');
        } else {
          setOrden(found);
        }
      })
      .catch(() => setError('No se pudo cargar el estado de la orden.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [ordenId]);

  const currentIndex = useMemo(
    () => (orden ? STEPS.indexOf(orden.estado) : -1),
    [orden]
  );

  return (
    <section>
      <Link
        to="/ordenes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Mis órdenes
      </Link>

      {loading && <Spinner label="Cargando tracking..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && orden && (
        <article className="space-y-6">
          <header className="rounded-xl border border-ink-300 bg-white p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-ink-900">
                  Orden #{orden.id_orden.slice(0, 8)}
                </h1>
                <p className="text-sm text-ink-500">
                  Total: <strong>{formatCOP(orden.total)}</strong> · ETA:{' '}
                  <strong>{orden.minutos_estimados} min</strong>
                </p>
              </div>
              <OrderStatusBadge estado={orden.estado} />
            </div>
          </header>

          <ol
            aria-label="Progreso de la orden"
            className="space-y-3 rounded-xl border border-ink-300 bg-white p-5"
          >
            {STEPS.map((step, idx) => {
              const done = idx <= currentIndex;
              const active = idx === currentIndex;
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      done
                        ? 'bg-brand-600 text-white'
                        : 'bg-ink-100 text-ink-500'
                    }`}
                    aria-hidden="true"
                  >
                    {done ? <Check className="h-4 w-4" /> : idx + 1}
                  </span>
                  <span
                    className={`text-sm ${
                      active
                        ? 'font-semibold text-ink-900'
                        : done
                          ? 'text-ink-700'
                          : 'text-ink-500'
                    }`}
                  >
                    {EstadoOrdenLabel[step]}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700">
            <Clock className="h-4 w-4" aria-hidden="true" />
            La página se actualiza al recargar. La tienda actualiza el estado.
          </p>
        </article>
      )}
    </section>
  );
}
