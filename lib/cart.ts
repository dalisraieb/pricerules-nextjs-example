import { useSyncExternalStore } from "react";
import { MAX_QUANTITY } from "./catalog";

// The cart: SKUs and quantities only, kept in the browser's localStorage.
// It never holds prices: those are resolved on the server for the current
// customer every time the cart changes.

export type CartLine = { sku: string; quantity: number };

const STORAGE_KEY = "ironbridge-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.sku === "string" && Number.isInteger(line?.quantity) && line.quantity >= 1,
    );
  } catch {
    return EMPTY;
  }
}

function read(): CartLine[] {
  if (!loaded) {
    lines = load();
    loaded = true;
  }
  return lines;
}

function write(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the cart still works for this page view.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the cart.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    lines = load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

function clamp(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)));
}

export function addToCart(sku: string, quantity = 1) {
  const current = read();
  const existing = current.find((line) => line.sku === sku);
  write(
    existing
      ? current.map((line) =>
          line.sku === sku ? { sku, quantity: clamp(line.quantity + quantity) } : line,
        )
      : [...current, { sku, quantity: clamp(quantity) }],
  );
}

export function setQuantity(sku: string, quantity: number) {
  write(read().map((line) => (line.sku === sku ? { sku, quantity: clamp(quantity) } : line)));
}

export function removeFromCart(sku: string) {
  write(read().filter((line) => line.sku !== sku));
}

export function clearCart() {
  write(EMPTY);
}
