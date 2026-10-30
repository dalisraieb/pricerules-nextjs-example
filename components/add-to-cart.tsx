"use client";

import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { QuantityStepper } from "./quantity-stepper";

/** Adds a product to the cart; with `withQuantity`, a stepper picks how many. */
export function AddToCart({
  sku,
  name,
  disabled = false,
  withQuantity = false,
}: {
  sku: string;
  name: string;
  disabled?: boolean;
  withQuantity?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <div className={cn("flex gap-3", withQuantity ? "flex-wrap items-center" : "flex-col")}>
      {withQuantity && !disabled && (
        <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantity of ${name}`} />
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addToCart(sku, quantity);
          setAdded(true);
        }}
        className={cn(
          "h-11 rounded-lg px-5 text-sm font-semibold transition-colors",
          disabled
            ? "cursor-not-allowed bg-surface-muted text-muted"
            : "bg-accent text-accent-foreground hover:opacity-90",
          withQuantity && "flex-1 sm:flex-none",
        )}
      >
        {disabled ? "Unavailable" : added ? "Added ✓" : "Add to cart"}
      </button>
      <span className="sr-only" aria-live="polite">
        {added ? `${name} added to cart` : ""}
      </span>
    </div>
  );
}
