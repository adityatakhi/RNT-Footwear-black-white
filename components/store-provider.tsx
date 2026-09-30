"use client";
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
export type CartLine = { productId: string; slug: string; name: string; tone: "chalk" | "volt" | "ember" | "slate"; color: string; size: number; price: number; quantity: number };
type Snapshot = { cart: CartLine[]; wishlist: string[]; notice: string };
type StoreContextValue = Snapshot & { addToCart: (line: Omit<CartLine, "quantity">) => void; setQuantity: (key: string, quantity: number) => void; removeFromCart: (key: string) => void; toggleWishlist: (productId: string) => void; clearNotice: () => void };
const emptySnapshot: Snapshot = Object.freeze({ cart: [], wishlist: [], notice: "" });
let currentSnapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
const keyOf = (line: Pick<CartLine, "productId" | "size" | "color">) => `${line.productId}:${line.size}:${line.color}`;
function safeRead<T>(key: string, fallback: T): T { try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null"); return Array.isArray(value) ? value as T : fallback; } catch { localStorage.removeItem(key); return fallback; } }
function getSnapshot(): Snapshot {
  if (typeof window === "undefined") return emptySnapshot;
  if (!currentSnapshot) currentSnapshot = { cart: safeRead<CartLine[]>("rnt-cart", []), wishlist: safeRead<string[]>("rnt-wishlist", []), notice: "" };
  return currentSnapshot;
}
function getServerSnapshot() { return emptySnapshot; }
function publish(next: Snapshot) {
  currentSnapshot = next;
  localStorage.setItem("rnt-cart", JSON.stringify(next.cart));
  localStorage.setItem("rnt-wishlist", JSON.stringify(next.wishlist));
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); }
function addToCart(line: Omit<CartLine, "quantity">) {
  const state = getSnapshot(); const key = keyOf(line); const found = state.cart.find((item) => keyOf(item) === key);
  const cart = found ? state.cart.map((item) => keyOf(item) === key ? { ...item, quantity: item.quantity + 1 } : item) : [...state.cart, { ...line, quantity: 1 }];
  publish({ ...state, cart, notice: `${line.name} added to your bag` });
}
function setQuantity(key: string, quantity: number) { const state = getSnapshot(); publish({ ...state, cart: state.cart.map((item) => keyOf(item) === key ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item) }); }
function removeFromCart(key: string) { const state = getSnapshot(); publish({ ...state, cart: state.cart.filter((item) => keyOf(item) !== key) }); }
function toggleWishlist(productId: string) { const state = getSnapshot(); const wishlist = state.wishlist.includes(productId) ? state.wishlist.filter((id) => id !== productId) : [...state.wishlist, productId]; publish({ ...state, wishlist }); }
function clearNotice() { publish({ ...getSnapshot(), notice: "" }); }
const StoreContext = createContext<StoreContextValue | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ ...snapshot, addToCart, setQuantity, removeFromCart, toggleWishlist, clearNotice }), [snapshot]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore() { const value = useContext(StoreContext); if (!value) throw new Error("useStore must be used within StoreProvider"); return value; }
export const cartLineKey = keyOf;
