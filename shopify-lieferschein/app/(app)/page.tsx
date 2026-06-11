import Link from "next/link";
import { getStats, listProducts, LOW_STOCK_THRESHOLD } from "@/lib/db";
import { formatDateTime, formatEuro, formatNumber } from "@/lib/format";
import { ProductStatusPill } from "@/components/status-pill";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = getStats();
  const products = listProducts();
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

      <section aria-label="Produkte">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Produkte</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/produkte/${product.id}`}
                className="card group block overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div
                  className="flex h-28 items-center justify-center text-4xl"
                  style={{
                    background: `linear-gradient(135deg, ${product.color_from}, ${product.color_to})`,
                  }}
                  aria-hidden
                >
                  <span className="opacity-80 transition-transform duration-200 ease-out group-hover:scale-110">
                    🧦
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-snug">
                      {product.title}
                    </h3>
                    <ProductStatusPill status={product.status} />
                  </div>
                  <p className="text-sm text-muted">{product.category}</p>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="tnum font-semibold">
                      {formatEuro(product.price_cents)}
                    </span>
                    <span
                      className={`tnum text-sm ${
                        product.total_stock === 0
                          ? "text-danger"
                          : product.low_stock_variants > 0
                            ? "text-warning"
                            : "text-muted"
                      }`}
                    >
                      {product.total_stock === 0
                        ? "Ausverkauft"
                        : `${formatNumber(product.total_stock)} Paar · ${product.variant_count} Größen`}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
