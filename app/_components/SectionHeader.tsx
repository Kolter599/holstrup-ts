import { Reveal } from "./Reveal";

type Props = {
  number: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "split";
};

export function SectionHeader({ number, eyebrow, title, intro, align = "split" }: Props) {
  if (align === "left") {
    return (
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex items-start gap-6 mb-12 md:mb-16">
          <div className="section-number shrink-0">{number}</div>
          <div className="pt-3 md:pt-6">
            <div className="eyebrow-accent mb-4">{eyebrow}</div>
            <h2 className="display-lg max-w-3xl">{title}</h2>
            {intro && (
              <p className="mt-6 text-lg text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">{intro}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10 mb-12 md:mb-20">
      <Reveal>
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-8 flex items-start gap-6">
            <div className="section-number shrink-0 hidden md:block">{number}</div>
            <div className="pt-3 md:pt-6">
              <div className="eyebrow-accent mb-4">{eyebrow}</div>
              <h2 className="display-lg max-w-2xl">{title}</h2>
            </div>
          </div>
          {intro && (
            <p className="md:col-span-4 text-lg text-[color:var(--color-ink-soft)] leading-relaxed">{intro}</p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
