import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Typography";

export type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
};

/** Shared shell for the privacy and terms pages: plain, readable, printable. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <Section theme="dark" className="pt-[calc(var(--header-h)+2rem)]">
        <Container variant="reading">
          <Eyebrow className="!text-brand-accent">{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-.035em] text-balance">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-on-brand/70">{intro}</p>
        </Container>
      </Section>

      <Section>
        <Container variant="reading">
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-extrabold">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-4 leading-8 text-ink-muted">
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-5 space-y-3">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-4 leading-8 text-ink-muted">
                        <span aria-hidden="true" className="font-black text-brand-primary">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-8 print:hidden">
            <Button href="/check-availability">Check Availability</Button>
            <Link href="/" className="inline-flex min-h-12 items-center font-extrabold text-ink">
              ← Back to Focus Lab
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
