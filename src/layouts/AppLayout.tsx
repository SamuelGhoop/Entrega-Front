import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-ink-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 pt-4 text-center text-xs text-ink-500 md:px-6">
        © {new Date().getFullYear()} PoliFood — Pedidos del campus
      </footer>
    </div>
  );
}
