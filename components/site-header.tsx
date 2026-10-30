import Link from "next/link";
import { Suspense } from "react";
import { getCustomerCode } from "@/lib/customer-cookie";
import { CartLink } from "./cart-link";
import { CustomerSwitcher } from "./customer-switcher";

export function SiteHeader() {
  return (
    <header className="z-20 border-b border-line bg-surface sm:sticky sm:top-0 sm:bg-surface/90 sm:backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo />
          <span>Ironbridge Supply</span>
        </Link>

        <div className="order-3 w-full sm:order-none sm:ml-auto sm:w-auto">
          <Suspense fallback={<SwitcherSkeleton />}>
            <CurrentCustomerSwitcher />
          </Suspense>
        </div>

        <div className="ml-auto sm:ml-0">
          <CartLink />
        </div>
      </div>
    </header>
  );
}

async function CurrentCustomerSwitcher() {
  return <CustomerSwitcher current={await getCustomerCode()} />;
}

function SwitcherSkeleton() {
  return <div className="h-11 w-full animate-pulse rounded-lg bg-surface-muted sm:w-80" />;
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-accent" />
      <path
        d="M7 22h18M9 22v-6a7 7 0 0 1 14 0v6M16 9v13"
        className="stroke-accent-foreground"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
