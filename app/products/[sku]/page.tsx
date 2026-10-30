import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { CategoryIcon } from "@/components/category-icon";
import { PriceTag } from "@/components/price-tag";
import { PricingNotices } from "@/components/pricing-notices";
import { categoryName, findProduct, PRODUCTS, type Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { getCustomerCode } from "@/lib/customer-cookie";
import { explainItem } from "@/lib/explain";
import { formatCount, formatPercent, formatPrice } from "@/lib/format";
import { priceLines } from "@/lib/pricerules";

// The quantities in the volume pricing table. The sample data's volume
// breaks start at 5, 10, 20, 50 and 100 units.
const VOLUME_QUANTITIES = [1, 5, 10, 20, 50, 100];

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ sku: product.sku }));
}

export async function generateMetadata({ params }: PageProps<"/products/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  return { title: findProduct(sku)?.name ?? "Product not found" };
}

export default async function ProductPage({ params }: PageProps<"/products/[sku]">) {
  const { sku } = await params;
  const product = findProduct(sku);
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Catalog
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/?category=${product.category}`} className="hover:text-foreground">
          {categoryName(product.category)}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="relative grid aspect-square place-items-center rounded-2xl border border-line bg-surface lg:aspect-[4/3.4]">
          <CategoryIcon category={product.category} className="size-28 sm:size-36" />
          {product.isNew && (
            <span className="absolute top-4 left-4 rounded-md bg-surface-muted px-2.5 py-1 text-xs font-semibold">
              New arrival
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="font-mono text-sm text-muted">{product.sku}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>
          </div>

          <Suspense fallback={<PriceSkeleton />}>
            <ProductPricing product={product} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProductPricing({ product }: { product: Product }) {
  // One call: the same SKU at every quantity in the table. The first line
  // (quantity 1) is the price shown at the top.
  const result = await priceLines(
    await getCustomerCode(),
    VOLUME_QUANTITIES.map((quantity) => ({ sku: product.sku, quantity })),
  );

  if (!result.ok) return <PricingNotices result={result} />;

  const views = result.data.items.map(explainItem);
  const [single] = views;

  return (
    <div className="space-y-6">
      <PricingNotices result={result} />

      <div className="rounded-2xl border border-line bg-surface p-5">
        <PriceTag view={single} size="lg" />
        <div className="mt-5 border-t border-line pt-5">
          <AddToCart
            sku={product.sku}
            name={product.name}
            disabled={single.kind === "not_found"}
            withQuantity
          />
        </div>
      </div>

      {single.kind === "priced" && (
        <section aria-labelledby="volume-pricing">
          <h2 id="volume-pricing" className="font-semibold">
            Price by quantity
          </h2>
          <p className="mt-1 text-sm text-muted">Your unit price at each quantity, from the same call.</p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-left text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Quantity</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Unit price</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">You save</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Rule</th>
                </tr>
              </thead>
              <tbody>
                {views.map((view) => {
                  if (view.kind !== "priced") return null;
                  const better = view.finalPrice < single.finalPrice;
                  return (
                    <tr key={view.quantity} className="border-t border-line">
                      <td className="tabular px-4 py-3">{formatCount(view.quantity)}</td>
                      <td className={cn("tabular px-4 py-3 text-right font-semibold", better && "text-accent-ink")}>
                        {formatPrice(view.finalPrice)}
                      </td>
                      <td className="tabular hidden px-4 py-3 text-right text-saving sm:table-cell">
                        {view.saving > 0 ? `−${formatPercent(view.savingPercent)}` : <span className="text-muted">—</span>}
                      </td>
                      <td className="px-4 py-3 text-muted">{view.ruleName ?? view.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function PriceSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading prices">
      <div className="h-52 animate-pulse rounded-2xl bg-surface" />
      <div className="h-64 animate-pulse rounded-2xl bg-surface" />
    </div>
  );
}
