import type { Metadata } from "next";
import { FAQList } from "@/components/sections/FAQList";
import { PageHero } from "@/components/sections/PageHero";
import { PricingPlanner } from "@/components/sections/PricingPlanner";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { commonFaqs } from "@/lib/content/commercial";
import { developmentPricing } from "@/lib/pricing";

export const metadata: Metadata = { title: "Pricing Planner", description: "Explore provisional starting anchors and carry event selections into availability." };

export default function PricingPage() {
  return (
    <>
      <PageHero variant="textLed" eyebrow="Pricing Planner" title="Build the starting point. Scope the real event next." body="Use provisional development anchors to compare directions—not to manufacture a final quote." />
      <Section compact className="border-b border-border bg-ink text-on-brand">
        <Container><div className="grid gap-4 md:grid-cols-3"><p className="font-extrabold">Visible starting anchors</p><p className="font-extrabold">Custom scope stays custom</p><p className="font-extrabold">Selections carry forward</p></div></Container>
      </Section>
      <Section id="pricing-menu"><Container><Eyebrow>Build your event</Eyebrow><SectionHeading className="mt-4">Review the complete menu, then select useful starting points.</SectionHeading><Lead className="mt-5">Every publishable group is visible below. The same menu appears on the homepage and preserves context into the availability form.</Lead><div className="mt-10"><PricingPlanner /></div></Container></Section>
      <Section theme="alt"><Container><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><Eyebrow>What changes price</Eyebrow><SectionHeading className="mt-4">Exact scope follows the event.</SectionHeading></div><div className="grid gap-3 sm:grid-cols-2">{["Date + event sequence","Venue + service area","Coverage + crew needs","Guest count + room scale","Technical conditions","Requested deliverables"].map((item) => <div key={item} className="rounded-card border border-border bg-surface p-5 font-extrabold">{item}</div>)}</div></div></Container></Section>
      <Section theme="dark"><Container><Eyebrow>Custom-scope bridge</Eyebrow><SectionHeading className="mt-4 max-w-[18ch]">Some events should not be reduced to a preset.</SectionHeading><p className="mt-5 max-w-[65ch] text-lg leading-8 text-on-brand/68">Complex production, multi-event celebrations, and restrictive venues move into exact scope.</p><div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{developmentPricing.customQuoteCategories.map((item) => <div key={item} className="rounded-card border border-on-brand/15 bg-on-brand/[.04] p-5 text-sm font-bold leading-6">{item}</div>)}</div></Container></Section>
      <Section><Container variant="reading"><Eyebrow>Pricing questions</Eyebrow><SectionHeading className="mb-9 mt-4">Know what the planner does—and does not—promise.</SectionHeading><FAQList items={commonFaqs} /></Container></Section>
      <Section theme="brand"><Container><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><Eyebrow className="!text-ink/70">Carry your plan forward</Eyebrow><SectionHeading className="mt-4">Ready to put a date beside it?</SectionHeading><p className="mt-4 text-lg text-ink/75">Selections remain attached when you continue from the planner.</p></div><Button href="/check-availability" variant="secondary" className="border-ink bg-ink text-on-brand hover:bg-ink/85">Check Availability <span className="ml-2" aria-hidden="true">→</span></Button></div></Container></Section>
    </>
  );
}
