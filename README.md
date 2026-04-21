# Holstrup TS — website

Website for **Holstrup Tømrer & Snedker Entreprise** — Finn Holm Pedersen, Frederikssund.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Markdown blog via `gray-matter` + `marked`
- Resend for contact form email
- Deployed on Vercel

## Local dev

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
```

## Environment variables

Set these in Vercel / `.env.local`:

```
RESEND_API_KEY=
CONTACT_FROM_EMAIL=kontakt@holstrup-ts.dk
CONTACT_TO_EMAIL=finn@holstrup-ts.dk
```

## Site structure

- `/` — forside
- `/om` — om Finn
- `/ydelser` — ydelsesoversigt (+ 12 underordnede ydelsessider under `/ydelser/[slug]`)
- `/omraader` — områdeoversigt
- `/tomrer-[by]` — 20 lokale landingssider (Frederikssund, Hillerød, …, Rungsted)
- `/projekter` — case-galleri
- `/blog` + `/blog/[slug]` — viden & guides
- `/kontakt` — kontaktformular

## SEO

- `sitemap.xml` auto-genereret (forside, ydelsessider, by-sider, blog posts)
- `robots.txt`
- JSON-LD: `LocalBusiness`, `Person`, `Service`, `FAQPage`, `Article`, `BreadcrumbList`
- Metadata per side + OpenGraph
- canonical URLs sat korrekt

## Tilføj nyt blogindlæg

Opret `.md`-fil i `content/blog/`:

```markdown
---
title: "Titel"
description: "Meta-beskrivelse"
date: "2026-04-20"
category: "Priser & guider"
image: "/images/service-tag.jpg"
---

Indhold i markdown…
```

Siden bygges automatisk ved næste deploy.

## Tilføj ny by eller ydelse

Rediger `lib/site.ts` — tilføj til `AREAS` eller `SERVICES`. For ydelser: tilføj også indhold til `lib/service-content.ts`.

## Billeder

Gem i `public/images/`. Brug real fotos af Finns egne projekter så vidt muligt. AI-genererede fotos kan bruges som fallback men skal udskiftes med ægte fotos når de er tilgængelige.

## Kontakt-info

- Ejer: Finn Holm Pedersen
- CVR: 16056839
- Telefon: +45 40 17 38 93
- E-mail: finn@holstrup-ts.dk
- Adresse: Sundbylillevej 48, 3600 Frederikssund
