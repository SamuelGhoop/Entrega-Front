import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { storeService } from '../api/storeService';
import { productService } from '../api/productService';
import { ApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import type { Categoria, Tienda } from '../types';

export function VendorNewProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [minutos, setMinutos] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
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
          setLoading(false);
          return;
        }
        setTienda(own);
        return storeService.getCategorias(own.id_tienda).then((cats) => {
          setCategorias(cats);
          if (cats.length > 0) setCategoriaId(cats[0].id_categoria);
        });
      })
      .catch(() => setLoadError('No se pudieron cargar las categorías.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const precioNum = Number(precio);
  const minutosNum = Number(minutos);

  const nombreError =
    nombre.trim().length < 2 || nombre.trim().length > 50
      ? 'El nombre debe tener entre 2 y 50 caracteres.'
      : undefined;

  const descripcionError =
    descripcion.trim().length < 10 || descripcion.trim().length > 300
      ? 'La descripción debe tener entre 10 y 300 caracteres.'
      : undefined;

  const precioError =
    precio.length === 0
      ? 'El precio es obligatorio.'
      : !Number.isFinite(precioNum) || precioNum <= 0
        ? 'El precio debe ser mayor a 0.'
        : precioNum > 1_000_000
          ? 'El precio máximo es 1.000.000 COP.'
          : undefined;

  const minutosError =
    minutos.length === 0
      ? 'El tiempo de preparación es obligatorio.'
      : !Number.isInteger(minutosNum) || minutosNum < 1 || minutosNum > 120
        ? 'Debe ser un número entero entre 1 y 120.'
        : undefined;

  const imagenUrlError =
    imagenUrl.trim().length > 0 && !/^https?:\/\/.+/i.test(imagenUrl.trim())
      ? 'La URL debe iniciar con http:// o https://'
      : undefined;

  const isValid =
    !nombreError &&
    !descripcionError &&
    !precioError &&
    !minutosError &&
    !imagenUrlError &&
    categoriaId.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await productService.create({
        nombre_producto: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNum,
        imagen_url: imagenUrl.trim(),
        disponible: true,
        minutos_preparacion: minutosNum,
        isActive: 1,
        categoriaId,
      });
      navigate('/vendor', { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message || 'No se pudo crear el producto.'
          : 'No se pudo crear el producto.';
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
          Nuevo producto
        </h1>
        <p className="text-sm text-ink-500">
          {tienda ? `Para ${tienda.nombre_tienda}` : 'Tu tienda'}
        </p>
      </header>

      {loading && <Spinner label="Cargando categorías..." />}
      {!loading && loadError && (
        <ErrorState
          message={loadError}
          onRetry={() => window.location.reload()}
        />
      )}
      {!loading && !loadError && categorias.length === 0 && (
        <div className="flex flex-col gap-3 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>
            Tu tienda aún no tiene categorías. Necesitas crear al menos una
            antes de poder añadir productos.
          </p>
          <Link
            to="/vendor/categorias/nueva"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Crear primera
            categoría
          </Link>
        </div>
      )}

      {!loading && !loadError && categorias.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-ink-300 bg-white p-6 shadow-sm"
        >
          <Input
            label="Nombre del producto"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Wrap de pollo"
            error={nombreError}
            required
          />

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink-700">Descripción</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingredientes, sabor, preparación..."
              rows={3}
              required
              aria-invalid={Boolean(descripcionError)}
              className={`rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                descripcionError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-ink-300 focus:border-brand-500 focus:ring-brand-500/20'
              }`}
            />
            {descripcionError && (
              <p role="alert" className="text-xs text-red-600">
                {descripcionError}
              </p>
            )}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Precio (COP)"
              type="number"
              min="1"
              step="100"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="9500"
              error={precioError}
              required
            />
            <Input
              label="Preparación (min)"
              type="number"
              min="1"
              max="120"
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
              placeholder="8"
              error={minutosError}
              required
            />
          </div>

          <Input
            label="URL de imagen (opcional)"
            type="url"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            placeholder="https://..."
            error={imagenUrlError}
          />

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink-700">Categoría</span>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
              className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre_categoria}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <Button type="submit" disabled={!isValid || submitting} size="lg">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {submitting ? 'Creando...' : 'Crear producto'}
          </Button>
        </form>
      )}
    </section>
  );
}
