import Link from "next/link";
import { SITE } from "@/lib/site";

export function MobileBottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[color:var(--color-line-strong)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 divide-x divide-[color:var(--color-line)]">
        <a
          href={`tel:${SITE.phone}`}
          className="flex items-center justify-center gap-2 py-4 text-[color:var(--color-ink)] font-semibold text-[15px]"
        >
          <span aria-hidden className="text-lg">📞</span>
          Ring
        </a>
        <Link
          href="/kontakt"
          className="flex items-center justify-center gap-2 py-4 bg-[color:var(--color-accent)] text-[color:var(--color-ink)] font-semibold text-[15px]"
        >
          Indhent tilbud
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
