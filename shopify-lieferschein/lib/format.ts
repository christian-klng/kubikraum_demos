const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const number = new Intl.NumberFormat("de-DE");

const dateTime = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatEuro(cents: number): string {
  return euro.format(cents / 100);
}

export function formatNumber(value: number): string {
  return number.format(value);
}

export function formatDateTime(iso: string): string {
  return `${dateTime.format(new Date(iso))} Uhr`;
}
