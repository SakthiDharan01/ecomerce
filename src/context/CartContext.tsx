"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

export type CartLine = {
  product: Product;
  quantity: number;
  size: string;
};

type CartContextType = {
  items: CartLine[];
  lastOrder: CartLine[];
  addToCart: (product: Product, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  placeOrder: () => void;
  totalPrice: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartLine[]>([]);
  const [lastOrder, setLastOrder] = useState<CartLine[]>([]);

  const addToCart = useCallback((product: Product, size: string) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.product.id === product.id && item.size === size,
      );

      if (existingIndex === -1) {
        return [...current, { product, size, quantity: 1 }];
      }

      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      return updated;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      setItems((current) => {
        if (quantity <= 0) {
          return current.filter(
            (item) => !(item.product.id === productId && item.size === size),
          );
        }

        return current.map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item,
        );
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.product.id === productId && item.size === size),
      ),
    );
  }, []);

  const placeOrder = useCallback(() => {
    setLastOrder(items);
    setItems([]);
  }, [items]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      lastOrder,
      addToCart,
      updateQuantity,
      removeItem,
      placeOrder,
      totalPrice,
      cartCount,
    }),
    [
      items,
      lastOrder,
      addToCart,
      updateQuantity,
      removeItem,
      placeOrder,
      totalPrice,
      cartCount,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
