import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, LOW_STOCK_THRESHOLD } from "@/lib/db";
import { formatDateTime, formatEuro, formatNumber } from "@/lib/format";
import { ProductStatusPill, StockPill } from "@/components/status-pill";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = getProduct(Number(id));
  if (!data) notFound();

  const { product, variants } = data;
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="text-sm font-medium text-accent hover:underline"
      >
        ← Zurück zum Bestand
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="card overflow-hidden">
            <div
              className="flex h-44 items-center justify-center text-7xl"
              style={{
                background: `linear-gradient(135deg, ${product.color_from}, ${product.color_to})`,
              }}
              aria-hidden
            >
              <span className="opacity-80">🧦</span>
            </div>
            <div className="flex flex-col gap-3 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {product.title}
                </h1>
                <ProductStatusPill status={product.status} />
              </div>
              <p className="text-sm text-muted">
                {product.category} · {product.vendor}
              </p>
              <p className="leading-relaxed">{product.description}</p>
              <p className="tnum mt-2 text-3xl font-semibold tracking-tight">
                {formatEuro(product.price_cents)}
              </p>
            </div>
          </section>

          <section className="card p-6" aria-label="Varianten">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                Varianten
              </h2>
              <span className="tnum text-sm text-muted">
                {formatNumber(totalStock)} Paar gesamt
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-muted">
                  <th className="pb-2 font-medium">Größe</th>
                  <th className="pb-2 font-medium">SKU</th>
                  <th className="pb-2 text-right font-medium">Bestand</th>
                  <th className="pb-2 pl-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-b border-border-subtle last:border-0"
                  >
                    <td className="py-3 font-medium">{variant.size}</td>
                    <td className="py-3 font-mono text-xs text-muted">
                      {variant.sku}
                    </td>
                    <td className="tnum py-3 text-right">
                      {formatNumber(variant.stock)}
                    </td>
                    <td className="py-3 pl-6">
                      <StockPill
                        stock={variant.stock}
                        lowThreshold={LOW_STOCK_THRESHOLD}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="card h-fit p-6" aria-label="Shopify">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">
            Shopify
          </h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-muted">Produkt-ID</dt>
              <dd className="mt-0.5 break-all font-mono text-xs">
                {product.shopify_gid}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Handle</dt>
              <dd className="mt-0.5 font-mono text-xs">{product.handle}</dd>
            </div>
            <div>
              <dt className="text-muted">Zuletzt synchronisiert</dt>
              <dd className="mt-0.5">{formatDateTime(product.synced_at)}</dd>
            </div>
          </dl>
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-(--radius-control) border border-border-subtle px-4 py-2 text-sm font-medium text-muted"
            title="In dieser Demo ohne Funktion"
          >
            In Shopify öffnen
          </button>
          <p className="mt-2 text-xs text-muted">
            Die Anbindung ist in dieser Demo simuliert — die Daten stammen aus
            einer lokalen Datenbank.
          </p>
        </aside>
      </div>
    </div>
  );
}
