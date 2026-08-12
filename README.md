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

## Sitemap-datoer

`<lastmod>` kommer fra `lib/lastmod.ts`, som er **genereret og committet** ud fra
git-historikken — ikke beregnet under build.

Det sker **automatisk**: en GitHub Action kører ved hvert push til main, aflæser
historikken og committer datoerne tilbage — men kun hvis de faktisk har flyttet sig.
Du skal ikke huske noget.

```bash
npm run lastmod            # kan køres i hånden, hvis du vil se resultatet med det samme
npm run lastmod -- --check # se kun hvad der ville ændre sig
```

| Sidetype | Hvad datoen aflæses fra |
|---|---|
| Statiske sider | Filerne i sidens egen mappe under `app/` |
| Ydelsessider | Den enkelte entry i `lib/service-content.ts` (`git blame` pr. linjeinterval) |
| Bysider | AREAS-entryen i `lib/site.ts` **og** den delte `lib/city-content.ts` |

Bysiderne deler dato med vilje: deres tekst genereres af `buildCityContent()`, så
ændres generatoren, ændrer alle 20 sider sig faktisk. Ydelsessider dateres derimod
hver for sig — retter du tagrenovering, rykker kun tagrenovering.

Delte komponenter og `layout.tsx` tæller ikke med: retter du navigationen eller en
farve, har siden ikke ændret indhold. Bevidst ikke `new Date()` — et `lastmod` der
altid er "i dag" er præcis det signal Google lærer at ignorere.
