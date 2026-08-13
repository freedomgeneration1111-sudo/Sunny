import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { getGuide, guides } from "@/lib/content/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide
    ? {
        title: guide.title,
        description: guide.description,
        alternates: { canonical: `/guides/${guide.slug}/` },
      }
    : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  return (
    <>
      <PageHero variant="textLed" eyebrow={guide.eyebrow} title={guide.title} body={guide.description} inquiryEvent={guide.relatedEvent} />
      <Section compact className="border-b border-border">
        <Container variant="reading"><Lead>{guide.intro}</Lead></Container>
      </Section>
      {guide.sections.map((section, index) => (
        <Section key={section.title} theme={index % 2 ? "alt" : "default"}>
          <Container>
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
              <div><Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow><SectionHeading className="mt-4">{section.title}</SectionHeading><p className="mt-5 leading-7 text-ink-muted">{section.body}</p></div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => <li key={item} className="rounded-card border border-border bg-surface p-5 leading-7"><span className="mr-2 font-black text-brand-primary" aria-hidden="true">✓</span>{item}</li>)}
              </ul>
            </div>
          </Container>
        </Section>
      ))}
      <Section theme="brand">
        <Container><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><Eyebrow className="text-ink/70!">Use the guide</Eyebrow><SectionHeading className="mt-4">Bring the useful context into one inquiry.</SectionHeading><p className="mt-4 max-w-[60ch] text-lg text-ink/75">Start with the date, venue or city, and the services you have in mind. We will take it from there.</p></div><Button href={`/check-availability?event=${encodeURIComponent(guide.relatedEvent)}`} variant="inverse">Check Availability <span className="ml-2" aria-hidden="true">→</span></Button></div><Link href="/guides" className="mt-8 inline-flex min-h-12 items-center font-extrabold text-ink">← All planning guides</Link></Container>
      </Section>
    </>
  );
}
