import type { Metadata } from "next";
import { MediaFrame } from "@/components/media/MediaFrame";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { config } from "@/lib/config";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";

const title = "Our Approach";
const description =
  "Focus Lab Productions is a Dallas–Fort Worth event company covering photo, video, DJ/MC, sound, lighting and production — planned together around your event.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/" },
  ...socialMetadata(title, description),
};

const howWeWork = [
  { n: "01", t: "The event first", b: "We start with what is happening and when, not with a list of equipment." },
  { n: "02", t: "Only what you need", b: "Book one service or several. Nothing here is a bundle you have to take whole." },
  { n: "03", t: "One plan to update", b: "When timing changes, there is one plan to change rather than four conversations." },
];

const workingWith = [
  { t: "Planners", b: "We work from your run of show and tell you early where cues depend on each other." },
  { t: "Venues", b: "We confirm access, timing, power, and house rules before the day, not on it." },
  { t: "Caterers", b: "Dinner service and the program share a timeline. We plan the handoffs with you." },
  { t: "Other vendors", b: "We are clear about where our work ends and someone else's begins." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="textLed"
        eyebrow="Our Approach"
        title="One crew for the parts of your event that depend on each other."
        body="Focus Lab Productions covers photo, video, DJ and MC, sound, lighting and production for events across Dallas–Fort Worth."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>Who we are</Eyebrow>
              <SectionHeading className="mt-4">Built for events with moving parts.</SectionHeading>
              <Lead className="mt-6">
                Music, microphones, cameras and lighting all point at the same moments. When they
                are booked separately, someone has to keep four teams in step on the day. We put
                them under one plan instead.
              </Lead>
              <p className="mt-5 max-w-[60ch] leading-8 text-ink-muted">
                That does not mean you have to take everything. Plenty of our work is a single
                service. It means that when you do want more than one, they arrive already planned
                together.
              </p>
            </div>
            <MediaFrame asset={media.weddingCoordination} sizes="(min-width:1024px) 52vw,100vw" aspectRatioOverride="4/3" />
          </div>
        </Container>
      </Section>

      <Section theme="alt">
        <Container>
          <Eyebrow>How we work</Eyebrow>
          <SectionHeading className="mt-4 max-w-[22ch]">Three habits that make the day easier.</SectionHeading>
          <ol className="mt-10 grid overflow-hidden rounded-media border border-border md:grid-cols-3">
            {howWeWork.map((item) => (
              <li
                key={item.n}
                className="border-b border-border bg-surface p-7 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="text-sm font-black text-brand-primary">{item.n}</span>
                <h2 className="mt-12 text-xl font-extrabold">{item.t}</h2>
                <p className="mt-3 leading-7 text-ink-muted">{item.b}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section theme="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <Eyebrow className="text-brand-accent!">Language and culture</Eyebrow>
              <SectionHeading className="mt-4">Planning in the language your family uses.</SectionHeading>
              <p className="mt-6 text-lg leading-8 text-on-brand/68">
                Our team can communicate in English, Urdu, Hindi and Punjabi. For Asian
                celebrations that matters well before the event — in how names are pronounced, how
                announcements are made, and how comfortably families can talk through the plan.
              </p>
              <p className="mt-5 leading-8 text-on-brand/68">
                We work from the events your family is actually planning and the terms your family
                uses for them, rather than a fixed template of what a celebration should look like.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.languages.map((language) => (
                <div
                  key={language}
                  className="rounded-card border border-on-brand/15 bg-on-brand/[.04] p-6 text-center text-lg font-extrabold"
                >
                  {language}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
            <div>
              <Eyebrow>Working alongside your team</Eyebrow>
              <SectionHeading className="mt-4">We are one part of your event.</SectionHeading>
              <Lead className="mt-6">
                Most events involve several companies. The ones that run smoothly are the ones where
                everybody knows the plan.
              </Lead>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workingWith.map((item) => (
                <article key={item.t} className="rounded-card border border-border bg-surface p-6">
                  <h2 className="text-xl font-extrabold">{item.t}</h2>
                  <p className="mt-3 leading-7 text-ink-muted">{item.b}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="alt">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Where we work</Eyebrow>
              <SectionHeading className="mt-4">Across {config.serviceArea}.</SectionHeading>
              <Lead className="mt-6">
                Dallas, Fort Worth, and the cities around them. Tell us your venue or city when you
                get in touch — events further out are quoted with the travel included.
              </Lead>
            </div>
            <MediaFrame asset={media.asianWeddingReception} sizes="(min-width:1024px) 48vw,100vw" aspectRatioOverride="16/10" />
          </div>
        </Container>
      </Section>

      <Section theme="brand" id="cta">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow className="text-ink/70!">Start here</Eyebrow>
              <SectionHeading className="mt-4 max-w-[20ch]">Tell us about your event.</SectionHeading>
              <p className="mt-5 max-w-[58ch] text-lg text-ink/75">
                Share the date, the city, and what you have in mind. We will take it from there.
              </p>
            </div>
            <Button href="/check-availability" variant="inverse">
              Check Availability <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
