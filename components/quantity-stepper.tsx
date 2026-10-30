"use client";

import { useState } from "react";
import { MAX_QUANTITY } from "@/lib/catalog";

/** − [ 12 ] +. Typing commits on blur or Enter; empty or invalid snaps back. */
export function QuantityStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (quantity: number) => void;
  label: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  function commit(text: string) {
    setDraft(null);
    const quantity = Number(text);
    if (Number.isInteger(quantity) && quantity >= 1) onChange(Math.min(quantity, MAX_QUANTITY));
  }

  const button =
    "grid size-11 place-items-center text-lg text-muted hover:bg-surface-muted hover:text-foreground disabled:opacity-40 sm:size-10";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-line bg-surface">
      <button
        type="button"
        className={button}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <input
        inputMode="numeric"
        value={draft ?? String(value)}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit(event.currentTarget.value);
        }}
        aria-label={label}
        className="tabular h-11 w-14 border-x border-line bg-transparent text-center text-sm font-medium outline-none focus-visible:bg-accent-soft sm:h-10"
      />
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}
