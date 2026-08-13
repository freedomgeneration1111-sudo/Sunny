import type { Metadata } from "next";
import { FAQList } from "@/components/sections/FAQList";
import { PageHero } from "@/components/sections/PageHero";
import { PricingMenu } from "@/components/sections/PricingMenu";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { pricingFaqs } from "@/lib/content/commercial";
import { servicePricing } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Focus Lab Productions pricing for DFW weddings, Shaadi celebrations, parties, and corporate events — photo, video, DJ/MC, sound, lighting, and production.",
  alternates: { canonical: "/pricing/" },
};

const whatShapesAQuote = [
  { title: "Your date", body: "Peak Saturdays and holiday weekends book earliest." },
  { title: "Venue and travel", body: "Where the event is, and how far the crew and gear travel." },
  { title: "Hours", body: "When setup starts and when the night ends." },
  { title: "Guest count", body: "How much room, sound, and lighting the space needs." },
  { title: "Services together", body: "Which services you want planned on one timeline." },
  { title: "The room itself", body: "Power, load-in, ceiling height, and venue rules." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        variant="textLed"
        eyebrow="Pricing"
        title="Start with the services that fit your event."
        body="Browse Focus Lab's current services and pricing below. Your final quote is prepared around the actual date, venue, hours, event details, and services you need."
      />

      <Section>
        <Container>
          <PricingMenu />
        </Container>
      </Section>

      <Section theme="alt">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <Eyebrow>What shapes a quote</Eyebrow>
              <SectionHeading className="mt-4">Every event prices a little differently.</SectionHeading>
              <Lead className="mt-5">
                The menu shows where each service starts. These are the details we confirm with
                you before sending a quote.
              </Lead>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {whatShapesAQuote.map((item) => (
                <div key={item.title} className="rounded-card border border-border bg-surface p-5">
                  <h3 className="font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="dark">
        <Container>
          <Eyebrow className="!text-brand-accent">Custom quotes</Eyebrow>
          <SectionHeading className="mt-4 max-w-[20ch]">Some events are quoted from scratch.</SectionHeading>
          <p className="mt-5 max-w-[65ch] text-lg leading-8 text-on-brand/68">
            Larger production, multi-event celebrations, and unusual venues are quoted around what
            the event actually needs. Tell us what you are planning and we will put a number to it.
          </p>
          <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {servicePricing.customQuoteCategories.map((item) => (
              <div key={item} className="rounded-card border border-on-brand/15 bg-on-brand/[.04] p-5 text-sm font-bold leading-6">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container variant="reading">
          <Eyebrow>Pricing questions</Eyebrow>
          <SectionHeading className="mb-9 mt-4">Before you ask us anything.</SectionHeading>
          <FAQList items={pricingFaqs} />
        </Container>
      </Section>

      <Section theme="brand" id="cta">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow className="!text-ink/70">Ready for a number</Eyebrow>
              <SectionHeading className="mt-4 max-w-[20ch]">Have your date and event in mind?</SectionHeading>
              <p className="mt-5 max-w-[58ch] text-lg text-ink/75">
                Send us the details and our team will prepare your quote.
              </p>
            </div>
            <Button href="/check-availability" variant="secondary" className="border-ink bg-ink text-on-brand hover:bg-ink/85">
              Check Availability <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
