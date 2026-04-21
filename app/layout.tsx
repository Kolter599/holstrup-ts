import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Nav } from "./_components/Nav";
import { MobileBottomBar } from "./_components/MobileBottomBar";
import { Analytics } from "./_components/Analytics";
import { LocalBusinessJsonLd, PersonJsonLd } from "./_components/JsonLd";
import { CityMarquee } from "./_components/CityMarquee";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interDisplay = Inter({
  variable: "--font-inter-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Holstrup TS — Tømrer, snedker og byggerådgiver i Nordsjælland",
    template: "%s · Holstrup TS",
  },
  description:
    "Tømrer- og snedkerfirma i Frederikssund med 30+ års erfaring. Tag, tilbygning, renovering og hovedentrepriser i Nordsjælland. Ring til Finn på 40 17 38 93.",
  applicationName: SITE.name,
  authors: [{ name: SITE.owner }],
  generator: "Next.js",
  keywords: [
    "tømrer Nordsjælland",
    "tømrer Frederikssund",
    "tømrer Hillerød",
    "totalentreprise Nordsjælland",
    "hovedentreprise privat",
    "tagrenovering Frederikssund",
    "byggerådgivning",
    "sommerhus tømrer Nordsjælland",
    "tømrer Allerød",
    "tømrer Birkerød",
    "Holstrup TS",
  ],
  category: "Construction",
  formatDetection: { email: true, address: true, telephone: true },
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: SITE.url,
    siteName: SITE.name,
    title: "Holstrup TS — Tømrer & byggerådgiver i Nordsjælland",
    description:
      "30+ års erfaring med tømrer- og entrepriseopgaver. Frederikssund, Hillerød og resten af Nordsjælland.",
    images: [
      {
        url: "/images/service-tag.jpg",
        width: 1200,
        height: 800,
        alt: "Holstrup TS — tagrenovering i Nordsjælland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Holstrup TS — Tømrer & byggerådgiver i Nordsjælland",
    description: "30+ års erfaring med tømrer- og entrepriseopgaver. Frederikssund, Hillerød og resten af Nordsjælland.",
    images: ["/images/service-tag.jpg"],
  },
  alternates: { canonical: SITE.url },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  appleWebApp: {
    title: SITE.name,
    capable: true,
    statusBarStyle: "default",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1347a6" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

function Footer() {
  return (
    <footer className="band-dark">
      <CityMarquee variant="dark" />
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image
            src="/images/holstrup-logo.png"
            alt="Holstrup TS"
            width={320}
            height={64}
            className="mb-6 bg-white/95 rounded-sm p-2 w-auto h-12"
          />
          <p className="text-white/70 max-w-sm leading-relaxed text-lg">
            Tømrerfirma i Frederikssund. 30+ års erfaring med renovering, tag, tilbygninger og hovedentrepriser i hele Nordsjælland.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className="btn-accent">Indhent tilbud</Link>
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors text-sm">
              Ring {SITE.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="eyebrow text-white/50 mb-5">Kontakt</div>
          <ul className="space-y-2 text-white/85 text-sm">
            <li><a href={`tel:${SITE.phone}`} className="hover:text-[color:var(--color-accent)]">{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-[color:var(--color-accent)] break-all">{SITE.email}</a></li>
            <li className="pt-2">{SITE.address.street}</li>
            <li>{SITE.address.postal} {SITE.address.city}</li>
            <li className="pt-2 text-white/50">CVR {SITE.cvr}</li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="eyebrow text-white/50 mb-5">Ydelser</div>
          <ul className="space-y-2 text-white/85 text-sm">
            <li><Link href="/ydelser/tagrenovering" className="hover:text-[color:var(--color-accent)]">Tag</Link></li>
            <li><Link href="/ydelser/tilbygning" className="hover:text-[color:var(--color-accent)]">Tilbygning</Link></li>
            <li><Link href="/ydelser/totalentreprise" className="hover:text-[color:var(--color-accent)]">Totalentreprise</Link></li>
            <li><Link href="/ydelser/byggeraadgivning" className="hover:text-[color:var(--color-accent)]">Rådgivning</Link></li>
            <li className="pt-1"><Link href="/ydelser" className="text-white/55 hover:text-[color:var(--color-accent)]">Se alle →</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="eyebrow text-white/50 mb-5">Firma</div>
          <ul className="space-y-2 text-white/85 text-sm">
            <li><Link href="/om" className="hover:text-[color:var(--color-accent)]">Om Holstrup</Link></li>
            <li><Link href="/projekter" className="hover:text-[color:var(--color-accent)]">Projekter</Link></li>
            <li><Link href="/blog" className="hover:text-[color:var(--color-accent)]">Viden</Link></li>
            <li><Link href="/omraader" className="hover:text-[color:var(--color-accent)]">Områder</Link></li>
            <li><Link href="/kontakt" className="hover:text-[color:var(--color-accent)]">Kontakt</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 text-xs text-white/40 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {SITE.fullName} · CVR {SITE.cvr}</span>
          <span>{SITE.address.city}, Nordsjælland</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${inter.variable} ${interDisplay.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col pb-16 md:pb-0">
        <LocalBusinessJsonLd />
        <PersonJsonLd />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomBar />
        <Analytics />
      </body>
    </html>
  );
}
