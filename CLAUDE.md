# kubikraum_demos

Sammlung eigenständiger Business-Web-Apps. Jede App lebt in einem eigenen Unterordner und wird als eigenständige Resource über Coolify deployt.

## Repo-Struktur

- **Ein Unterordner = eine App = ein Coolify-Deployment.** In Coolify wird pro App eine Resource mit dem Unterordner als Base Directory angelegt.
- **Apps sind vollständig unabhängig.** Kein geteilter Code, keine Shared Packages, kein Workspace-Setup. Gemeinsames (Design-Tokens, Dockerfile-Vorlage) wird per Template kopiert, nicht importiert. Das hält Deployments isoliert und Apps einzeln löschbar/austauschbar.
- Jeder App-Ordner enthält mindestens:
  - `Dockerfile` (Multi-Stage-Build, eigenständig lauffähig via `docker build`)
  - `README.md` (Zweck der App, lokale Entwicklung, benötigte Env-Variablen)
  - `.env.example` (alle Env-Variablen mit Platzhaltern, niemals echte Secrets)

## Deployment-Konventionen (Coolify)

- Build über Dockerfile (nicht Nixpacks) — deterministisch und pro App kontrollierbar.
- App lauscht auf `0.0.0.0` und liest den Port aus `process.env.PORT` (Default `3000`).
- Healthcheck-Endpoint unter `GET /api/health` → `200 OK` (von Coolify für Health Checks genutzt).
- Konfiguration ausschließlich über Env-Variablen, keine Config-Dateien mit Secrets im Repo.
- Keine lokale Persistenz im Container (kein SQLite im Image, keine Uploads ins Dateisystem) — State liegt in externen Diensten oder Coolify-Volumes, damit Container jederzeit neu gebaut werden können.

## Stack-Defaults

Abweichungen sind erlaubt, wenn die App es erfordert — dann im README der App begründen.

- **Sprache:** TypeScript, strict mode.
- **Framework:** Next.js (App Router, `output: "standalone"` für schlanke Docker-Images).
- **Styling:** Tailwind CSS v4. Design-Tokens als CSS Custom Properties (siehe unten).
- **Node:** aktuelle LTS-Version, im Dockerfile gepinnt.
- **Package Manager:** pnpm.

## Designsprache: Apple HIG / Liquid Glass

Alle Apps orientieren sich an Apples aktueller Designsprache (Human Interface Guidelines, Liquid Glass / iOS 26), übersetzt für Business-Web-Apps:

### Grundprinzipien

- **Klarheit vor Effekt.** Inhalt (Daten, Tabellen, Formulare) liegt immer auf soliden, ruhigen Flächen. Glas-/Blur-Effekte sind dem „Chrome" vorbehalten: Navigationsleisten, Toolbars, Sidebars, Modals, Popovers.
- **Hierarchie durch Tiefe und Weißraum,** nicht durch Linien und Rahmen. Großzügiges Spacing, wenige Border.
- **Zurückhaltende Farbe.** Neutrale Graustufen als Basis, **ein** Akzentton pro App (für Primäraktionen, Links, Fokus). Semantische Farben (Erfolg/Warnung/Fehler) systemweit einheitlich.

### Konkrete Regeln

- **Typografie:** System-Font-Stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) — liefert SF Pro auf Apple-Geräten. Klare Größenhierarchie analog Apple-Textstilen (Large Title, Title, Headline, Body, Footnote). Tabellarische Ziffern (`font-variant-numeric: tabular-nums`) für Zahlen/Tabellen.
- **Liquid Glass:** `backdrop-filter: blur()` + halbtransparente Hintergründe für Nav/Toolbars/Overlays. Immer mit solidem Fallback (`@supports`). Niemals Text auf Glas ohne ausreichenden Kontrast.
- **Radii:** durchgehend große, weiche Rundungen; verschachtelte Elemente mit konzentrischen Radien (innerer Radius = äußerer Radius − Padding).
- **Dark Mode:** von Anfang an, über `prefers-color-scheme` + Token-Ebene. Kein nachträgliches Anflanschen.
- **Motion:** kurze, physikalisch wirkende Übergänge (ease-out, 150–300 ms). `prefers-reduced-motion` wird respektiert.
- **Accessibility:** WCAG AA als Minimum (Kontrast 4.5:1 für Text), sichtbare Fokus-Ringe, vollständige Tastaturbedienung.

### Design-Tokens

Jede App definiert ihre Tokens als CSS Custom Properties in einer zentralen Datei (z. B. `app/globals.css`): Farben (inkl. Dark-Mode-Varianten), Radii, Spacing-Skala, Blur-Stufen, Schatten. Die Token-Namen sind über alle Apps gleich, nur die Werte (v. a. der Akzentton) dürfen variieren.

## Architektur-Entscheidungen (Log)

Neue Grundsatzentscheidungen hier mit Datum ergänzen.

- **2026-06-11:** Initiale Festlegung von Struktur, Coolify-Konventionen, Stack-Defaults und Designsprache (Apple HIG / Liquid Glass).
