import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { storeService } from '../api/storeService';
import { StoreCard } from '../components/stores/StoreCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import type { Tienda } from '../types';

export function StoresPage() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = () => {
    setLoading(true);
    setError(null);
    storeService
      .getAll()
      .then((data) => setTiendas(data.filter((t) => t.isActive === 1)))
      .catch(() => setError('No se pudieron cargar las tiendas.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tiendas;
    return tiendas.filter((t) =>
      t.nombre_tienda.toLowerCase().includes(q)
    );
  }, [tiendas, query]);

  return (
    <section>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">Tiendas</h1>
          <p className="text-sm text-ink-500">
            Elige una tienda para ver su menú.
          </p>
        </div>

        <label className="relative w-full md:w-72">
          <span className="sr-only">Buscar tienda</span>
          <Search
            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-ink-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tienda..."
            className="w-full rounded-lg border border-ink-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </header>

      {loading && <Spinner label="Cargando tiendas..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title={query ? 'Sin resultados' : 'No hay tiendas activas'}
          description={
            query
              ? `Ninguna tienda coincide con "${query}".`
              : 'Vuelve más tarde, los vendors están abriendo sus tiendas.'
          }
        />
      )}
      {!loading && !error && filtered.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <li key={t.id_tienda}>
              <StoreCard tienda={t} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
