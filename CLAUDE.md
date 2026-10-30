@AGENTS.md

# pricerules-nextjs-example

The official Next.js example for PriceRules: a small B2B store ("Ironbridge Supply", fictional) that shows customer-specific prices from the `pricerules` SDK. Public repo `dalisraieb/pricerules-nextjs-example`. It's read by developers evaluating PriceRules, so the code should stay small, idiomatic and easy to copy from.

Stack: Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` on, as create-next-app sets them), React 19, TypeScript strict, Tailwind v4 (through `@tailwindcss/turbopack`), `pricerules` (pinned). **Keep the dependencies minimal:** no UI kit, icon library, state library or fetch wrapper.

## Commands

```bash
npm run dev        # next dev
npm run typecheck  # next typegen && tsc --noEmit
npm run lint       # eslint
npm run build      # must pass with no PRICERULES_API_KEY (CI builds without one)
```

CI (`.github/workflows/ci.yml`) runs typecheck, lint and build on Node 22.

## Rules

- **The API key never reaches the browser.** Only `lib/pricerules.ts` imports the SDK, and it imports `server-only`. Pages price while rendering on the server; the cart goes through `POST /api/cart`. Never a `NEXT_PUBLIC_` key, never `dangerouslyAllowBrowser`.
- **Prices come only from PriceRules.** `lib/catalog.ts` holds names and categories, never prices. Base prices come from `base_price`.
- **One call per view:** the catalog prices the visible products in one `resolve()`, the product page all of its quantities, the cart all of its lines.
- **The customer comes from the cookie on the server** (`lib/customer-cookie.ts`), never from a request body. `/api/cart` ignores any customer the browser sends.
- **Never throw on a pricing failure:** `priceLines()` returns `{ ok: false, error }`, and pages show `PricingNotices` (a `PriceRulesError` with code + request id, a missing key, `CUSTOMER_NOT_FOUND`). `PRODUCT_NOT_FOUND` is "Price on request".
- **Cache Components:** anything that reads `cookies()` or `searchParams` sits inside `<Suspense>` with a skeleton shaped like the content. Prices are never `use cache`d (rules change).
- **Wording:** buyer-facing words for a resolved item live in `lib/explain.ts` (`match_reason` in plain words, the saving, "Volume price from N units", "Contract price until <date>"). Numbers and dates go through `lib/format.ts` (fixed `en-US`, dates in UTC so a `YYYY-MM-DD` never shifts).
- **Colours** are the tokens in `app/globals.css` (light and dark); no raw Tailwind palette colours.

## Sample data

The demo works out of the box with PriceRules' onboarding sample data (`price/server/onboarding/sample-dataset.ts` in the main repo): the SKUs in `lib/catalog.ts` and the accounts in `lib/customers.ts` are its real codes. `VLV-350` is deliberately **not** in the sample (nor in the homepage demo or docs): it shows `PRODUCT_NOT_FOUND`. Only `HARBOR-SUP`'s safety-glasses promotion has a `valid_to`. If the sample data changes, update the catalog, the accounts' notes, the README's walk-through and `VOLUME_QUANTITIES` in `app/products/[sku]/page.tsx`.

## Screenshots

`docs/screenshot.png` and `docs/cart.png` (README) are taken against the real PriceRules API with the sample data loaded (`PRICERULES_API_KEY` from `.env.local`, no `PRICERULES_BASE_URL`): 1440×1020, light theme, customer `ACME-BUILD`. The catalog is the top of `/`. The cart holds FAS-1001 × 49, TOL-2001 × 2 and VLV-302 × 4, then FAS-1001 is raised to 50 (the volume break) and the full page is captured. Make sure no older `next start` is still holding the port, or the shots come from that server.
