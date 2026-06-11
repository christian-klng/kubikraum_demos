export function ProductStatusPill({ status }: { status: "active" | "draft" }) {
  if (status === "active") {
    return (
      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        Aktiv
      </span>
    );
  }
  return (
    <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning">
      Entwurf
    </span>
  );
}

export function StockPill({
  stock,
  lowThreshold,
}: {
  stock: number;
  lowThreshold: number;
}) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-danger-soft px-2.5 py-0.5 text-xs font-medium text-danger">
        Ausverkauft
      </span>
    );
  }
  if (stock < lowThreshold) {
    return (
      <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning">
        Wenig Bestand
      </span>
    );
  }
  return (
    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
      Auf Lager
    </span>
  );
}
