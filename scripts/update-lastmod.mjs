#!/usr/bin/env node
/**
 * Skriver lib/lastmod.ts ud fra git-historikken.
 *
 *   npm run lastmod              # skriv de nye datoer
 *   npm run lastmod -- --check   # vis kun hvad der ville ændre sig (exit 1)
 *
 * Datoerne committes med i repoet. Det er med vilje: Vercel kloner kun de
 * seneste commits, så `git blame` kan ikke køre under build. Og fordi de står
 * stille i filen, bliver de kun ændret når nogen faktisk retter indhold —
 * et deploy alene rykker ingenting. Et lastmod der altid er "i dag" er præcis
 * det signal Google lærer at ignorere.
 *
 * Kun sitespecifik konfiguration står i CONFIG nedenfor. Resten er identisk
 * på tværs af alle sites.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  dirtyFiles,
  discoverRoutes,
  contentFiles,
  entryDates,
  newest,
  newestCommitDate,
} from "./lastmod/resolve.mjs";

/* ------------------------------------------------------------------ *
 * Sitespecifik konfiguration
 * ------------------------------------------------------------------ */
const CONFIG = {
  appDir: "app",
  output: "lib/lastmod.ts",
  ignore: [/^\/admin/, /^\/api/],
  dataRoutes: [
    {
      // Ydelsessider: teksten bor pr. slug i service-content.ts.
      prefix: "/ydelser/",
      file: "lib/service-content.ts",
      declaration: "export const SERVICE_CONTENT",
    },
    {
      // Bysider: /tomrer-<slug>. Teksten genereres af buildCityContent ud fra
      // AREAS-entryen, så den delte generator tæller med for dem alle.
      prefix: "/tomrer-",
      file: "lib/site.ts",
      declaration: "export const AREAS",
      sharedSources: ["lib/city-content.ts", "app/[citySlug]/page.tsx"],
    },
  ],
  // Blogindlæg er én markdown-fil pr. side. De er udeladt af sitemap'et indtil
  // bloggen åbnes, men siderne er live, så deres schema skal sige sandheden.
  fileRoutes: [{ prefix: "/blog/", dir: "content/blog", extensions: [".md", ".mdx"] }],
  hubs: { "/ydelser": "/ydelser/", "/blog": "/blog/" },
};

/* ------------------------------------------------------------------ *
 * Fælles logik — identisk på tværs af sites
 * ------------------------------------------------------------------ */

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  cwd: path.dirname(fileURLToPath(import.meta.url)),
  encoding: "utf8",
}).trim();

function resolveAll() {
  const dirty = dirtyFiles(repoRoot);
  const routes = {};
  const warnings = [];

  // 1. Statiske sider — datoen kommer fra rutens egen mappe.
  //    Delte komponenter og lib/ tæller bevidst ikke med: retter du
  //    navigationen eller en farve, har undersiden ikke ændret indhold.
  for (const { route, files: ownFiles } of discoverRoutes(repoRoot, CONFIG.appDir, CONFIG.ignore)) {
    // Nogle sider har deres indhold i en datafil uden for mappen — fx en
    // lineup- eller prisliste. Den tæller med, for den ER sidens indhold.
    const files = [...ownFiles, ...(CONFIG.extraSources?.[route] ?? [])];
    const touched = files.filter((f) => dirty.has(f));
    if (touched.length > 0) {
      warnings.push(`${route} — ikke-committede ændringer i ${touched.join(", ")}`);
    }
    routes[route] = newestCommitDate(repoRoot, files);
  }

  // 2. Dynamiske ruter — dateres pr. entry i datafilen via git blame, så en
  //    rettelse i én tekst kun rykker den ene side.
  for (const source of CONFIG.dataRoutes ?? []) {
    const entries = entryDates(repoRoot, source.file, source.declaration);
    const floors = source.floorField ? floorDates(source.file, source.floorField) : new Map();
    // Nogle sider bygges af en delt generator eller skabelonfil. Ændrer den
    // sig, ændrer ALLE siderne i familien sig — så den dato tæller med.
    const sharedDate = source.sharedSources
      ? newestCommitDate(repoRoot, source.sharedSources)
      : null;
    for (const [slug, { date, uncommitted }] of entries) {
      routes[`${source.prefix}${slug}${source.suffix ?? ""}`] = newest(
        date,
        floors.get(slug),
        sharedDate
      );
      if (uncommitted) warnings.push(`${source.prefix}${slug} — ikke-committet ændring`);
    }
  }

  // 3. Indhold der ligger som filer (fx markdown) — én fil, én side, så
  //    git-datoen på filen ER sidens dato.
  for (const source of CONFIG.fileRoutes ?? []) {
    for (const file of contentFiles(repoRoot, source.dir, source.extensions)) {
      const slug = path.basename(file).replace(/\.[^.]+$/, "");
      if (dirty.has(file)) {
        warnings.push(`${source.prefix}${slug} — ikke-committet ændring`);
      }
      routes[`${source.prefix}${slug}`] = newestCommitDate(repoRoot, [file]);
    }
  }

  // 4. Hub-sider — det nyeste af egen mappe og deres nyeste barn. Listen
  //    ændrer sig faktisk når der kommer et barn til.
  for (const [route, childPrefix] of Object.entries(CONFIG.hubs ?? {})) {
    const children = Object.entries(routes)
      .filter(([r]) => r.startsWith(childPrefix))
      .map(([, d]) => d);
    routes[route] = newest(routes[route], ...children);
  }

  return { routes, warnings };
}

/** Et gulv under datoen, fx publishedAt — en side kan ikke være ændret før den fandtes. */
function floorDates(file, field) {
  const source = readFileSync(path.join(repoRoot, file), "utf8");
  const map = new Map();
  let slug = null;
  const fieldRe = new RegExp(`^\\s*${field}:\\s*"(\\d{4}-\\d{2}-\\d{2})`);
  for (const line of source.split("\n")) {
    const s = line.match(/^\s*slug:\s*"([^"]+)"/);
    if (s) slug = s[1];
    const p = line.match(fieldRe);
    if (p && slug) map.set(slug, p[1]);
  }
  return map;
}

function render(routes) {
  const body = Object.keys(routes)
    .sort()
    .map((route) => `  ${JSON.stringify(route)}: ${JSON.stringify(routes[route])},`)
    .join("\n");

  return `/**
 * GENERERET FIL — ret den ikke i hånden.
 *
 * Kør \`npm run lastmod\` når du har committet ændringer til en side, så
 * aflæses de rigtige datoer fra git-historikken.
 *
 * Datoerne står her frem for at blive beregnet under build, fordi Vercel kun
 * kloner de seneste commits — og fordi et deploy uden indholdsændringer ikke
 * skal rykke en eneste dato. Det er dét der gør signalet troværdigt.
 *
 * En rute uden dato her får slet ingen <lastmod> i sitemap'et. Ingen oplysning
 * er bedre end en forkert.
 */

export const LASTMOD: Record<string, string> = {
${body}
};
`;
}

function parseExisting(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*"([^"]+)":\s*"([^"]+)",$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const check = process.argv.includes("--check");
const { routes, warnings } = resolveAll();

const missing = Object.entries(routes).filter(([, d]) => !d);
if (missing.length > 0) {
  console.warn(`\n⚠  ${missing.length} rute(r) uden dato — de udelades af sitemap'et:`);
  for (const [route] of missing) console.warn(`   ${route}`);
}

if (warnings.length > 0) {
  console.warn("\n⚠  Ikke-committede ændringer — datoen står på seneste commit:");
  for (const w of warnings) console.warn(`   ${w}`);
  console.warn("   Commit indholdet først, og kør så kommandoen igen.\n");
}

const withDates = Object.fromEntries(Object.entries(routes).filter(([, d]) => d));
const next = render(withDates);
const outPath = path.join(repoRoot, CONFIG.output);
const current = (() => {
  try {
    return readFileSync(outPath, "utf8");
  } catch {
    return null;
  }
})();

if (current === next) {
  console.log(`✓ ${CONFIG.output} er allerede opdateret (${Object.keys(withDates).length} ruter).`);
  process.exit(0);
}

const before = current ? parseExisting(current) : {};
const changes = [];
for (const route of new Set([...Object.keys(before), ...Object.keys(withDates)])) {
  if (before[route] !== withDates[route]) {
    changes.push(`  ${route}: ${before[route] ?? "(ingen)"} → ${withDates[route] ?? "(ingen)"}`);
  }
}
console.log(`\n${changes.length} rute(r) ændrer dato:`);
console.log(changes.sort().join("\n"));

if (check) {
  console.log(`\n(--check: skrev ikke. Kør \`npm run lastmod\` for at opdatere ${CONFIG.output}.)`);
  process.exit(1);
}

writeFileSync(outPath, next);
console.log(`\n✓ Skrev ${CONFIG.output} (${Object.keys(withDates).length} ruter).`);
