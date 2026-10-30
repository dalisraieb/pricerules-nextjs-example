import type { PriceView } from "@/lib/explain";
import { formatPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * A product's price for the selected customer: the final price, the base
 * price struck through with the saving, the rule that set it and why.
 */
export function PriceTag({ view, size = "md" }: { view: PriceView; size?: "md" | "lg" }) {
  if (view.kind === "not_found") {
    return (
      <div>
        <p className={cn("font-semibold", size === "lg" ? "text-2xl" : "text-lg")}>Price on request</p>
        <p className="mt-1 text-sm text-muted">Not in our price list yet</p>
      </div>
    );
  }

  const discounted = view.saving > 0;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span
          className={cn(
            "tabular font-semibold tracking-tight",
            size === "lg" ? "text-3xl" : "text-2xl",
            discounted && "text-accent-ink",
          )}
        >
          {formatPrice(view.finalPrice)}
        </span>
        {discounted && (
          <>
            <s className="tabular text-sm text-muted">
              <span className="sr-only">List price </span>
              {formatPrice(view.basePrice)}
            </s>
            <span className="tabular rounded-md bg-saving-soft px-1.5 py-0.5 text-xs font-semibold text-saving">
              Save {formatPrice(view.saving)} (−{formatPercent(view.savingPercent)})
            </span>
          </>
        )}
      </div>

      {view.ruleName && (
        <p className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent-ink">
          <TagIcon />
          <span className="truncate" title={view.ruleName}>{view.ruleName}</span>
        </p>
      )}

      <ul className="space-y-0.5 text-sm text-muted">
        <li>{view.reason}</li>
        {view.volumeNote && <li>{view.volumeNote}</li>}
        {view.untilNote && <li className="font-medium text-warning">{view.untilNote}</li>}
      </ul>
    </div>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden="true">
      <path
        d="M2 8.6V3a1 1 0 0 1 1-1h5.6a1 1 0 0 1 .7.3l4.4 4.4a1 1 0 0 1 0 1.4l-5.6 5.6a1 1 0 0 1-1.4 0L2.3 9.3a1 1 0 0 1-.3-.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="5.5" cy="5.5" r="1.1" fill="currentColor" />
    </svg>
  );
}
