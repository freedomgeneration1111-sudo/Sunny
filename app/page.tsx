import type { Metadata } from "next";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MediaFrame } from "@/components/media/MediaFrame";
import { CorporateSection } from "@/components/sections/home/CorporateSection";
import { PartiesSection } from "@/components/sections/home/PartiesSection";
import { AsianWeddingsSection } from "@/components/sections/home/AsianWeddingsSection";
import { WeddingsSection } from "@/components/sections/home/WeddingsSection";
import { FAQList } from "@/components/sections/FAQList";
import { HomeHero } from "@/components/sections/HomeHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { commonFaqs } from "@/lib/content/commercial";
import { config } from "@/lib/config";
import { eventPathCards } from "@/lib/content/eventSections";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";

const description =
  "Photo, video, DJ/MC, sound, lighting and production for weddings, Asian wedding celebrations, parties and corporate events across Dallas–Fort Worth.";

export const metadata: Metadata = {
  description,
  alternates: { canonical: "/" },
  ...socialMetadata(`${config.businessName} — DFW Weddings & Events`, description),
};

/**
 * The homepage carries the customer journey: understand Focus Lab, understand
 * why one crew helps, choose an event type, see what we cover, then pricing and
 * Check Availability.
 *
 * The full service menu deliberately lives on /pricing. Each event section
 * links to its own category there rather than repeating the catalog here.
 *
 * Anchor order is a structural contract, mirrored by the header nav and
 * asserted in tests/redesign-baseline.spec.ts.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero asset={media.homeHero} />

      <Section compact id="trust-strip" className="border-b border-border">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs font-extrabold uppercase tracking-[.15em] text-ink-muted">
            <span>Dallas–Fort Worth</span>
            <span>Photo + Video</span>
            <span>Entertainment + Production</span>
            <span>English · Urdu · Hindi · Punjabi</span>
          </div>
        </Container>
      </Section>

      {/* The differentiator comes before the shopping. */}
      <Section theme="dark" id="why-one-crew">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <Reveal>
              <Eyebrow className="text-brand-accent!">Why one crew</Eyebrow>
              <SectionHeading className="mt-4">Fewer handoffs to manage.</SectionHeading>
              <p className="mt-6 text-lg leading-8 text-on-brand/68">
                Camera position, microphone cues, music, lighting, and room transitions all affect
                one another. Booking them together means they are planned together.
              </p>
            </Reveal>
            <ol className="grid overflow-hidden rounded-media border border-on-brand/15 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "One planning conversation",
                  b: "Photo, video, entertainment and production work from the same event plan.",
                },
                {
                  n: "02",
                  t: "Fewer handoffs",
                  b: "Music, microphones, cameras, lighting and key cues are coordinated together.",
                },
                {
                  n: "03",
                  t: "One place to make changes",
                  b: "When timing or event details change, there is one plan to update.",
                },
              ].map((item, index) => (
                <Reveal
                  as="li"
                  index={index}
                  key={item.n}
                  className="border-b border-on-brand/15 p-6 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <span className="text-sm font-black text-brand-accent">{item.n}</span>
                  <h3 className="mt-12 text-xl font-extrabold">{item.t}</h3>
                  <p className="mt-3 text-sm leading-6 text-on-brand/60">{item.b}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* The mental map. These scroll down the page. */}
      <Section id="paths">
        <Container>
          <Reveal className="grid gap-6 lg:grid-cols-[.68fr_1.32fr] lg:items-end">
            <div>
              <Eyebrow>Start with your event</Eyebrow>
              <SectionHeading className="mt-4">What are you planning?</SectionHeading>
            </div>
            <Lead>
              Jump to your event to see what Focus Lab can cover, then head to pricing when you
              want numbers.
            </Lead>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {eventPathCards.map((event, index) => (
              <Reveal index={index} key={event.anchor}>
                <TrackedLink
                  event="event_path_select"
                  details={{ path: `#${event.anchor}` }}
                  href={`#${event.anchor}`}
                  className="card-hover group block overflow-hidden rounded-card border border-border bg-surface transition-[border-color] hover:border-brand-primary"
                >
                  <MediaFrame
                    asset={event.asset}
                    className="rounded-none"
                    sizes="(min-width:1280px) 25vw,(min-width:640px) 50vw,100vw"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold">{event.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">{event.body}</p>
                    <span className="mt-5 inline-flex font-extrabold text-brand-primary">
                      Jump to section{" "}
                      <span className="ml-2 transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                        ↓
                      </span>
                    </span>
                  </div>
                </TrackedLink>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <WeddingsSection />
      <AsianWeddingsSection />
      <PartiesSection />
      <CorporateSection />

      <Section id="capabilities">
        <Container>
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
            <SectionHeading className="mt-4 max-w-[18ch]">Two teams, one event plan.</SectionHeading>
          </Reveal>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {[
              {
                title: "Photo + Video",
                body: "Photography, film, and coverage planned around your timeline.",
                asset: media.capture,
                href: "/services/photo-video",
                labels: ["Photography", "Film", "Both together"],
              },
              {
                title: "Entertainment + Production",
                body: "DJ and MC, sound, lighting, and the extras that change a room.",
                asset: media.production,
                href: "/services/entertainment-production",
                labels: ["DJ + MC", "Sound + lighting", "Enhancements"],
              },
            ].map((capability, index) => (
              <Reveal
                as="article"
                index={index}
                key={capability.title}
                className="card-hover group rounded-card"
              >
                <MediaFrame asset={capability.asset} sizes="(min-width:1024px) 50vw,100vw" />
                <div className="mt-6 flex flex-wrap gap-2">
                  {capability.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-ink-muted"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <h3 className="mt-5 text-3xl font-extrabold">{capability.title}</h3>
                <p className="mt-3 text-ink-muted">{capability.body}</p>
                <TrackedLink
                  event="service_path_select"
                  details={{ path: capability.href }}
                  href={capability.href}
                  className="mt-5 inline-flex min-h-12 items-center font-extrabold text-brand-primary"
                >
                  Learn more{" "}
                  <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </TrackedLink>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Compact bridge. The full menu lives on /pricing. */}
      <Section theme="alt" id="pricing-menu">
        <Container>
          <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow>Pricing</Eyebrow>
              <SectionHeading className="mt-4 max-w-[20ch]">Clear pricing. Custom quotes.</SectionHeading>
              <p className="mt-5 max-w-[62ch] text-lg leading-8 text-ink-muted">
                Browse the full Focus Lab service and pricing menu, then send us your event details
                when you are ready for a quote.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/pricing">View Pricing</Button>
              <Button href="/check-availability" variant="secondary">
                Check Availability
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section id="how-it-works">
        <Container>
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <SectionHeading className="mt-4">Three steps to a real number.</SectionHeading>
          </Reveal>
          <ol className="mt-10 grid overflow-hidden rounded-card border border-border md:grid-cols-3">
            {[
              { n: "01", t: "Share the date", b: "Tell us what you're planning and where." },
              { n: "02", t: "Review your options", b: "Use the pricing menu to see the services that may fit your event." },
              { n: "03", t: "Get your quote", b: "Focus Lab confirms the event details, services and final price with you." },
            ].map((item, index) => (
              <Reveal
                as="li"
                index={index}
                key={item.n}
                className="border-b border-border bg-surface p-6 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-black text-on-brand">
                  {item.n}
                </span>
                <h3 className="mt-8 text-xl font-extrabold">{item.t}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{item.b}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section theme="alt" id="questions">
        <Container variant="reading">
          <Reveal>
            <Eyebrow>Questions, answered</Eyebrow>
            <SectionHeading className="mb-9 mt-4">Know what happens next.</SectionHeading>
          </Reveal>
          <FAQList items={commonFaqs} stagger />
        </Container>
      </Section>

      <Section theme="brand" id="cta">
        <Container>
          <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow className="text-ink/70!">Start here</Eyebrow>
              <SectionHeading className="mt-4 max-w-[17ch]">One date is enough to start.</SectionHeading>
              <p className="mt-5 max-w-[58ch] text-lg text-ink/75">
                Tell us the event, the city, and what you have in mind. Our team takes it from there.
              </p>
            </div>
            <Button
              href="/check-availability"
              variant="inverse"
            >
              Check Availability <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
