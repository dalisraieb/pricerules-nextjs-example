import { cn } from "@/lib/cn";

// A glyph per category, standing in for product photos.
const PATHS: Record<string, string> = {
  fasteners: "M8 3h8l2 3-2 3H8L6 6l2-3ZM10 9v10l2 2 2-2V9M10 12.5h4M10 16h4",
  "power-tools": "M3 9h11l2-2h3v6h-3l-2-2H10v3l-2 6H5l1-6V9",
  "hand-tools": "M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5L16 12l-4-4 2.5-2.5Z",
  safety: "M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Zm-3 9l2 2 4-4",
  abrasives: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  maintenance: "M9 3h6v3H9zM8 6h8l1 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l1-3Zm2 7h4",
  valves: "M3 10h5v4H3zM16 10h5v4h-5zM8 12h8M12 12V6M8.5 5h7",
};

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-accent-ink", className)} aria-hidden="true">
      <path
        d={PATHS[category] ?? PATHS.fasteners}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
