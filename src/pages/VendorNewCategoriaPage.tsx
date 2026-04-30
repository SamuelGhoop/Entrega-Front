import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { storeService } from '../api/storeService';
import { ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import type { Tienda } from '../types';

export function VendorNewCategoriaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);
    storeService
      .getAll()
      .then((all) => {
        const own = all.find((t) => t.vendorId === user.id);
        if (!own) {
          setLoadError('No encontramos una tienda asociada a tu cuenta.');
          return;
        }
        setTienda(own);
      })
      .catch(() => setLoadError('No se pudo cargar tu tienda.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const isValid = nombre.trim().length >= 2 && tienda !== null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting || !tienda) return;
    setSubmitting(true);
    setError(null);
    try {
      await storeService.createCategoria({
        nombre_categoria: nombre.trim(),
        isActive: 1,
        tiendaId: tienda.id_tienda,
      });
      navigate('/vendor/productos/nuevo', { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message || 'No se pudo crear la categoría.'
          : 'No se pudo crear la categoría.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <Link
        to="/vendor"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al panel
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">
          Nueva categoría
        </h1>
        <p className="text-sm text-ink-500">
          {tienda ? `Para ${tienda.nombre_tienda}` : 'Tu tienda'}
        </p>
      </header>

      {loading && <Spinner label="Cargando..." />}
      {!loading && loadError && (
        <ErrorState
          message={loadError}
          onRetry={() => window.location.reload()}
        />
      )}

      {!loading && !loadError && tienda && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-ink-300 bg-white p-6 shadow-sm"
        >
          <Input
            label="Nombre de la categoría"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Bebidas, Desayunos, Wraps"
            required
          />

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <Button type="submit" disabled={!isValid || submitting} size="lg">
            <FolderPlus className="h-4 w-4" aria-hidden="true" />
            {submitting ? 'Creando...' : 'Crear categoría'}
          </Button>
        </form>
      )}
    </section>
  );
}
