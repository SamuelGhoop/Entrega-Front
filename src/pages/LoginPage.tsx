import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/client';
import { USE_MOCKS } from '../api/mocks';

const DEMO_ACCOUNTS = [
  { label: 'Student', email: 'student@demo.com', password: '12345678' },
  { label: 'Vendor (Cafetería)', email: 'vendor@demo.com', password: '12345678' },
  { label: 'Vendor (Wraps)', email: 'vendor2@demo.com', password: '12345678' },
  { label: 'Admin', email: 'admin@demo.com', password: '12345678' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = !/^\S+@\S+\.\S+$/.test(email)
    ? 'Ingresa un correo válido.'
    : undefined;

  const passwordError =
    password.length < 8 ? 'Mínimo 8 caracteres.' : undefined;

  const isValid = !emailError && !passwordError;

  const from = (location.state as { from?: string } | null)?.from ?? '/tiendas';

  const doLogin = async (creds: { email: string; password: string }) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const user = await login({
        Email: creds.email,
        Password: creds.password,
      });
      const target =
        user.role === 'Vendor'
          ? '/vendor'
          : user.role === 'Admin'
            ? '/admin'
            : from;
      navigate(target, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message || 'Credenciales incorrectas.'
          : 'No se pudo iniciar sesión.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    await doLogin({ email, password });
  };

  return (
    <section className="mx-auto max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Bienvenido a PoliFood</h1>
        <p className="mt-1 text-sm text-ink-500">
          Pide tu comida del campus en segundos.
        </p>
      </header>

      {USE_MOCKS && (
        <aside
          aria-label="Cuentas de demostración"
          className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p className="mb-2 font-medium">
            Modo demo — entra con un click:
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() =>
                  doLogin({ email: acc.email, password: acc.password })
                }
                disabled={submitting}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
              >
                Entrar como {acc.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-amber-800">
            Contraseña común: <code>12345678</code>
          </p>
        </aside>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-ink-300 bg-white p-6 shadow-sm"
      >
        <Input
          label="Correo"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.edu.co"
          error={emailError}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          error={passwordError}
          required
        />

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" disabled={!isValid || submitting} fullWidth size="lg">
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-sm text-ink-500">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-brand-600 hover:text-brand-700">
            Regístrate
          </Link>
        </p>
      </form>
    </section>
  );
}
