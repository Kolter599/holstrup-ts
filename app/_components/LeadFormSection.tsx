import { LeadForm, type LeadFormProps } from "./LeadForm";

// Server wrapper: the only place that reads the Blob token, so every page can
// drop the form in with one line and no env plumbing of its own.

type Props = Omit<LeadFormProps, "photosEnabled"> & {
  /** Section chrome around the inline form. Omitted on /kontakt. */
  heading?: string;
};

export function LeadFormSection({ heading, variant = "inline", ...rest }: Props) {
  const form = <LeadForm variant={variant} photosEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} {...rest} />;

  if (variant === "full") return form;

  return (
    <section className="border-t border-[color:var(--color-line)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {heading ? (
          <h2 className="mb-8 text-center font-display text-2xl font-extrabold leading-tight text-[color:var(--color-ink)] md:text-3xl">
            {heading}
          </h2>
        ) : null}
        {form}
      </div>
    </section>
  );
}
