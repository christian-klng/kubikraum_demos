"use client";

import { useRouter } from "next/navigation";
import type { SortKey } from "@/lib/db";

const selectClass =
  "rounded-(--radius-control) border border-border-subtle bg-surface px-3 py-1.5 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-accent";

export function ListControls({
  categories,
  sortOptions,
  category,
  sort,
}: {
  categories: string[];
  sortOptions: { key: SortKey; label: string }[];
  category: string;
  sort: SortKey;
}) {
  const router = useRouter();

  function update(nextCategory: string, nextSort: string) {
    const params = new URLSearchParams();
    if (nextCategory) params.set("kategorie", nextCategory);
    if (nextSort !== "name") params.set("sortierung", nextSort);
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-muted">
        Kategorie
        <select
          value={category}
          onChange={(e) => update(e.target.value, sort)}
          className={selectClass}
        >
          <option value="">Alle</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        Sortierung
        <select
          value={sort}
          onChange={(e) => update(category, e.target.value)}
          className={selectClass}
        >
          {sortOptions.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
