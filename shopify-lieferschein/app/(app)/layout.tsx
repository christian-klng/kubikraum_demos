import Link from "next/link";
import { logout } from "@/app/login/actions";
import { DEMO_USER } from "@/lib/auth";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="glass sticky top-0 z-10 border-b border-border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden>
              🧦
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight tracking-tight">
                Sockenwerk
              </span>
              <span className="block text-xs leading-tight text-muted">
                Bestandsverwaltung
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
              Shopify · Demo-Modus
            </span>
            <span className="hidden text-sm text-muted sm:block">
              {DEMO_USER}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-(--radius-control) border border-border-subtle px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent-soft"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-6xl px-6 pb-6 text-xs text-muted">
        Demo-Anwendung — die Shopify-Anbindung ist simuliert, alle Daten stammen
        aus einer lokalen Datenbank.
      </footer>
    </>
  );
}
