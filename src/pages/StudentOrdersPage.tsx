import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import { orderService } from '../api/orderService';
import { OrderCard } from '../components/orders/OrderCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import type { Orden } from '../types';

export function StudentOrdersPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    orderService
      .getByStudent()
      .then(setOrdenes)
      .catch(() => setError('No se pudieron cargar tus órdenes.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">Mis órdenes</h1>
        <p className="text-sm text-ink-500">Historial y seguimiento.</p>
      </header>

      {loading && <Spinner label="Cargando órdenes..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && ordenes.length === 0 && (
        <EmptyState
          title="Aún no tienes órdenes"
          description="Cuando hagas tu primer pedido, aparecerá aquí."
          icon={<Receipt className="h-10 w-10" />}
        />
      )}
      {!loading && !error && ordenes.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordenes.map((o) => (
            <li key={o.id_orden}>
              <OrderCard orden={o} showLink />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
