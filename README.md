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

## Cómo correr el proyecto

> Requisitos: **Node.js 20+** y **npm 10+**.

```bash
# 1. Clonar el repo y entrar a la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# (Windows: copy .env.example .env)
# Edita .env si tu backend corre en otra URL.

# 4. Arrancar el dev server
npm run dev
# Abre http://localhost:5173
```

### Modo sin backend (mocks locales)

Para revisar la UI sin levantar el backend ASP.NET Core:

```bash
# en .env
VITE_USE_MOCKS=true
```

Los servicios leerán desde `src/api/mocks/*.json`. Cambiar a `false` para integrar con el backend real.

### Cuentas de prueba

- **Student**: regístrate desde `/registro`.
- **Vendor**: lo crea un Admin desde `/admin` (ver flujo abajo).
- **Admin**: hay que insertarlo manualmente en la BD (el `register` solo crea Students por contrato del backend):
  ```sql
  -- ejecutar después de registrar un usuario normal
  INSERT INTO AspNetUserRoles (UserId, RoleId)
  SELECT u.Id, r.Id
  FROM AspNetUsers u, AspNetRoles r
  WHERE u.Email = 'admin@correo.com' AND r.Name = 'Admin';
  ```

### Flujo end-to-end para validar la entrega

1. Login como **Admin** → `/admin` → crear vendor + tienda.
2. Login como **Vendor** → `/vendor` → "Nueva categoría" → crear (ej. "Bebidas").
3. Tras crear la categoría se redirige a `/vendor/productos/nuevo` → crear producto.
4. Login como **Student** → `/tiendas` → entrar a la tienda → agregar producto al carrito.
5. `/checkout` → confirmar pago → tracking en `/ordenes/:id`.
6. Login como **Vendor** de nuevo → ver la orden y avanzar estados.

## Estructura

```
src/
├── api/                  ← capa de servicios (fetch) + mocks JSON
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

- El token JWT se guarda en `localStorage` (`polifood.token`) y se inyecta automáticamente en cada request desde `api/client.ts`.
- Si el backend usa HTTPS de desarrollo, ejecuta `dotnet dev-certs https --trust` o cambia la URL a HTTP en `.env`.
- El carrito se persiste en `localStorage` (`polifood.cart`) y se vacía si cambias de tienda.
