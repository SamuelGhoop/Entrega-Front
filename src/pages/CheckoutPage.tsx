import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { orderService } from '../api/orderService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCOP } from '../lib/format';

type Step = 'pago' | 'confirmando' | 'listo';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, total, clear } = useCart();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [step, setStep] = useState<Step>('pago');
  const [error, setError] = useState<string | null>(null);

  const sanitizedNumber = cardNumber.replace(/\D/g, '');

  const cardNameError =
    cardName.trim().length < 3 || cardName.trim().length > 50
      ? 'El nombre debe tener entre 3 y 50 caracteres.'
      : undefined;

  const cardNumberError =
    sanitizedNumber.length < 12
      ? 'Mínimo 12 dígitos.'
      : sanitizedNumber.length > 19
        ? 'Máximo 19 dígitos.'
        : undefined;

  const isValid = !cardNameError && !cardNumberError && lines.length > 0;

  if (lines.length === 0 && step === 'pago') {
    return (
      <EmptyState
        title="No hay nada para pagar"
        description="Agrega productos a tu carrito antes de hacer checkout."
        action={
          <Button onClick={() => navigate('/tiendas')}>Ver tiendas</Button>
        }
      />
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || step !== 'pago') return;
    setStep('confirmando');
    setError(null);
    try {
      const orden = await orderService.checkout({
        items: lines.map((l) => ({
          productoId: l.producto.id_producto,
          cantidad: l.cantidad,
        })),
      });
      await orderService.confirmarPago(orden.id_orden);
      clear();
      setStep('listo');
      setTimeout(() => navigate(`/ordenes/${orden.id_orden}`), 1200);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message || 'No se pudo procesar el pago.'
          : 'No se pudo procesar el pago.';
      setError(message);
      setStep('pago');
    }
  };

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-ink-900 md:text-3xl">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-ink-300 bg-white p-5 lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-ink-900">Pago simulado</h2>
          </div>

          <Input
            label="Nombre en la tarjeta"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Como aparece en la tarjeta"
            autoComplete="cc-name"
            error={cardNameError}
            required
          />
          <Input
            label="Número de tarjeta"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/[^\d\s]/g, '').slice(0, 19))
            }
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
            error={cardNumberError}
            required
          />

          <p className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Pago de prueba — no se cargará dinero real.
          </p>

          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {step === 'listo' && (
            <p
              role="status"
              className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            >
              ¡Pago confirmado! Te llevamos al tracking...
            </p>
          )}

          <Button
            type="submit"
            disabled={!isValid || step !== 'pago'}
            fullWidth
            size="lg"
          >
            {step === 'confirmando' ? 'Procesando...' : `Pagar ${formatCOP(total)}`}
          </Button>
        </form>

        <aside className="h-fit rounded-xl border border-ink-300 bg-white p-5">
          <h2 className="mb-3 text-base font-semibold text-ink-900">Tu orden</h2>
          <ul className="mb-4 space-y-2 text-sm">
            {lines.map((l) => (
              <li
                key={l.producto.id_producto}
                className="flex justify-between gap-2"
              >
                <span className="truncate">
                  {l.cantidad}× {l.producto.nombre_producto}
                </span>
                <span className="shrink-0 font-medium">
                  {formatCOP(l.producto.precio * l.cantidad)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-ink-300 pt-3 text-base font-bold">
            <span>Total</span>
            <span className="text-brand-600">{formatCOP(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
