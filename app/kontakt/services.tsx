import type { ReactNode } from "react";

// Service choices on the contact form, plus the map from a /ydelser/<slug>
// page to the box that should already be ticked when they land here.

export type ServiceTile = { value: string; label: string; icon: ReactNode };
export type Audience = "privat" | "erhverv";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconRoof = () => (
  <svg {...iconProps}>
    <path d="M3 12 12 4l9 8" />
    <path d="M5 11v9h14v-9" />
    <path d="M9 20v-5h6v5" />
  </svg>
);

const IconExtension = () => (
  <svg {...iconProps}>
    <path d="M3 21V9l6-4 6 4v12" />
    <path d="M15 21v-7h6v7" />
    <path d="M3 21h18" />
  </svg>
);

const IconRenovate = () => (
  <svg {...iconProps}>
    <path d="m14.5 4 5.5 5.5-9 9L3 21l2.5-8L14.5 4Z" />
    <path d="m12.5 6 5.5 5.5" />
  </svg>
);

const IconDoor = () => (
  <svg {...iconProps}>
    <path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17" />
    <path d="M3 21h18" />
    <circle cx="15" cy="13" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const IconPlank = () => (
  <svg {...iconProps}>
    <rect x="3" y="7" width="18" height="10" rx="1.5" />
    <path d="M7 7v10" />
    <path d="M13 7v10" />
    <path d="M18 7v10" />
  </svg>
);

const IconSparkle = () => (
  <svg {...iconProps}>
    <path d="M12 4v4" />
    <path d="M12 16v4" />
    <path d="M4 12h4" />
    <path d="M16 12h4" />
    <path d="m6.3 6.3 2.8 2.8" />
    <path d="m14.9 14.9 2.8 2.8" />
  </svg>
);

const IconBuilding = () => (
  <svg {...iconProps}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M8 7h1.5" />
    <path d="M14.5 7H16" />
    <path d="M8 11h1.5" />
    <path d="M14.5 11H16" />
    <path d="M10 21v-4h4v4" />
  </svg>
);

const IconBlueprint = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M3 9h18" />
    <path d="M9 9v11" />
    <path d="M9 14h6" />
    <path d="M15 14v6" />
  </svg>
);

const IconHardhat = () => (
  <svg {...iconProps}>
    <path d="M4 17h16" />
    <path d="M5 17v-2a7 7 0 0 1 14 0v2" />
    <path d="M10 8V5h4v3" />
  </svg>
);

export const SERVICE_TILES_PRIVAT: ServiceTile[] = [
  { value: "Nyt tag", label: "Nyt tag", icon: <IconRoof /> },
  { value: "Tilbygning / udestue", label: "Tilbygning", icon: <IconExtension /> },
  { value: "Renovering", label: "Renovering", icon: <IconRenovate /> },
  { value: "Vinduer & døre", label: "Vinduer & døre", icon: <IconDoor /> },
  { value: "Træværk & gulve", label: "Træværk & gulve", icon: <IconPlank /> },
  { value: "Andet", label: "Noget andet", icon: <IconSparkle /> },
];

export const SERVICE_TILES_ERHVERV: ServiceTile[] = [
  { value: "Erhvervsbyggeri", label: "Erhvervsbyggeri", icon: <IconBuilding /> },
  { value: "Totalentreprise", label: "Totalentreprise", icon: <IconBlueprint /> },
  { value: "Tag- og facadeentreprise", label: "Tag & facade", icon: <IconRoof /> },
  { value: "Renovering / ombygning", label: "Renovering", icon: <IconRenovate /> },
  { value: "Vedligehold & service", label: "Vedligehold", icon: <IconHardhat /> },
  { value: "Andet", label: "Noget andet", icon: <IconSparkle /> },
];

/** /ydelser/<slug> → the chip we tick for them. */
const SLUG_TO_TILE: Record<string, { audience: Audience; value: string }> = {
  tagrenovering: { audience: "privat", value: "Nyt tag" },
  traeterrasse: { audience: "privat", value: "Træværk & gulve" },
  tilbygning: { audience: "privat", value: "Tilbygning / udestue" },
  renovering: { audience: "privat", value: "Renovering" },
  sommerhus: { audience: "privat", value: "Renovering" },
  "doere-og-vinduer": { audience: "privat", value: "Vinduer & døre" },
  gulve: { audience: "privat", value: "Træværk & gulve" },
  gipsvaeg: { audience: "privat", value: "Renovering" },
  totalentreprise: { audience: "erhverv", value: "Totalentreprise" },
  hovedentreprise: { audience: "erhverv", value: "Totalentreprise" },
  byggeraadgivning: { audience: "erhverv", value: "Andet" },
  fejlsoegning: { audience: "erhverv", value: "Andet" },
};

export function tileForSlug(slug: string): { audience: Audience; value: string } | null {
  return SLUG_TO_TILE[slug] ?? null;
}
