import { useState } from 'react';
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
  const [imgFailed, setImgFailed] = useState(false);
  const disabled = !producto.disponible || !canAdd;
  const showImage = !!producto.imagen_url && !imgFailed;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-300 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        {showImage ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre_producto}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-5xl"
          >
            🍽️
          </div>
        )}
        {!producto.disponible && (
          <span className="absolute right-2 top-2 rounded-full bg-ink-900/85 px-2 py-0.5 text-xs font-medium text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
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
      </div>
    </article>
  );
}
