import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md text-center">
      <Compass className="mx-auto mb-4 h-12 w-12 text-brand-600" aria-hidden="true" />
      <h1 className="mb-2 text-3xl font-bold text-ink-900">404</h1>
      <p className="mb-6 text-ink-500">Esta página no existe.</p>
      <Link
        to="/"
        className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
