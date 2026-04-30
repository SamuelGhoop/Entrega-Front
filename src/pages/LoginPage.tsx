import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/client';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = email.includes('@') && password.length >= 8;

  const from = (location.state as { from?: string } | null)?.from ?? '/tiendas';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const user = await login({ Email: email, Password: password });
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

  return (
    <section className="mx-auto max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Bienvenido a PoliFood</h1>
        <p className="mt-1 text-sm text-ink-500">
          Pide tu comida del campus en segundos.
        </p>
      </header>

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
          required
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
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
