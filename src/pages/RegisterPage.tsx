import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/client';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const emailError = !/^\S+@\S+\.\S+$/.test(email)
    ? 'Ingresa un correo válido.'
    : undefined;

  const passwordError =
    password.length < 8
      ? 'Mínimo 8 caracteres.'
      : !/\d/.test(password)
        ? 'Debe incluir al menos un número.'
        : undefined;

  const isValid = !emailError && !passwordError;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await register({ Email: email, Password: password, Role: 'Student' });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message || 'No se pudo registrar (¿correo ya en uso?).'
          : 'No se pudo registrar.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-ink-500">Solo para estudiantes del campus.</p>
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
          error={emailError}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          required
        />

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p
            role="status"
            className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          >
            ¡Cuenta creada! Redirigiendo al login...
          </p>
        )}

        <Button type="submit" disabled={!isValid || submitting} fullWidth size="lg">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Creando...' : 'Crear cuenta'}
        </Button>

        <p className="text-center text-sm text-ink-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Inicia sesión
          </Link>
        </p>
      </form>
    </section>
  );
}
