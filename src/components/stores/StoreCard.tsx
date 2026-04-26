import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import type { Tienda } from '../../types';

interface StoreCardProps {
  tienda: Tienda;
}

export function StoreCard({ tienda }: StoreCardProps) {
  return (
    <Link
      to={`/tiendas/${tienda.id_tienda}`}
      className="group flex items-center gap-4 rounded-xl border border-ink-300 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
        <Store className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-ink-900">
          {tienda.nombre_tienda}
        </h3>
        <p className="text-sm text-ink-500">Ver menú →</p>
      </div>
    </Link>
  );
}
