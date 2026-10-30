"use client";

import { useId, useState, useTransition } from "react";
import { setCustomer } from "@/app/actions";
import { ACCOUNTS, findAccount, MAX_CODE_LENGTH } from "@/lib/customers";

const GUEST = "";
const OTHER = "__other__";

/**
 * Picks the customer the store prices for. A sample account, a guest (no
 * customer: list prices) or any code, e.g. one PriceRules doesn't know, to
 * see CUSTOMER_NOT_FOUND.
 */
export function CustomerSwitcher({ current }: { current: string | null }) {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const customCode = current && !findAccount(current) ? current : null;

  function apply(code: string | null) {
    setEditing(false);
    startTransition(() => setCustomer(code));
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <label htmlFor={id} className="shrink-0 text-sm text-muted">
          Pricing for
        </label>
        <div className="relative min-w-0 flex-1 sm:w-80 sm:flex-none">
          <select
            id={id}
            value={editing ? OTHER : (current ?? GUEST)}
            disabled={pending}
            onChange={(event) => {
              const value = event.target.value;
              if (value === OTHER) {
                setDraft(customCode ?? "");
                setEditing(true);
              } else {
                apply(value === GUEST ? null : value);
              }
            }}
            className="h-11 w-full appearance-none rounded-lg border border-line bg-surface py-0 pr-9 pl-3 text-sm font-medium shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
          >
            {ACCOUNTS.map((account) => (
              <option key={account.code} value={account.code}>
                {account.code} · {account.name}
              </option>
            ))}
            {customCode && <option value={customCode}>{customCode}</option>}
            <option value={GUEST}>Guest · list prices</option>
            <option value={OTHER}>Another customer code…</option>
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          >
            <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {editing && (
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            apply(draft);
          }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MAX_CODE_LENGTH}
            placeholder="e.g. NEW-CO"
            aria-label="Customer code"
            className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-40"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="h-11 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-11 rounded-lg px-3 text-sm text-muted hover:text-foreground"
          >
            Cancel
          </button>
        </form>
      )}

      <span className="sr-only" aria-live="polite">
        {pending ? "Updating prices" : ""}
      </span>
    </div>
  );
}
