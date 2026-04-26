import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine, Producto } from '../types';

const STORAGE_KEY = 'polifood.cart';

interface CartContextValue {
  lines: CartLine[];
  tiendaId: string | null;
  total: number;
  itemCount: number;
  addItem: (producto: Producto, tiendaId: string) => void;
  updateQty: (productoId: string, cantidad: number) => void;
  removeItem: (productoId: string) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

interface PersistedCart {
  tiendaId: string | null;
  lines: CartLine[];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [tiendaId, setTiendaId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PersistedCart;
      setLines(parsed.lines ?? []);
      setTiendaId(parsed.tiendaId ?? null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload: PersistedCart = { lines, tiendaId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [lines, tiendaId]);

  const addItem = useCallback(
    (producto: Producto, fromTiendaId: string) => {
      setLines((prev) => {
        if (tiendaId && tiendaId !== fromTiendaId) {
          setTiendaId(fromTiendaId);
          return [{ producto, cantidad: 1 }];
        }
        if (!tiendaId) setTiendaId(fromTiendaId);
        const existing = prev.find(
          (l) => l.producto.id_producto === producto.id_producto
        );
        if (existing) {
          return prev.map((l) =>
            l.producto.id_producto === producto.id_producto
              ? { ...l, cantidad: l.cantidad + 1 }
              : l
          );
        }
        return [...prev, { producto, cantidad: 1 }];
      });
    },
    [tiendaId]
  );

  const updateQty = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setLines((prev) =>
        prev.filter((l) => l.producto.id_producto !== productoId)
      );
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.producto.id_producto === productoId ? { ...l, cantidad } : l
      )
    );
  }, []);

  const removeItem = useCallback((productoId: string) => {
    setLines((prev) =>
      prev.filter((l) => l.producto.id_producto !== productoId)
    );
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setTiendaId(null);
  }, []);

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.producto.precio * l.cantidad, 0),
    [lines]
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.cantidad, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      tiendaId,
      total,
      itemCount,
      addItem,
      updateQty,
      removeItem,
      clear,
    }),
    [lines, tiendaId, total, itemCount, addItem, updateQty, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
