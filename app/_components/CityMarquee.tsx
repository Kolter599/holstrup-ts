import Link from "next/link";
import { AREAS } from "@/lib/site";

type Props = { variant?: "light" | "dark" };

export function CityMarquee({ variant = "light" }: Props) {
  const items = [...AREAS, ...AREAS]; // duplicate for seamless loop
  const isDark = variant === "dark";
  const colors = isDark
    ? "border-y border-white/10 text-white"
    : "border-y border-[color:var(--color-line)] text-[color:var(--color-ink)]";
  const dotColor = isDark ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-blue)]";
  return (
    <div className={`overflow-hidden marquee-pause ${colors}`}>
      <div className="marquee py-5 whitespace-nowrap">
        {items.map((a, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 font-mono text-sm uppercase tracking-wider">
            <Link href={`/tomrer-${a.slug}`} className="hover:opacity-70 transition-opacity">
              Tømrer {a.name}
            </Link>
            <span className={dotColor}>●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
