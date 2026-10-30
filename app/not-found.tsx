import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted">We couldn&apos;t find that product or page.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground"
      >
        Back to the catalog
      </Link>
    </div>
  );
}
