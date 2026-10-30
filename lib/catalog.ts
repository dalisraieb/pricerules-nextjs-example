// The store's own product data: names, categories, what it sells. In a real
// store this comes from your database or PIM. Prices don't live here: every
// price on the site comes from PriceRules, which knows each product's base
// price and every customer's deals.
//
// The SKUs match PriceRules' onboarding sample data, except VLV-350: a "new
// arrival" the sample workspace doesn't have, so you can see how the store
// handles a PRODUCT_NOT_FOUND item.

export type Category = {
  slug: string;
  name: string;
};

export type Product = {
  sku: string;
  name: string;
  category: string; // Category slug
  isNew?: boolean;
};

export const CATEGORIES: Category[] = [
  { slug: "fasteners", name: "Fasteners" },
  { slug: "power-tools", name: "Power Tools" },
  { slug: "hand-tools", name: "Hand Tools" },
  { slug: "safety", name: "Safety" },
  { slug: "abrasives", name: "Abrasives" },
  { slug: "maintenance", name: "Maintenance" },
  { slug: "valves", name: "Valves" },
];

export const PRODUCTS: Product[] = [
  { sku: "FAS-1001", name: "Hex Bolt M8 x 40 (box of 100)", category: "fasteners" },
  { sku: "FAS-1002", name: "Hex Nut M8 (box of 200)", category: "fasteners" },
  { sku: "FAS-1003", name: "Flat Washer M8 (box of 500)", category: "fasteners" },
  { sku: "FAS-1004", name: "Wood Screw 4 x 50 (box of 200)", category: "fasteners" },
  { sku: "FAS-1005", name: "Anchor Bolt M10 x 100 (box of 50)", category: "fasteners" },
  { sku: "TOL-2001", name: "Cordless Drill 18V", category: "power-tools" },
  { sku: "TOL-2002", name: "Angle Grinder 125mm", category: "power-tools" },
  { sku: "TOL-2003", name: "Impact Driver 18V", category: "power-tools" },
  { sku: "TOL-2004", name: "Circular Saw 190mm", category: "power-tools" },
  { sku: "TOL-2005", name: "Li-ion Battery 18V 5Ah", category: "power-tools" },
  { sku: "HND-3001", name: "Torque Wrench 1/2in 40-200Nm", category: "hand-tools" },
  { sku: "HND-3002", name: "Combination Spanner Set (12 pcs)", category: "hand-tools" },
  { sku: "HND-3003", name: "Screwdriver Set (8 pcs)", category: "hand-tools" },
  { sku: "HND-3004", name: "Claw Hammer 450g", category: "hand-tools" },
  { sku: "SAF-4001", name: "Safety Gloves Cut Level C (pair)", category: "safety" },
  { sku: "SAF-4002", name: "Safety Glasses Clear", category: "safety" },
  { sku: "SAF-4003", name: "Ear Defenders SNR 30dB", category: "safety" },
  { sku: "SAF-4004", name: "Hard Hat EN397 White", category: "safety" },
  { sku: "SAF-4005", name: "Hi-Vis Vest Class 2", category: "safety" },
  { sku: "ABR-5001", name: "Cutting Disc 125mm (pack of 25)", category: "abrasives" },
  { sku: "ABR-5002", name: "Flap Disc 125mm P60 (pack of 10)", category: "abrasives" },
  { sku: "ABR-5003", name: "Sanding Sheets P120 (pack of 50)", category: "abrasives" },
  { sku: "LUB-6001", name: "Multi-purpose Lubricant Spray 400ml", category: "maintenance" },
  { sku: "LUB-6002", name: "Industrial Degreaser 5L", category: "maintenance" },
  { sku: "VLV-301", name: "Brass Ball Valve 1/2in", category: "valves" },
  { sku: "VLV-302", name: "Stainless Ball Valve 3/4in", category: "valves" },
  { sku: "VLV-303", name: "Gate Valve DN50", category: "valves" },
  { sku: "VLV-350", name: "Butterfly Valve DN80", category: "valves", isNew: true },
];

/** The most of one product a cart line can hold (PriceRules accepts 1 to 10,000). */
export const MAX_QUANTITY = 10_000;

export function findProduct(sku: string): Product | undefined {
  return PRODUCTS.find((product) => product.sku === sku);
}

export function findCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function categoryName(slug: string): string {
  return findCategory(slug)?.name ?? slug;
}
