import type { Metadata } from "next";
import { Suspense } from "react";
import { CartView } from "@/components/cart-view";
import { getCustomerCode } from "@/lib/customer-cookie";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-surface" />}>
        <CartForCustomer />
      </Suspense>
    </div>
  );
}

// The cart prices itself through POST /api/cart, which reads the customer
// from the cookie. Passing the code here re-prices it when the switcher changes.
async function CartForCustomer() {
  return <CartView customer={await getCustomerCode()} />;
}
