import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { PriceError } from "@/lib/price-error";

type Tone = "warning" | "danger";

function Notice({
  tone,
  title,
  children,
  action,
}: {
  tone: Tone;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start",
        tone === "warning" ? "border-warning/30 bg-warning-soft" : "border-danger/30 bg-danger-soft",
      )}
    >
      <svg
        viewBox="0 0 20 20"
        className={cn("mt-0.5 size-5 shrink-0", tone === "warning" ? "text-warning" : "text-danger")}
        aria-hidden="true"
      >
        <path d="M10 2.5 18 17H2L10 2.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 8v4M10 14.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div className="flex-1 text-sm">
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-foreground/85">{children}</div>
      </div>
      {action}
    </div>
  );
}

/** The API's CUSTOMER_NOT_FOUND warning: priced as a guest, not an error. */
export function CustomerNotFoundNotice({ code }: { code: string }) {
  return (
    <Notice tone="warning" title={`We don't recognise the customer code ${code}`}>
      PriceRules has no customer with this code, so you&apos;re seeing list prices. In a real
      portal this usually means the account hasn&apos;t been set up in PriceRules yet.
    </Notice>
  );
}

/** A PriceRulesError (or a missing API key), with the request id for support. */
export function PriceErrorNotice({ error, action }: { error: PriceError; action?: ReactNode }) {
  if (error.kind === "setup") {
    return (
      <Notice tone="danger" title="Add your PriceRules API key">
        <p>
          Create a key on the{" "}
          <a href="https://pricerules.app/api" className="font-medium underline underline-offset-4">
            API page of your PriceRules dashboard
          </a>
          , put it in <code className="font-mono">.env.local</code> as{" "}
          <code className="font-mono">PRICERULES_API_KEY=…</code> and restart the dev server.
        </p>
      </Notice>
    );
  }

  return (
    <Notice tone="danger" title="Prices unavailable" action={action}>
      <p>{error.message}</p>
      <p className="mt-1 font-mono text-xs">
        {error.code}
        {error.requestId && <> · Reference {error.requestId}</>}
      </p>
    </Notice>
  );
}
