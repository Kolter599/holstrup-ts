import { REVIEWS, REVIEW_AGGREGATE, type Review } from "@/lib/site";

/**
 * Anmeldelser.
 *
 * Alle konkurrenter der ligger på side 1 for "tømrer [by]" viser stjerner eller
 * anmeldelsestal — flere af dem direkte i Google-titlen. Holstrup viser i dag
 * ingenting. Det er den største enkeltstående forskel.
 *
 * Sektionen renderer intet så længe REVIEWS er tom, så den kan stå i siderne nu
 * og tænde af sig selv i samme øjeblik der ligger rigtige anmeldelser i
 * lib/site.ts. Der bliver aldrig vist et tal der ikke er dokumenteret.
 */

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="text-[color:var(--color-accent)]"
      aria-label={`${rating} ud af 5 stjerner`}
    >
      {"★".repeat(rating)}
      <span className="opacity-25">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function Card({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-[color:var(--color-line)] bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        {review.source ? (
          <span className="font-mono text-[11px] uppercase tracking-wider opacity-50">
            {review.source}
          </span>
        ) : null}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">
        {review.body}
      </blockquote>
      <figcaption className="mt-5 font-mono text-[12px] uppercase tracking-wider opacity-60">
        {review.author}
        {review.city ? ` · ${review.city}` : ""}
      </figcaption>
    </figure>
  );
}

type Props = {
  /** Vis kun anmeldelser fra denne by, hvis der er nogen. Ellers vises et udvalg. */
  city?: string;
  heading?: string;
  max?: number;
};

export function Reviews({ city, heading = "Det siger kunderne", max = 3 }: Props) {
  if (REVIEWS.length === 0) return null;

  const local = city ? REVIEWS.filter((r) => r.city === city) : [];
  const shown = (local.length >= 2 ? local : REVIEWS).slice(0, max);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          {city && local.length >= 2 ? `${heading} i ${city}` : heading}
        </h2>
        {REVIEW_AGGREGATE ? (
          <p className="font-mono text-[13px] uppercase tracking-wider opacity-70">
            {REVIEW_AGGREGATE.ratingValue.toString().replace(".", ",")} af 5 ·{" "}
            {REVIEW_AGGREGATE.reviewCount} anmeldelser
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {shown.map((r, i) => (
          <Card key={`${r.author}-${i}`} review={r} />
        ))}
      </div>
    </section>
  );
}

/**
 * Kompakt variant til hero og sidetoppe — én linje, ingen kort.
 * Renderer intet uden dokumenteret aggregat.
 */
export function ReviewBadge() {
  if (!REVIEW_AGGREGATE) return null;
  return (
    <p className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-wider">
      <Stars rating={Math.round(REVIEW_AGGREGATE.ratingValue)} />
      <span className="opacity-70">
        {REVIEW_AGGREGATE.reviewCount} anmeldelser
      </span>
    </p>
  );
}
