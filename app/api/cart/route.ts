import { findProduct, MAX_QUANTITY } from "@/lib/catalog";
import { getCustomerCode } from "@/lib/customer-cookie";
import { priceLines } from "@/lib/pricerules";

// The cart's backend. The browser sends SKUs and quantities; this route
// prices every line in one PriceRules call, for the customer in the cookie
// (never one the request body names), and returns the result.

const MAX_LINES = 100;

export async function POST(request: Request) {
  const lines = parseLines(await request.json().catch(() => null));
  if (!lines) {
    return Response.json(
      { error: { kind: "api", code: "INVALID_CART", message: "The cart couldn't be read.", requestId: null } },
      { status: 400 },
    );
  }

  const result = await priceLines(await getCustomerCode(), lines);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.error.kind === "setup" ? 500 : 502 });
  }
  return Response.json({ data: result.data });
}

function parseLines(body: unknown): { sku: string; quantity: number }[] | null {
  if (typeof body !== "object" || body === null || !("lines" in body)) return null;
  const { lines } = body;
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) return null;

  const parsed: { sku: string; quantity: number }[] = [];
  for (const line of lines) {
    const sku = line?.sku;
    const quantity = line?.quantity;
    if (typeof sku !== "string" || !findProduct(sku)) return null;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null;
    parsed.push({ sku, quantity });
  }
  return parsed;
}
