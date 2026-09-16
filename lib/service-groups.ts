import { SERVICES } from "@/lib/site";

// Four coarse buckets on top of the twelve SERVICES slugs. The chips are for
// the visitor ("hvad drejer det sig om, groft sagt"); the slug from the page
// they came from carries the detail. Deliberately not more than four.

export const SERVICE_GROUPS = ["Tag", "Hus", "Gulv", "Terrasse"] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

const SLUG_TO_GROUP: Record<string, ServiceGroup> = {
  tagrenovering: "Tag",
  traeterrasse: "Terrasse",
  gulve: "Gulv",
  tilbygning: "Hus",
  totalentreprise: "Hus",
  hovedentreprise: "Hus",
  renovering: "Hus",
  sommerhus: "Hus",
  "doere-og-vinduer": "Hus",
  gipsvaeg: "Hus",
  byggeraadgivning: "Hus",
  fejlsoegning: "Hus",
};

export function groupForSlug(slug: string | undefined): ServiceGroup | null {
  return slug ? (SLUG_TO_GROUP[slug] ?? null) : null;
}

/** The full service title behind a slug, for the mail to Finn. */
export function detailForSlug(slug: string | undefined): string {
  if (!slug) return "";
  return SERVICES.find((s) => s.slug === slug)?.title ?? "";
}

/** What lands in holstrup_leads.service: the group, plus the detail if we have one. */
export const CUSTOMER_TYPES = ["Privat", "Erhverv"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];

/** What Finn reads in the mail: "Privat · Tag · Tagrenovering", with whatever we know. */
export function composeService(group: ServiceGroup | null, detail: string, customerType?: CustomerType | null): string {
  return [customerType, group, detail].filter(Boolean).join(" · ");
}
