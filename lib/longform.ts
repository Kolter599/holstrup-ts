import type { PriceRow } from "./priser";

/**
 * Langform-sider: de få, grundigt skrevne sider der skal kunne bære en
 * søgning helt alene — ikke én tynd side pr. by.
 *
 * Samme princip som service-content.ts: teksten bor i lib/, siden er tynd.
 * Forskellen er at de her sider skal kunne vise en pristabel og en liste
 * midt i brødteksten, så en sektion er en af tre typer i stedet for kun
 * overskrift + afsnit.
 */

export type Block =
  | { kind: "prose"; heading: string; body: string[] }
  | { kind: "list"; heading: string; intro?: string; items: string[]; outro?: string }
  | { kind: "prices"; heading: string; intro?: string; rows: PriceRow[]; note?: string }
  /**
   * Eksterne kilder — BR18, Bolius, SKAT, Arbejdstilsynet. Siden påstår regler
   * og tal; kilden ved siden af gør den efterprøvelig for både læser og Google.
   */
  | { kind: "sources"; heading: string; intro?: string; items: { href: string; label: string; note: string }[] };

export type Crumb = { name: string; href?: string };

export type LongformContent = {
  /** Rute uden domæne, fx "/velux-ovenlysvinduer". Bruges til canonical og til lead-formularens kilde. */
  path: string;
  eyebrow: string;
  h1: string;
  intro: string;
  hero: string;
  heroAlt: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: Crumb[];
  /** Sidespalten under formularen. */
  aside: { heading: string; items: string[] };
  blocks: Block[];
  faq: { q: string; a: string }[];
  /** Interne links videre. En side uden dem er en blindgyde. */
  related: { href: string; label: string; note: string }[];
  /** Service-schema for siden. */
  service: { name: string; description: string };
  /**
   * Hvilken ydelse lead-formularen skal starte på. Skal matche et slug i
   * SERVICES, ellers ignoreres den af formularen.
   */
  serviceSlug?: string;
};
