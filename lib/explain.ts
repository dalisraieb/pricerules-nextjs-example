import type { PricedItem, ResolvedItem } from "pricerules";
import { formatDay } from "./format";

// Turns a PriceRules item into what a buyer reads. Pure, so the server
// components and the cart (in the browser) use the same words.

export type PriceView =
  | {
      kind: "priced";
      sku: string;
      quantity: number;
      /** Unit price for this quantity. */
      finalPrice: number;
      basePrice: number;
      /** Per unit; 0 when the price isn't below the base price. */
      saving: number;
      savingPercent: number;
      /** The applied rule's name, or null without a rule (or an unnamed one). */
      ruleName: string | null;
      /** Why this price, in plain words. */
      reason: string;
      /** "Volume price from 50 units", when the rule needs a minimum quantity. */
      volumeNote: string | null;
      /** "Contract price until Dec 31, 2026", when the rule has an end date. */
      untilNote: string | null;
    }
  | { kind: "not_found"; sku: string; quantity: number };

export function explainItem(item: ResolvedItem): PriceView {
  if (item.match_reason === "PRODUCT_NOT_FOUND") {
    return { kind: "not_found", sku: item.sku, quantity: item.quantity };
  }
  const saving = Math.max(0, roundCents(item.base_price - item.final_price));
  const minimum = item.applied_rule?.constraints.minimum_quantity ?? null;
  const validTo = item.applied_rule?.constraints.valid_to ?? null;
  return {
    kind: "priced",
    sku: item.sku,
    quantity: item.quantity,
    finalPrice: item.final_price,
    basePrice: item.base_price,
    saving,
    savingPercent: item.base_price > 0 ? (saving / item.base_price) * 100 : 0,
    ruleName: item.applied_rule?.name ?? null,
    reason: matchReasonText(item),
    volumeNote: minimum && minimum > 1 ? `Volume price from ${minimum} units` : null,
    untilNote: validTo ? `Contract price until ${formatDay(validTo)}` : null,
  };
}

/**
 * match_reason in plain words. The nine rule tiers go from most specific
 * (this customer + this SKU) to least (everyone, every product); the first
 * tier with a rule that applies sets the price.
 */
export function matchReasonText(item: PricedItem): string {
  const customerGroup = groupName(item.applied_rule?.target.customer.code);
  const productGroup = groupName(item.applied_rule?.target.product.code)?.toLowerCase();

  switch (item.match_reason) {
    case "MOST_SPECIFIC_RULE":
      return "Your price for this product";
    case "CUSTOMER_GROUP_SKU_RULE":
      return `${customerGroup} price for this product`;
    case "SKU_LEVEL_RULE":
      return "Price for every customer";
    case "CUSTOMER_PRODUCT_GROUP_RULE":
      return `Your price on all ${productGroup}`;
    case "CUSTOMER_GROUP_PRODUCT_GROUP_RULE":
      return `${customerGroup} price on all ${productGroup}`;
    case "PRODUCT_GROUP_RULE":
      return `Price on all ${productGroup} for every customer`;
    case "CUSTOMER_LEVEL_RULE":
      return "Your price on every product";
    case "CUSTOMER_GROUP_RULE":
      return `${customerGroup} price on every product`;
    case "DEFAULT_RULE":
      return "Store-wide price";
    case "LOWEST_PRICE_WINS":
      return "The lowest of your prices";
    case "NO_RULE":
    case "RULE_EXCEEDS_BASE_PRICE":
      return "List price";
  }
}

/** A group code ("CONTRACTORS") as a name ("Contractors"). */
function groupName(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  return code
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}
