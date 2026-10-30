// One number and date format for the whole store, independent of the
// visitor's locale, so the server and browser render the same text.

const count = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCount(value: number): string {
  return count.format(value);
}

export function formatPrice(value: number): string {
  return money.format(value);
}

export function formatPercent(value: number): string {
  return `${percent.format(value)}%`;
}

/**
 * A PriceRules day (YYYY-MM-DD, already in the workspace's time zone) as
 * "Dec 31, 2026". Formatted in UTC so no time zone shifts it a day.
 */
export function formatDay(value: string): string {
  return day.format(new Date(`${value}T00:00:00Z`));
}
