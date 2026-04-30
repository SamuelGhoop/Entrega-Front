import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-600' : 'text-ink-700 hover:text-ink-900'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-300 bg-white/90 backdrop-blur">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-ink-900"
        >
          <UtensilsCrossed className="h-5 w-5 text-brand-600" aria-hidden="true" />
          PoliFood
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          <li>
            <NavLink to="/tiendas" className={linkClass}>
              Tiendas
            </NavLink>
          </li>
          {user?.role === 'Student' && (
            <li>
              <NavLink to="/ordenes" className={linkClass}>
                Mis órdenes
              </NavLink>
            </li>
          )}
          {user?.role === 'Vendor' && (
            <li>
              <NavLink to="/vendor" className={linkClass}>
                Panel vendor
              </NavLink>
            </li>
          )}
          {user?.role === 'Admin' && (
            <li>
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2">
          {user?.role === 'Student' && (
            <Link
              to="/carrito"
              aria-label={`Carrito (${itemCount} ítems)`}
              className="relative inline-flex items-center justify-center rounded-lg border border-ink-300 bg-white p-2 text-ink-700 hover:bg-ink-100"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
