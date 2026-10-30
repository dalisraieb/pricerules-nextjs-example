import type { PriceResult } from "@/lib/pricerules";
import { CustomerNotFoundNotice, PriceErrorNotice } from "./notices";
import { RetryButton } from "./retry-button";

/** What a page shows above its prices: a failed call, or an unknown customer. */
export function PricingNotices({ result }: { result: PriceResult }) {
  if (!result.ok) {
    return <PriceErrorNotice error={result.error} action={result.error.kind === "api" && <RetryButton />} />;
  }
  const unknown = result.data.warnings.some((warning) => warning.code === "CUSTOMER_NOT_FOUND");
  if (unknown && result.data.customer) return <CustomerNotFoundNotice code={result.data.customer.id} />;
  return null;
}
