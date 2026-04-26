import { Clock, Plus } from 'lucide-react';
import type { Producto } from '../../types';
import { formatCOP } from '../../lib/format';
import { Button } from '../ui/Button';

interface ProductCardProps {
  producto: Producto;
  onAdd: (producto: Producto) => void;
  canAdd: boolean;
}

export function ProductCard({ producto, onAdd, canAdd }: ProductCardProps) {
  const disabled = !producto.disponible || !canAdd;
  return (
    <article className="flex flex-col rounded-xl border border-ink-300 bg-white p-4 shadow-sm">
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre_producto}
          className="mb-3 h-32 w-full rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden="true"
          className="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-3xl"
        >
          🍽️
        </div>
      )}

      <header className="mb-1 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-ink-900">
          {producto.nombre_producto}
        </h3>
        <span className="shrink-0 text-base font-semibold text-brand-600">
          {formatCOP(producto.precio)}
        </span>
      </header>

      <p className="mb-3 line-clamp-2 text-sm text-ink-500">
        {producto.descripcion}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-ink-500">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {producto.minutos_preparacion} min
        </span>
        <Button
          size="sm"
          onClick={() => onAdd(producto)}
          disabled={disabled}
          aria-label={`Agregar ${producto.nombre_producto} al carrito`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {producto.disponible ? 'Agregar' : 'Agotado'}
        </Button>
      </div>
    </article>
  );
}
