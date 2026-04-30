import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, Plus, RefreshCw } from 'lucide-react';
import { storeService } from '../api/storeService';
import { orderService } from '../api/orderService';
import { OrderCard } from '../components/orders/OrderCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import type { EstadoOrden, Orden, Tienda } from '../types';
import { EstadoOrdenLabel } from '../types';

const FILTERS: Array<{ value: EstadoOrden | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 0, label: EstadoOrdenLabel[0] },
  { value: 1, label: EstadoOrdenLabel[1] },
  { value: 2, label: EstadoOrdenLabel[2] },
  { value: 3, label: EstadoOrdenLabel[3] },
];

const NEXT_ESTADO: Record<EstadoOrden, EstadoOrden | null> = {
  0: 1,
  1: 2,
  2: 3,
  3: null,
};

export function VendorDashboardPage() {
  const { user } = useAuth();
  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<EstadoOrden | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    storeService
      .getAll()
      .then((all) => {
        const own = all.find((t) => t.vendorId === user.id);
        if (!own) {
          setError('No encontramos una tienda asociada a tu cuenta.');
          setLoading(false);
          return;
        }
        setTienda(own);
        return orderService.getByTienda(own.id_tienda).then(setOrdenes);
      })
      .catch(() => setError('No se pudieron cargar las órdenes.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.id]);

  const filtered = useMemo(() => {
    if (filter === 'all') return ordenes;
    return ordenes.filter((o) => o.estado === filter);
  }, [ordenes, filter]);

  const handleAdvance = async (orden: Orden) => {
    const next = NEXT_ESTADO[orden.estado];
    if (next === null) return;
    setUpdatingId(orden.id_orden);
    try {
      await orderService.updateEstado(orden.id_orden, next);
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id_orden === orden.id_orden ? { ...o, estado: next } : o
        )
      );
    } catch {
      setError('No se pudo actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section>
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">
            Panel del vendor
          </h1>
          <p className="text-sm text-ink-500">
            {tienda ? tienda.nombre_tienda : 'Sin tienda asignada'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/vendor/categorias/nueva"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
          >
            <FolderPlus className="h-4 w-4" aria-hidden="true" /> Nueva categoría
          </Link>
          <Link
            to="/vendor/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo producto
          </Link>
          <Button variant="secondary" onClick={load}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Refrescar
          </Button>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filtros">
        {FILTERS.map((f) => (
          <button
            key={String(f.value)}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-white text-ink-700 hover:bg-ink-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <Spinner label="Cargando órdenes..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="Sin órdenes"
          description={
            filter === 'all'
              ? 'Aún no llegan órdenes.'
              : `No hay órdenes en estado "${EstadoOrdenLabel[filter as EstadoOrden]}".`
          }
        />
      )}
      {!loading && !error && filtered.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => {
            const next = NEXT_ESTADO[o.estado];
            return (
              <li key={o.id_orden} className="flex flex-col gap-2">
                <OrderCard orden={o} />
                {next !== null && (
                  <Button
                    size="sm"
                    onClick={() => handleAdvance(o)}
                    disabled={updatingId === o.id_orden}
                  >
                    {updatingId === o.id_orden
                      ? 'Actualizando...'
                      : `Marcar como ${EstadoOrdenLabel[next]}`}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
