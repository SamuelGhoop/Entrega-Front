export type Role = 'Student' | 'Vendor' | 'Admin';

export interface LoginDTO {
  Email: string;
  Password: string;
}

export interface RegisterDTO {
  Email: string;
  Password: string;
  Role: Role;
}

export interface CreateVendorDTO {
  Email: string;
  Password: string;
  nombre_tienda: string;
}

export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: Role | Role[];
  exp: number;
  [key: string]: unknown;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  token: string;
}

export interface Tienda {
  id_tienda: string;
  nombre_tienda: string;
  isActive: number;
  vendorId: string;
  imagen_url?: string;
  descripcion?: string;
}

export interface Categoria {
  id_categoria: string;
  nombre_categoria: string;
  isActive: number;
  tiendaId: string;
}

export interface Producto {
  id_producto: string;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  disponible: boolean;
  minutos_preparacion: number;
  isActive: number;
  categoriaId: string;
  tiendaId?: string;
}

export type EstadoOrden = 0 | 1 | 2 | 3;

export const EstadoOrdenLabel: Record<EstadoOrden, string> = {
  0: 'Recibida',
  1: 'Preparando',
  2: 'Lista',
  3: 'Entregada',
};

export interface CheckoutItemDTO {
  productoId: string;
  cantidad: number;
}

export interface CheckoutDTO {
  items: CheckoutItemDTO[];
}

export interface Orden {
  id_orden: string;
  estado: EstadoOrden;
  total: number;
  minutos_estimados: number;
  pago_confirmado: boolean;
  fecha_pago: string | null;
  fecha_creacion: string;
  isActive: number;
  studentId: string;
  tiendaId: string;
  tienda?: Tienda | null;
}

export interface CartLine {
  producto: Producto;
  cantidad: number;
}
