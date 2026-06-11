import Link from "next/link";
import {
  getStats,
  isSortKey,
  listCategories,
  listProducts,
  LOW_STOCK_THRESHOLD,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/db";
import { formatDateTime, formatEuro, formatNumber } from "@/lib/format";
import { ProductStatusPill } from "@/components/status-pill";
import { ListControls } from "@/components/list-controls";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; sortierung?: string }>;
}) {
  const params = await searchParams;
  const categories = listCategories();
  const category = categories.includes(params.kategorie ?? "")
    ? (params.kategorie as string)
    : "";
  const sort: SortKey =
    params.sortierung && isSortKey(params.sortierung)
      ? params.sortierung
      : "name";

  const stats = getStats();
  const products = listProducts({ category: category || undefined, sort });
  const syncedAt = products[0]?.synced_at;

  const statCards = [
    { label: "Produkte", value: formatNumber(stats.product_count) },
    { label: "Lagerbestand", value: `${formatNumber(stats.total_stock)} Paar` },
    { label: "Lagerwert", value: formatEuro(stats.inventory_value_cents) },
    {
      label: "Wenig Bestand",
      value: formatNumber(stats.low_stock_variants),
      hint: `Varianten unter ${LOW_STOCK_THRESHOLD} Stück`,
      warn: stats.low_stock_variants > 0,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Warenbestand
          </h1>
          <p className="mt-1 text-muted">
            Demo-Inventar des Socken-Händlers Sockenwerk GmbH
          </p>
        </div>
        {syncedAt && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span
              className="inline-block size-2 rounded-full bg-success"
              aria-hidden
            />
            Shopify-Sync simuliert · zuletzt {formatDateTime(syncedAt)}
          </p>
        )}
      </div>

      <section
        aria-label="Statistiken"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-sm text-muted">{card.label}</p>
            <p
              className={`tnum mt-1 text-2xl font-semibold tracking-tight ${
                card.warn ? "text-warning" : ""
              }`}
            >
              {card.value}
            </p>
            {card.hint && (
              <p className="mt-1 text-xs text-muted">{card.hint}</p>
            )}
          </div>
        ))}
      </section>

      <section aria-label="Produkte" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Produkte
            <span className="tnum ml-2 text-base font-normal text-muted">
              {category
                ? `${formatNumber(products.length)} von ${formatNumber(stats.product_count)}`
                : formatNumber(products.length)}
            </span>
          </h2>
          <ListControls
            categories={categories}
            sortOptions={SORT_OPTIONS}
            category={category}
            sort={sort}
          />
        </div>

        {products.length === 0 ? (
          <div className="card p-8 text-center text-muted">
            Keine Produkte in dieser Kategorie.
          </div>
        ) : (
          <ul className="card divide-y divide-border-subtle overflow-hidden">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/produkte/${product.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent-soft focus-visible:bg-accent-soft focus-visible:outline-none"
                >
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-(--radius-control) text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${product.color_from}, ${product.color_to})`,
                    }}
                    aria-hidden
                  >
                    <span className="opacity-80">🧦</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {product.title}
                    </span>
                    <span className="block text-sm text-muted">
                      {product.category}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <ProductStatusPill status={product.status} />
                  </span>
                  <span
                    className={`tnum hidden w-32 text-right text-sm md:block ${
                      product.total_stock === 0
                        ? "text-danger"
                        : product.low_stock_variants > 0
                          ? "text-warning"
                          : "text-muted"
                    }`}
                  >
                    {product.total_stock === 0
                      ? "Ausverkauft"
                      : `${formatNumber(product.total_stock)} Paar`}
                  </span>
                  <span className="tnum w-20 text-right font-semibold">
                    {formatEuro(product.price_cents)}
                  </span>
                  <span className="text-muted" aria-hidden>
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
