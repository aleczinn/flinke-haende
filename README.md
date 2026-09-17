# Flinke Hände

Wiederverwendbares Website-Template für lokale Handwerksbetriebe. Das Projekt kombiniert Next.js 16, Payload CMS 3, TypeScript und Tailwind CSS.

## Enthalten

- mehrsprachige Seiten und Navigation
- Payload-Adminbereich mit Rollen, Entwürfen und Live Preview
- Hero-, Medien/Text- und Accordion-Blöcke
- lokale Bilder und Videos, Bildvergleiche sowie zustimmungspflichtige YouTube-/Vimeo-Einbettungen
- SEO-Metadaten, Canonicals, OG-Bilder, Sitemap, robots.txt und LocalBusiness-JSON-LD
- zentral generierte Browser-, Apple- und Manifest-Icons
- optionale, vor Einwilligung vollständig blockierte Google-Analytics-Integration
- SQLite für lokale Entwicklung sowie optional PostgreSQL und Vercel Blob für Produktion

Ein Kontakt- oder Auftragsformular ist bewusst noch nicht Bestandteil des Templates. Mailversand, Spam-Schutz, Dateiuploads und Aufbewahrungsfristen sollen dafür separat geplant werden.

## Lokale Entwicklung

Voraussetzungen: Node.js 22 oder neuer und pnpm 10.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Wichtige lokale Variablen:

```env
DATABASE_ADAPTER=sqlite
DATABASE_URL=file:./database.db
PAYLOAD_SECRET=<zufälliger geheimer Wert>
PREVIEW_SECRET=<zufälliger geheimer Wert>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_SHORTCUT=FH
NEXT_PUBLIC_SCHEMA_TYPE=LocalBusiness
```

Secrets können beispielsweise so erzeugt werden:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Frontend: `http://localhost:3000`
Payload: `http://localhost:3000/admin`

## Branding und Icons

Die zentrale Konfiguration liegt in `src/brand/brand.json`. Das quadratische Master-Icon liegt in `src/app/icon.svg`; Header- und Footer-Logo werden zentral über `src/brand/BrandLogo.tsx` ausgewählt. Das Standard-OG-Bild liegt in `public/og-default.jpg` und kann im CMS überschrieben werden.

Nach einem Austausch des Master-Icons erzeugt dieser Befehl alle technischen Varianten:

```bash
pnpm brand:generate
```

Erstellt werden ein Mehrgrößen-Favicon, das Apple-Touch-Icon sowie normale und maskierbare Manifest-Icons in 192 und 512 Pixeln. Der Produktions-Build führt die Generierung automatisch aus.

## Datenschutz und externe Dienste

- Ohne konfigurierte Statistik erscheint kein globales Banner.
- YouTube und Vimeo zeigen zunächst einen lokalen Platzhalter. Vor Zustimmung werden weder Iframes noch externe Vorschaubilder angefordert.
- Die Auswahl wird für 180 Tage in einem notwendigen First-Party-Cookie gespeichert und kann im Footer geändert werden.
- Ein normaler externer Link zu Google Maps oder zum Google-Unternehmensprofil lädt auf der Website noch keinen Google-Inhalt. Eingebettete Maps oder Review-Widgets müssen über den vorhandenen `ConsentGate` geschützt werden.
- Rechtstexte bleiben kundenspezifisch und müssen die tatsächlich aktivierten Anbieter, Zwecke, Rechtsgrundlagen und Speicherdauern beschreiben.

Google Analytics ist standardmäßig deaktiviert. Erst eine gesetzte Mess-ID aktiviert die Statistik-Auswahl:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Das Google-Script wird erst nach Statistik-Einwilligung geladen. Search Console benötigt kein Besucher-Tracking: Domain per DNS bestätigen und anschließend `/sitemap.xml` einreichen.

## Deployment auf Vercel

Für eine neue leere Produktionsinstanz kann PostgreSQL, beispielsweise Neon, verwendet werden:

```env
DATABASE_ADAPTER=postgres
DATABASE_URL=<postgres-connection-url>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

`DATABASE_ADAPTER` wählt den Payload-Treiber; nur die URL zu ändern reicht nicht aus. Auch eine leere PostgreSQL-Datenbank benötigt einmalig das Payload-Schema. Vor dem ersten Deployment mit der Produktionskonfiguration eine initiale Migration erzeugen und einchecken:

```bash
pnpm payload migrate:create initial-schema
```

Für Deployments werden ausstehende Migrationen vor dem Build ausgeführt:

```bash
pnpm payload migrate && pnpm build
```

Lokale Inhalte aus SQLite werden dabei nicht übertragen. Vercel Blob ist notwendig, weil Uploads im Laufzeit-Dateisystem von Vercel nicht dauerhaft gespeichert werden.

## Qualitätssicherung

```bash
pnpm lint
pnpm test:int
pnpm test:e2e
pnpm build
```

Vor Übergabe an einen Kunden außerdem prüfen:

- Unternehmens-, Kontakt- und Öffnungszeiten im CMS
- Impressum und Datenschutzerklärung
- Domain, Canonicals, Sitemap und Search Console
- Logo, Icon, Theme-Farben und OG-Fallback
- tatsächlich verwendete Drittanbieter und Consent-Texte
- Tastaturbedienung, Mobilansicht und zentrale Kontaktwege

## Lizenz

Dieses Repository ist ausschließlich zur Ansicht veröffentlicht. Nutzung, Vervielfältigung oder Weiterverwendung sind ohne ausdrückliche Genehmigung nicht gestattet.
