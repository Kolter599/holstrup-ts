import { LeadForm, type LeadFormProps } from "./LeadForm";

// Server wrapper: the only place that reads the Blob token, so every page can
// drop the form in with one line and no env plumbing of its own.

type Props = Omit<LeadFormProps, "photosEnabled">;

export function LeadFormSection({ variant = "inline", ...rest }: Props) {
  const form = (
    <LeadForm
      variant={variant}
      photosEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      {...rest}
    />
  );

  if (variant === "full") return form;

  return (
    <section className="border-t border-[color:var(--color-line)] py-16 md:py-24">
      <div className="mx-auto max-w-[1160px] px-6 md:px-10">{form}</div>
    </section>
  );
}
