import { useState, type FormEvent } from 'react';
import { Store, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authService } from '../api/authService';
import { ApiError } from '../api/client';

export function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreTienda, setNombreTienda] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordError =
    password.length === 0
      ? undefined
      : password.length < 8
        ? 'Mínimo 8 caracteres.'
        : !/\d/.test(password)
          ? 'Debe incluir al menos un número.'
          : undefined;

  const isValid =
    email.includes('@') &&
    password.length >= 8 &&
    !passwordError &&
    nombreTienda.trim().length >= 2;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await authService.createVendor({
        Email: email,
        Password: password,
        nombre_tienda: nombreTienda.trim(),
      });
      setSuccess(res.message ?? `Vendor ${email} creado.`);
      setEmail('');
      setPassword('');
      setNombreTienda('');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message || 'No se pudo crear el vendor.'
          : 'No se pudo crear el vendor.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">
          Panel de administración
        </h1>
        <p className="text-sm text-ink-500">
          Crea cuentas de vendor con su tienda asociada.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-ink-300 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <Store className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Nuevo vendor + tienda
        </div>

        <Input
          label="Nombre de la tienda"
          type="text"
          value={nombreTienda}
          onChange={(e) => setNombreTienda(e.target.value)}
          placeholder="Ej: Cafetería Central"
          required
        />
        <Input
          label="Correo del vendor"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vendor@correo.edu.co"
          required
        />
        <Input
          label="Contraseña inicial"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          placeholder="Mínimo 8 caracteres con un número"
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
        {success && (
          <p
            role="status"
            className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          >
            {success}
          </p>
        )}

        <Button type="submit" disabled={!isValid || submitting} size="lg">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Creando...' : 'Crear vendor'}
        </Button>
      </form>
    </section>
  );
}
