import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCOP } from '../lib/format';

export function CartPage() {
  const { lines, total, updateQty, removeItem, clear } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-bold text-ink-900 md:text-3xl">Tu carrito</h1>
        <EmptyState
          title="Tu carrito está vacío"
          description="Agrega productos desde el menú de una tienda."
          icon={<ShoppingBag className="h-10 w-10" />}
          action={
            <Link
              to="/tiendas"
              className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Ver tiendas
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">Tu carrito</h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Vaciar
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="space-y-3 lg:col-span-2">
          {lines.map((line) => (
            <li
              key={line.producto.id_producto}
              className="flex items-center gap-3 rounded-xl border border-ink-300 bg-white p-3"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-2xl">
                🍽️
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {line.producto.nombre_producto}
                </p>
                <p className="text-xs text-ink-500">
                  {formatCOP(line.producto.precio)} c/u
                </p>
              </div>

              <div
                className="flex items-center rounded-lg border border-ink-300 bg-white"
                role="group"
                aria-label={`Cantidad de ${line.producto.nombre_producto}`}
              >
                <button
                  type="button"
                  className="px-2 py-1 text-ink-700 hover:bg-ink-100"
                  onClick={() =>
                    updateQty(line.producto.id_producto, line.cantidad - 1)
                  }
                  aria-label="Quitar uno"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-8 text-center text-sm font-semibold">
                  {line.cantidad}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 text-ink-700 hover:bg-ink-100"
                  onClick={() =>
                    updateQty(line.producto.id_producto, line.cantidad + 1)
                  }
                  aria-label="Agregar uno"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(line.producto.id_producto)}
                aria-label={`Eliminar ${line.producto.nombre_producto}`}
                className="rounded-md p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-ink-300 bg-white p-5">
          <h2 className="mb-3 text-base font-semibold text-ink-900">Resumen</h2>
          <dl className="mb-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Subtotal</dt>
              <dd className="font-medium">{formatCOP(total)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink-300 pt-2 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-brand-600">{formatCOP(total)}</dd>
            </div>
          </dl>
          <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
            Ir al checkout
          </Button>
        </aside>
      </div>
    </section>
  );
}
