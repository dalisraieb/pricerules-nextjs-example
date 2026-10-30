import Link from "next/link";
import { Suspense } from "react";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { PricingNotices } from "@/components/pricing-notices";
import { CATEGORIES, findCategory, PRODUCTS } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { getCustomerCode } from "@/lib/customer-cookie";
import { findAccount } from "@/lib/customers";
import { explainItem } from "@/lib/explain";
import { priceLines } from "@/lib/pricerules";

export default function CatalogPage({ searchParams }: PageProps<"/">) {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Industrial supplies</h1>
        <p className="mt-3 text-muted">
          Fasteners, tools, safety gear and valves for the trade. Switch the customer at the top to see
          each account&apos;s prices, straight from PriceRules.
        </p>
      </div>

      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const { category } = await searchParams;
  const active = findCategory(typeof category === "string" ? category : undefined);
  const products = active ? PRODUCTS.filter((product) => product.category === active.slug) : PRODUCTS;

  // One call prices every product on the page for this customer.
  const customer = await getCustomerCode();
  const result = await priceLines(
    customer,
    products.map((product) => ({ sku: product.sku, quantity: 1 })),
  );
  const account = findAccount(customer);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-3">
        <span className="font-medium">
          {customer ? (
            <>
              Prices for <span className="font-mono">{customer}</span>
              {account && <> · {account.name}</>}
            </>
          ) : (
            "Guest prices (list prices)"
          )}
        </span>
        {account && <span className="text-muted sm:before:mr-3 sm:before:content-['—']">{account.note}</span>}
      </div>

      <PricingNotices result={result} />

      <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-2 pb-1">
          <CategoryTab href="/" label="All products" active={!active} />
          {CATEGORIES.map((item) => (
            <CategoryTab
              key={item.slug}
              href={`/?category=${item.slug}`}
              label={item.name}
              active={active?.slug === item.slug}
            />
          ))}
        </ul>
      </nav>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <li key={product.sku} className="flex flex-col [&>*]:flex-1">
            <ProductCard product={product} view={result.ok ? explainItem(result.data.items[index]) : null} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors",
          active
            ? "border-foreground bg-foreground text-background"
            : "border-line bg-surface text-muted hover:text-foreground",
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function CatalogSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading prices">
      <div className="h-12 animate-pulse rounded-xl bg-surface" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-surface" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
