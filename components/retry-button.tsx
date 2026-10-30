"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Renders the page again on the server, which asks PriceRules again. */
export function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      className="h-10 shrink-0 rounded-lg border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-muted disabled:opacity-60"
    >
      {pending ? "Trying…" : "Try again"}
    </button>
  );
}
