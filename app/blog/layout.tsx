import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

// Blog midlertidigt skjult fra public site. noindex/nofollow på hele /blog/*
// så Google deindekserer eksisterende indlæg. Når blog tages i brug igen,
// slet denne fil og opdater nav/sitemap.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
