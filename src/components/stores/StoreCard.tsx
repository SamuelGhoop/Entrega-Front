import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import type { Tienda } from '../../types';
import { getStoreImageFallback } from '../../lib/storeImages';

interface StoreCardProps {
  tienda: Tienda;
}

export function StoreCard({ tienda }: StoreCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = tienda.imagen_url || getStoreImageFallback(tienda.nombre_tienda);
  const showImage = !!imageUrl && !imgFailed;

  return (
    <Link
      to={`/tiendas/${tienda.id_tienda}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-300 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-500 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        {showImage ? (
          <img
            src={imageUrl}
            alt={tienda.nombre_tienda}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-brand-600"
          >
            <Store className="h-16 w-16" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-sm">
            {tienda.nombre_tienda}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3">
        <p className="line-clamp-2 text-sm text-ink-500">
          {tienda.descripcion ?? 'Mira el menú disponible'}
        </p>
        <span className="shrink-0 text-sm font-medium text-brand-600 group-hover:text-brand-700">
          Ver menú →
        </span>
      </div>
    </Link>
  );
}
