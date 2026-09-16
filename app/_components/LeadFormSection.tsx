import { LeadForm } from "./LeadForm";

// Server wrappers: the only place that reads the Blob token, so pages drop the
// form in with one line. Two placements per page, no more — compact beside the
// promise, full-width after the proof. Each carries its own #anchor as source,
// so the data can tell us later which position actually produces leads.

export const TOP_ID = "tilbud-top";
export const MAIN_ID = "tilbud";

// Vercel sets BLOB_READ_WRITE_TOKEN on older integrations and BLOB_STORE_ID on
// newer ones (the SDK then authenticates through the project itself).
function photosEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/**
 * Beside the opening section. Sticky within it on desktop, straight after the
 * intro on phones. It opens where it stands — being thrown to the bottom of the
 * page mid-thought is worse than a slightly narrower column.
 */
export function LeadFormAside({ path, serviceSlug }: { path: string; serviceSlug?: string }) {
  return (
    <LeadForm
      id={TOP_ID}
      variant="compact"
      serviceSlug={serviceSlug}
      source={`${path}#top`}
      photosEnabled={photosEnabled()}
    />
  );
}

/** Full width, after the proof — for the visitor who has read themselves warm. */
export function LeadFormSection({ path, serviceSlug }: { path: string; serviceSlug?: string }) {
  return (
    <section className="border-t border-[color:var(--color-line)] py-16 md:py-24">
      <div className="mx-auto max-w-[1160px] px-6 md:px-10">
        <LeadForm
          id={MAIN_ID}
          variant="full"
          serviceSlug={serviceSlug}
          source={`${path}#efter-proof`}
          photosEnabled={photosEnabled()}
        />
      </div>
    </section>
  );
}

/** /kontakt: the form is the page, so it gets no section chrome and no anchor suffix. */
export function LeadFormPage() {
  return <LeadForm id={MAIN_ID} variant="full" source="/kontakt" photosEnabled={photosEnabled()} />;
}
