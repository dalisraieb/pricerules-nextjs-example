import Link from "next/link";
import type { Product } from "@/lib/catalog";
import type { PriceView } from "@/lib/explain";
import { AddToCart } from "./add-to-cart";
import { CategoryIcon } from "./category-icon";
import { PriceTag } from "./price-tag";

/** `view` is null when prices couldn't be loaded. */
export function ProductCard({ product, view }: { product: Product; view: PriceView | null }) {
  const href = `/products/${product.sku}`;

  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-col sm:gap-0">
      <Link
        href={href}
        className="relative grid size-20 shrink-0 place-items-center rounded-xl bg-surface-muted sm:aspect-[4/3] sm:size-auto"
        tabIndex={-1}
      >
        <CategoryIcon category={product.category} className="size-9 sm:size-14" />
        {product.isNew && (
          <span className="absolute -top-1.5 -left-1.5 rounded-md bg-surface px-2 py-0.5 text-xs font-semibold shadow-sm sm:top-2.5 sm:left-2.5">
            New
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col sm:mt-4">
        <p className="font-mono text-xs text-muted">{product.sku}</p>
        <h2 className="mt-1 font-medium leading-snug">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h2>

        <div className="mt-3 flex-1">
          {view ? <PriceTag view={view} /> : <p className="text-sm text-muted">Price unavailable</p>}
        </div>

        <div className="mt-4">
          <AddToCart sku={product.sku} name={product.name} disabled={view?.kind === "not_found"} />
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:flex-col sm:gap-0">
      <div className="size-20 shrink-0 animate-pulse rounded-xl bg-surface-muted sm:aspect-[4/3] sm:size-auto" />
      <div className="flex-1 sm:mt-4">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-muted" />
        <div className="mt-2 h-5 w-4/5 animate-pulse rounded bg-surface-muted" />
        <div className="mt-4 h-7 w-24 animate-pulse rounded bg-surface-muted" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
        <div className="mt-5 h-11 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    </div>
  );
}
