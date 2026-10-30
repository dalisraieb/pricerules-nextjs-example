// What the store shows when PriceRules can't price a request. Safe to send
// to the browser: a code, a sentence and the request id, never the API key
// or a stack.

export type PriceError =
  | { kind: "setup" }
  | { kind: "api"; code: string; message: string; requestId: string | null };

export function errorSentence(code: string): string {
  switch (code) {
    case "UNAUTHORIZED":
      return "The store's PriceRules API key was rejected. Check PRICERULES_API_KEY.";
    case "RATE_LIMIT_EXCEEDED":
      return "Too many price requests right now. Try again in a moment.";
    case "MONTHLY_LIMIT_REACHED":
      return "This workspace has used its price resolutions for the month.";
    case "PRICING_ENGINE_UNAVAILABLE":
    case "CONNECTION_ERROR":
    case "TIMEOUT":
      return "Prices couldn't be loaded right now. Try again in a moment.";
    case "MAX_PRODUCTS_EXCEEDED":
      return "Too many products to price in one request.";
    default:
      return "Prices couldn't be loaded.";
  }
}
