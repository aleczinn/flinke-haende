# Flinke Hände

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.x-000000?style=flat-square&logo=payloadcms)](https://payloadcms.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS_v4-Styled-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

Ein modernes Handwerker-Portal für den deutschsprachigen Markt — Kunden finden hier den passenden Fachbetrieb für Gewerke wie Elektro, Maler, Fliesen, Sanitär, Lüftung und mehr. Nutzer können sich über Leistungen informieren und direkt über die Plattform eine Auftragsanfrage stellen.

Das Projekt ist als flexibles, vollständig headless Template mit **Next.js 16** und **Payload CMS 3** umgesetzt — und lässt sich einfach für einen einzelnen Handwerksbetrieb oder ein Multi-Gewerke-Portal anpassen.

## Features

- 🌍 Mehrsprachigkeit mit Regionssupport (z. B. de-DE, de-CH, de-AT)
- ⚡ Optimiert für Core Web Vitals
-📋 Formulare für Auftragsanfragen von Kunden
- 🛠️ Vollständig über das Payload CMS-Admin-Panel verwaltbar
- 🔒 Vollständige Typsicherheit durch TypeScript & automatisch generierte Typen via Payload CMS
- 🔍 Vollständiger SEO-Support mit konfigurierbaren Meta-Feldern (Titel, Beschreibung, OG-Image)
- 🗺️ Strukturierte Daten (JSON-LD): Unternehmensschema mit Öffnungszeiten & Geo-Koordinaten, Breadcrumbs, lokale Geschäftsinformationen
- 🧩 Flexible Seitenkomponenten: Hero, Media with Text, Accordion, Banner, Before/After-Vergleich u. v. m.

## Tech Stack

| Bereich     | Technologie                                    |
|-------------|------------------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)             |
| CMS         | Payload CMS 3.x                                |
| Datenbank   | SQLite (Entwicklung) / Neon PostgreSQL (Prod)  |
| Styling     | Tailwind CSS v4                                |
| Sprache     | TypeScript                                     |
| Deployment  | Vercel + Neon                                  |


## Development

### Prerequisites

- Node.js 25
- pnpm 10

### Installation

```bash
pnpm install
```

### Environment

`.env.example` nach `.env` kopieren und die Werte eintragen:

```bash
cp .env.example .env
```

```env
DATABASE_URL=file:./db.sqlite               # SQLite für lokale Entwicklung
PAYLOAD_SECRET=your-secret-here             # Zufällig generierter String, welchen Payload intern zum signieren von JWT's nutzt
PREVIEW_SECRET=your-secret-here             # Zufällig generierter String, welcher für die Live-Ansicht genutzt wird

NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Deine Base-URL der Website. Bei einer Custom-Domain nutze bitte die korrekte URL
NEXT_PUBLIC_SITE_SHORTCUT=your-site-shorcut # Wird für cookies benutzt. Beispiel: FH 
NEXT_PUBLIC_SCHEMA_TYPE=your-schema         # Optionaler Schema-Typ, welcher Google hilft die Seite vom Schema zu definieren
```

Um secrets zu generieren nutze z. B. folgendes:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

### Usage

```bash
pnpm dev   # Start dev server with Turbopack
```

| URL                          | Beschreibung      |
|------------------------------|-------------------|
| `http://localhost:3000`      | Frontend/Website  |
| `http://localhost:3000/admin`| Payload CMS Admin |

## Production

### Build

```bash
pnpm build
```

### Deploy to Vercel

Das Projekt ist für das Deployment auf **Vercel** mit einer **Neon PostgreSQL**-Datenbank ausgelegt.

1. Projekt auf [Vercel](https://vercel.com) anlegen und Repository verbinden
2. Datenbank auf [Neon](https://neon.tech) oder direkt in Vercel erstellen und Connection String kopieren
3. Umgebungsvariablen setzen
4. Deployment — Vercel führt bei jedem Push automatisch `pnpm build` aus.

## License

Dieses Repository ist ausschließlich zur Ansicht veröffentlicht.
Eine Nutzung, Vervielfältigung oder Weiterverwendung des Codes
ist ohne ausdrückliche Genehmigung nicht gestattet.
