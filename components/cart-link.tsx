"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatCount } from "@/lib/format";

export function CartLink() {
  const lines = useCart();
  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <Link
      href="/cart"
      className="relative flex h-11 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium shadow-sm hover:bg-surface-muted"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path
          d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2M9 20h.01M17 20h.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Cart</span>
      {count > 0 && (
        <span className="tabular rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
          {formatCount(count)}
          <span className="sr-only"> items</span>
        </span>
      )}
    </Link>
  );
}
