import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "../data/catalog";

const CartContext = createContext(null);
const STORAGE_KEY = "veltryn-cart-v1";

function sanitize(list) {
  if (!Array.isArray(list)) return [];
  const byId = new Map(products.map((product) => [product.id, product]));
  const merged = new Map();

  list.forEach((item) => {
    const id = Number(item?.id);
    const product = byId.get(id);
    const qty = Number(item?.qty);
    if (!product || !Number.isFinite(qty) || qty <= 0) return;
    const cap = Math.min(10, product.stock || 10);
    const next = Math.min(cap, (merged.get(id) ?? 0) + Math.round(qty));
    if (next > 0) merged.set(id, next);
  });

  return Array.from(merged, ([id, qty]) => ({ id, qty }));
}

function readCart() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Storage can be blocked in private browsing. */
    }
  }, [items]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addToCart = (product, qty = 1) => {
    const amount = Math.max(1, Number(qty) || 1);
    const cap = Math.min(10, Number(product.stock) || 10);
    const current = items.find((item) => item.id === product.id)?.qty ?? 0;

    if (current >= cap) {
      setToast({
        key: Date.now(),
        message: `You already have the maximum of ${cap} for ${product.name}.`,
      });
      return;
    }

    const nextQty = Math.min(cap, current + amount);
    setItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (!exists) return [...prev, { id: product.id, qty: nextQty }];
      return prev.map((item) => (item.id === product.id ? { ...item, qty: nextQty } : item));
    });

    const added = nextQty - current;
    setToast({
      key: Date.now(),
      message: added > 1 ? `Added ${added} × ${product.name} to your cart.` : `Added ${product.name} to your cart.`,
    });
  };

  const updateQty = (id, qty) => {
    const product = products.find((item) => item.id === id);
    const cap = Math.min(10, product?.stock ?? 10);
    const next = Math.max(1, Math.min(cap, qty));
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: next } : item)));
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);
  const dismissToast = () => setToast(null);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  const value = {
    items,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    count,
    toast,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
