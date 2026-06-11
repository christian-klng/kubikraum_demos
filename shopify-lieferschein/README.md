# shopify-lieferschein

Demo-App: Bestandsverwaltung eines Socken-Händlers („Sockenwerk GmbH") mit simulierter Shopify-Anbindung. Zeigt ein Inventar mit Statistiken (Lagerbestand, Lagerwert, Niedrigbestand) und Produktdetailseiten mit Varianten und Shopify-Metadaten.

**Demo-Grenzen:** Es besteht keine echte Shopify-Anbindung. Alle Produktdaten liegen in einer lokalen SQLite-Datenbank, die beim ersten Start automatisch angelegt und mit Demo-Daten befüllt wird. Der „In Shopify öffnen"-Button ist bewusst ohne Funktion.

## Demo-Zugang

- Benutzername: `Test`
- Passwort: `Test`

## Lokale Entwicklung

```bash
pnpm install
pnpm dev
```

App läuft auf http://localhost:3000. Die SQLite-DB wird unter `./data/demo.db` angelegt; löschen setzt die Demo-Daten zurück.

## Env-Variablen

Siehe `.env.example`. Alle Variablen sind optional (sinnvolle Defaults für die Demo), für produktive Deployments sollte `AUTH_SECRET` gesetzt werden.

## Deployment (Coolify)

- Build über das `Dockerfile` in diesem Ordner, Base Directory: `shopify-lieferschein`.
- Healthcheck: `GET /api/health` → `200`.
- Container ist zustandslos: Die Demo-DB wird beim Start neu erzeugt. Optional kann `/app/data` als Volume gemountet werden, ist aber nicht erforderlich.

## Stack

Next.js 16 (App Router, standalone output) · TypeScript · Tailwind CSS v4 · better-sqlite3. Designsprache gemäß `../CLAUDE.md` (Apple HIG / Liquid Glass).
