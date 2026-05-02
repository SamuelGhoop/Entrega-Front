import storesData from './stores.json';
import productsData from './products.json';
import { TOKEN_KEY } from '../client';
import type {
  Categoria,
  Orden,
  Producto,
  Role,
  Tienda,
} from '../../types';

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

interface MockUser {
  id: string;
  email: string;
  password: string;
  role: Role;
}

export const mockUsers: MockUser[] = [
  {
    id: 'mock-student-1',
    email: 'student@demo.com',
    password: '12345678',
    role: 'Student',
  },
  {
    id: 'mock-vendor-1',
    email: 'vendor@demo.com',
    password: '12345678',
    role: 'Vendor',
  },
  {
    id: 'mock-vendor-2',
    email: 'vendor2@demo.com',
    password: '12345678',
    role: 'Vendor',
  },
  {
    id: 'mock-admin-1',
    email: 'admin@demo.com',
    password: '12345678',
    role: 'Admin',
  },
];

function base64url(value: string): string {
  return btoa(value)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function makeMockToken(user: MockUser): string {
  const header = base64url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  );
  return `${header}.${payload}.mock`;
}

function makeUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getCurrentMockUserId(): string {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return mockUsers[0].id;
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(part));
    return payload.sub ?? mockUsers[0].id;
  } catch {
    return mockUsers[0].id;
  }
}

const baseStores = (storesData as Tienda[]).map((store, index) => {
  if (index === 0) return { ...store, vendorId: 'mock-vendor-1' };
  if (index === 1) return { ...store, vendorId: 'mock-vendor-2' };
  return store;
});

export const mockStores: Tienda[] = [...baseStores];
export const mockProducts: Producto[] = [...(productsData as Producto[])];

export const mockCategorias: Categoria[] = [
  {
    id_categoria: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    nombre_categoria: 'Desayunos & Snacks',
    isActive: 1,
    tiendaId: mockStores[0].id_tienda,
  },
  {
    id_categoria: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    nombre_categoria: 'Wraps & Bowls',
    isActive: 1,
    tiendaId: mockStores[1].id_tienda,
  },
];

export const mockOrdenes: Orden[] = [];

export const mockHelpers = {
  makeUuid,
  findCategoria: (id: string) =>
    mockCategorias.find((c) => c.id_categoria === id),
  findProducto: (id: string) =>
    mockProducts.find((p) => p.id_producto === id),
  findStore: (id: string) =>
    mockStores.find((s) => s.id_tienda === id),
};
