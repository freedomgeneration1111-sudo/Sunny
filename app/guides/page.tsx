import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { guides } from "@/lib/content/guides";
import { socialMetadata } from "@/lib/seo";

const title = "Event Planning Guides";
const description = "Practical planning checklists for DFW weddings, Asian celebrations, corporate AV, photo and video, and venue approvals.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/guides/" }, ...socialMetadata(title, description) };

export default function GuidesPage() {
  return (
    <>
      <PageHero variant="textLed" eyebrow="Planning Resources" title="Questions worth answering early." body="Short, practical guides for event timelines, venue conversations, media priorities, and production approvals." />
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div><Eyebrow>Guide library</Eyebrow><SectionHeading className="mt-4">Plan the event before you choose every detail.</SectionHeading></div>
            <Lead>Use these to prepare for planning conversations with your venue, your family, and us. Your venue&rsquo;s rules and your final agreement always come first.</Lead>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.slug} className="flex h-full flex-col rounded-card border border-border bg-surface p-6">
                <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-primary">{guide.eyebrow}</p>
                <h2 className="mt-4 text-2xl font-extrabold">{guide.title}</h2>
                <p className="mt-3 flex-1 leading-7 text-ink-muted">{guide.description}</p>
                <Link href={`/guides/${guide.slug}`} className="mt-6 inline-flex min-h-12 items-center font-extrabold text-brand-primary">Open guide <span className="ml-2" aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
