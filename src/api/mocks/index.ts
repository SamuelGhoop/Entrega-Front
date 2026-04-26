import storesData from './stores.json';
import productsData from './products.json';
import type { Producto, Tienda } from '../../types';

export const mockStores = storesData as Tienda[];
export const mockProducts = productsData as Producto[];

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
