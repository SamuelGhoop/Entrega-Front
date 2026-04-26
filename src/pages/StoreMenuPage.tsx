import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { storeService } from '../api/storeService';
import { productService } from '../api/productService';
import { ProductCard } from '../components/menu/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import type { Producto, Tienda } from '../types';

export function StoreMenuPage() {
  const { tiendaId = '' } = useParams<{ tiendaId: string }>();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      storeService.getById(tiendaId),
      productService.getByTienda(tiendaId),
    ])
      .then(([t, p]) => {
        setTienda(t);
        setProductos(p.filter((x) => x.isActive === 1));
      })
      .catch(() => setError('No se pudo cargar el menú de esta tienda.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tiendaId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre_producto.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
    );
  }, [productos, query]);

  const canAdd = user?.role === 'Student';

  const handleAdd = (producto: Producto) => {
    addItem(producto, tiendaId);
    setToast(`Agregado: ${producto.nombre_producto}`);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <section>
      <Link
        to="/tiendas"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
      </Link>

      {loading && <Spinner label="Cargando menú..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && tienda && (
        <>
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">
                {tienda.nombre_tienda}
              </h1>
              <p className="text-sm text-ink-500">
                {productos.length} producto{productos.length === 1 ? '' : 's'} disponibles
              </p>
            </div>
            <label className="relative w-full md:w-72">
              <span className="sr-only">Buscar producto</span>
              <Search
                className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-ink-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full rounded-lg border border-ink-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </label>
          </header>

          {!canAdd && (
            <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Inicia sesión como estudiante para poder ordenar.
            </p>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              title={query ? 'Sin resultados' : 'Sin productos'}
              description={
                query
                  ? `Ningún producto coincide con "${query}".`
                  : 'Esta tienda aún no tiene productos publicados.'
              }
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <li key={p.id_producto}>
                  <ProductCard producto={p} onAdd={handleAdd} canAdd={canAdd} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </section>
  );
}
