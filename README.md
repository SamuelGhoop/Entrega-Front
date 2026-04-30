# PoliFood — Frontend

Frontend de **PoliFood**, plataforma de pedidos de comida del campus con roles `Student`, `Vendor` y `Admin`.

Esta SPA se conecta al backend ASP.NET Core en `D:/Samuel/Web backend/PoliFoodCaso/PoliFoodCaso` (API REST con JWT).

---

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v3** (responsive, mobile-first)
- **React Router** (rutas anidadas + `Outlet` + rutas protegidas por rol)
- **fetch** + `async/await` (cliente propio en `api/client.ts` con `ApiError`, JWT y manejo de 401)
- **lucide-react** (íconos)

## Estructura

```
src/
├── api/                  ← capa de servicios (axios) + mocks JSON
│   ├── client.ts
│   ├── authService.ts
│   ├── storeService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── mocks/
├── components/
│   ├── ui/               ← Button, Input, Spinner, EmptyState, ErrorState
│   ├── layout/           ← Navbar, ProtectedRoute
│   ├── stores/
│   ├── menu/
│   └── orders/
├── context/              ← AuthContext, CartContext
├── hooks/                ← useAuth, useCart
├── layouts/              ← AppLayout
├── lib/                  ← jwt, format
├── pages/                ← una vista por archivo
├── types/                ← DTOs alineados con el backend
├── App.tsx               ← router
├── main.tsx              ← providers
└── index.css             ← Tailwind directives
```

## Vistas implementadas

| Ruta                   | Acceso     | Vista                          |
| ---------------------- | ---------- | ------------------------------ |
| `/login`               | Pública    | Login                          |
| `/registro`            | Pública    | Registro de Student            |
| `/tiendas`             | Pública    | Lista de tiendas + búsqueda    |
| `/tiendas/:tiendaId`   | Pública    | Menú por tienda + búsqueda     |
| `/carrito`             | Student    | Carrito persistente            |
| `/checkout`            | Student    | Checkout simulado              |
| `/ordenes`             | Student    | Mis órdenes                    |
| `/ordenes/:ordenId`    | Student    | Tracking de orden              |
| `/vendor`              | Vendor     | Dashboard de órdenes + filtros |
| `/vendor/categorias/nueva` | Vendor | Crear categoría en su tienda  |
| `/vendor/productos/nuevo` | Vendor  | Crear producto (requiere categoría) |
| `/admin`               | Admin      | Crear vendors + tienda asociada |

## Endpoints consumidos

- `POST   /api/Auth/login`, `POST /api/Auth/register`, `POST /api/Auth/create-vendor` (Admin)
- `GET    /api/Tienda`, `GET /api/Tienda/{id}`
- `GET    /api/Categoria/{tiendaId}`, `POST /api/Categoria` (Vendor)
- `GET    /api/Producto/{tiendaId}`, `GET /api/Producto/detalle/{id}`, `POST /api/Producto` (Vendor)
- `POST   /api/Orden/checkout`, `PATCH /api/Orden/{id}/confirmar-pago`
- `GET    /api/Orden/student`, `GET /api/Orden/tienda/{tiendaId}`
- `PATCH  /api/Orden/{id}/estado`

## Configuración

```bash
cp .env.example .env
# edita .env con la URL de tu API
```

Variables:

| Variable         | Default                       | Descripción                                |
| ---------------- | ----------------------------- | ------------------------------------------ |
| `VITE_API_URL`   | `https://localhost:7170/api`  | Base URL del backend ASP.NET Core          |
| `VITE_USE_MOCKS` | `false`                       | Si `true`, lee desde `src/api/mocks/*.json` |

## Scripts

```bash
npm install       # instala dependencias
npm run dev       # arranca dev server (http://localhost:5173)
npm run build     # build producción a /dist
npm run preview   # sirve /dist localmente
npm run lint      # ESLint
```

## Notas

- El token JWT se guarda en `localStorage` (`polifood.token`) y se inyecta vía interceptor de axios.
- Si el backend usa HTTPS de desarrollo, ejecuta `dotnet dev-certs https --trust` o cambia la URL a HTTP en `.env`.
- El carrito se persiste en `localStorage` (`polifood.cart`) y se vacía si cambias de tienda.
