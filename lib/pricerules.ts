import "server-only";
import { unstable_rethrow } from "next/navigation";
import { PriceRules, PriceRulesError, type ProductInput, type ResolveData } from "pricerules";
import { errorSentence, type PriceError } from "./price-error";

// The only module that talks to PriceRules. `server-only` makes importing it
// from a Client Component a build error, so the API key can't reach the
// browser: pages call it while rendering on the server, and the cart goes
// through this app's own POST /api/cart.

let client: PriceRules | undefined;

function pricerules(): PriceRules {
  // Reads PRICERULES_API_KEY from the environment; throws MISSING_API_KEY
  // without it. PRICERULES_BASE_URL is optional (a local PriceRules or a mock).
  client ??= new PriceRules({ baseUrl: process.env.PRICERULES_BASE_URL || undefined });
  return client;
}

export type PriceResult =
  | { ok: true; data: ResolveData }
  | { ok: false; error: PriceError };

/**
 * Prices every line for one customer in a single call. `customerId` null is a
 * guest: only rules for every customer apply. Never throws: a failure comes
 * back as a PriceError the page can show.
 */
export async function priceLines(
  customerId: string | null,
  products: ProductInput[],
): Promise<PriceResult> {
  try {
    const { data } = await pricerules().resolve({
      customerId: customerId ?? undefined,
      products,
    });
    return { ok: true, data };
  } catch (error) {
    // When Next.js ends a prerender it rejects pending fetches; the SDK wraps
    // that in its connection error. Hand Next.js its own errors back.
    if (error instanceof PriceRulesError && error.cause) unstable_rethrow(error.cause);
    unstable_rethrow(error);
    return { ok: false, error: toPriceError(error) };
  }
}

function toPriceError(error: unknown): PriceError {
  if (error instanceof PriceRulesError) {
    if (error.code === "MISSING_API_KEY") return { kind: "setup" };
    console.error(
      `PriceRules ${error.code} (status ${error.status ?? "none"}, request ${error.requestId ?? "none"}): ${error.message}`,
    );
    return {
      kind: "api",
      code: error.code,
      message: errorSentence(error.code),
      requestId: error.requestId ?? null,
    };
  }
  console.error("Unexpected error while pricing", error);
  return { kind: "api", code: "UNEXPECTED", message: errorSentence(""), requestId: null };
}
