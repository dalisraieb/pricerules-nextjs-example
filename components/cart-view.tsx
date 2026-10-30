"use client";

import Link from "next/link";
import type { ResolveData } from "pricerules";
import { useEffect, useState, useSyncExternalStore } from "react";
import { removeFromCart, setQuantity, useCart, type CartLine } from "@/lib/cart";
import { findProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { explainItem, type PriceView } from "@/lib/explain";
import { formatPrice } from "@/lib/format";
import type { PriceError } from "@/lib/price-error";
import { CategoryIcon } from "./category-icon";
import { CustomerNotFoundNotice, PriceErrorNotice } from "./notices";
import { PriceTag } from "./price-tag";
import { QuantityStepper } from "./quantity-stepper";

type Priced = { lines: CartLine[]; data: ResolveData };

/**
 * The cart. Every change (a quantity, a line, the customer) sends all lines
 * to POST /api/cart, which prices them in one PriceRules call, so a quantity
 * crossing a volume break changes the price right away.
 */
export function CartView({ customer }: { customer: string | null }) {
  const lines = useCart();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [priced, setPriced] = useState<Priced | null>(null);
  const [error, setError] = useState<PriceError | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (lines.length === 0) return;
    const controller = new AbortController();
    // A short pause so clicking + five times sends one request.
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
          signal: controller.signal,
        });
        const body: { data?: ResolveData; error?: PriceError } = await response.json();
        if (body.data) {
          setPriced({ lines, data: body.data });
          setError(null);
        } else {
          setError(body.error ?? networkError);
        }
      } catch (caught) {
        if (controller.signal.aborted) return;
        console.error(caught);
        setError(networkError);
      }
      setLoading(false);
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lines, customer, attempt]);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-surface" />;

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="mt-1 text-muted">Add a few products to see this customer&apos;s prices per line.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  // Each line's price from the latest response; "stale" while its quantity
  // is being re-priced.
  const rows = lines.map((line) => {
    const index = priced?.lines.findIndex((pricedLine) => pricedLine.sku === line.sku) ?? -1;
    const view = index >= 0 && priced ? explainItem(priced.data.items[index]) : null;
    const stale = !view || priced?.lines[index].quantity !== line.quantity;
    return { line, view, stale };
  });
  const totals = cartTotals(rows.map((row) => row.view));
  const unknownCustomer =
    priced?.data.customer && priced.data.warnings.some((warning) => warning.code === "CUSTOMER_NOT_FOUND")
      ? priced.data.customer.id
      : null;

  return (
    <div className="space-y-6">
      {error && (
        <PriceErrorNotice
          error={error}
          action={
            error.kind === "api" && (
              <button
                type="button"
                onClick={() => setAttempt((count) => count + 1)}
                className="h-10 shrink-0 rounded-lg border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-muted"
              >
                Try again
              </button>
            )
          }
        />
      )}
      {!error && unknownCustomer && <CustomerNotFoundNotice code={unknownCustomer} />}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {rows.map(({ line, view, stale }) => (
            <CartRow key={line.sku} line={line} view={view} stale={stale && loading} />
          ))}
        </ul>

        <aside className="rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold">Order summary</h2>
          <p className="mt-1 text-sm text-muted">
            {customer ? (
              <>
                Prices for <span className="font-mono">{customer}</span>
              </>
            ) : (
              "Guest prices"
            )}
          </p>
          <dl className={cn("mt-4 space-y-2 text-sm transition-opacity", loading && "opacity-60")}>
            <div className="flex justify-between">
              <dt className="text-muted">List price</dt>
              <dd className="tabular">{formatPrice(totals.list)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Your savings</dt>
              <dd className="tabular text-saving">{totals.savings > 0 ? `−${formatPrice(totals.savings)}` : formatPrice(0)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-xs text-muted" aria-live="polite">
            {loading ? "Updating prices…" : "Excludes tax and shipping."}
          </p>
          <button
            type="button"
            disabled
            className="mt-5 h-11 w-full cursor-not-allowed rounded-lg bg-accent text-sm font-semibold text-accent-foreground opacity-60"
          >
            Checkout (not part of the demo)
          </button>
        </aside>
      </div>
    </div>
  );
}

function CartRow({ line, view, stale }: { line: CartLine; view: PriceView | null; stale: boolean }) {
  const product = findProduct(line.sku);
  const name = product?.name ?? line.sku;

  return (
    <li className="flex gap-4 p-4 sm:p-5">
      <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-surface-muted sm:size-20">
        {product && <CategoryIcon category={product.category} className="size-8 sm:size-10" />}
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted">{line.sku}</p>
            <Link href={`/products/${line.sku}`} className="font-medium hover:underline hover:underline-offset-4">
              {name}
            </Link>
          </div>
          <p className={cn("tabular shrink-0 text-right font-semibold transition-opacity", stale && "opacity-50")}>
            {view?.kind === "priced" ? formatPrice(view.finalPrice * line.quantity) : "—"}
          </p>
        </div>

        <div className={cn("transition-opacity", stale && "opacity-50")}>
          {view?.kind === "not_found" ? (
            <p className="text-sm font-medium text-danger">No longer available. Remove it to check out.</p>
          ) : view ? (
            <PriceTag view={view} />
          ) : (
            <div className="h-16 animate-pulse rounded-lg bg-surface-muted" />
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            onChange={(quantity) => setQuantity(line.sku, quantity)}
            label={`Quantity of ${name}`}
          />
          <button
            type="button"
            onClick={() => removeFromCart(line.sku)}
            className="h-11 rounded-lg px-3 text-sm text-muted hover:text-danger"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

function cartTotals(views: (PriceView | null)[]) {
  let list = 0;
  let total = 0;
  for (const view of views) {
    if (view?.kind !== "priced") continue;
    list += view.basePrice * view.quantity;
    total += view.finalPrice * view.quantity;
  }
  return { list, total, savings: Math.max(0, list - total) };
}

const networkError: PriceError = {
  kind: "api",
  code: "NETWORK_ERROR",
  message: "Couldn't reach the store's server. Check your connection and try again.",
  requestId: null,
};

const noopSubscribe = () => () => {};
