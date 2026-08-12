import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MediaFrame } from "@/components/media/MediaFrame";
import { PricingPlanner } from "@/components/sections/PricingPlanner";
import { FAQList } from "@/components/sections/FAQList";
import { HomeHero } from "@/components/sections/HomeHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { commonFaqs } from "@/lib/content/commercial";
import { media } from "@/lib/media";

const eventPaths = [
  { title: "South Asian Weddings", body: "Multi-event planning with cultural fluency.", href: "/south-asian-weddings", asset: media.eventSouthAsian },
  { title: "Weddings", body: "Media and entertainment on one shared timeline.", href: "/weddings", asset: media.eventWedding },
  { title: "Parties & Celebrations", body: "Clear time blocks and energy shaped to your crowd.", href: "/events/parties", asset: media.eventParty },
  { title: "Corporate & Community", body: "Professional entertainment, media, and production.", href: "/events/corporate", asset: media.eventCorporate },
] as const;

export default function HomePage() {
  return (
    <>
      <HomeHero asset={media.homeHero} />
      <Section compact className="border-b border-border">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs font-extrabold uppercase tracking-[.15em] text-ink-muted">
            <span>Dallas–Fort Worth</span><span>Photo + Video</span><span>Entertainment + Production</span><span>English · Urdu · Hindi · Punjabi</span>
          </div>
        </Container>
      </Section>

      <Section id="event-paths">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[.68fr_1.32fr] lg:items-end">
            <div>
              <Eyebrow>Start with your event</Eyebrow>
              <SectionHeading className="mt-4">Choose the path that fits the room.</SectionHeading>
            </div>
            <Lead>Event type is the fastest way into the right decisions. Services stay modular underneath.</Lead>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {eventPaths.map((event) => (
              <TrackedLink event="event_path_select" details={{ path: event.href }} href={event.href} key={event.href} className="group overflow-hidden rounded-card border border-border bg-surface transition-[border-color,transform] motion-safe:hover:-translate-y-1 hover:border-brand-primary">
                <MediaFrame asset={event.asset} className="rounded-none" sizes="(min-width:1280px) 25vw,(min-width:640px) 50vw,100vw" />
                <div className="p-5">
                  <h3 className="text-xl font-extrabold">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{event.body}</p>
                  <span className="mt-5 inline-flex font-extrabold text-brand-primary">Explore <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></span>
                </div>
              </TrackedLink>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="dark" id="one-crew">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <Eyebrow>Why one crew</Eyebrow>
              <SectionHeading className="mt-4">Fewer handoffs. A clearer event plan.</SectionHeading>
              <p className="mt-6 text-lg leading-8 text-on-brand/68">Camera position, microphone cues, music, lighting, and room transitions affect one another. Coordination begins before the event.</p>
            </div>
            <ol className="grid overflow-hidden rounded-media border border-on-brand/15 sm:grid-cols-3">
              {[{n:"01",t:"One timeline",b:"Selected services work from the same key moments."},{n:"02",t:"Clear ownership",b:"Every capability understands where it fits."},{n:"03",t:"Exact scope",b:"Complexity becomes a planning conversation."}].map((item) => (
                <li key={item.n} className="border-b border-on-brand/15 p-6 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="text-sm font-black text-brand-accent">{item.n}</span>
                  <h3 className="mt-12 text-xl font-extrabold">{item.t}</h3>
                  <p className="mt-3 text-sm leading-6 text-on-brand/60">{item.b}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section id="capabilities">
        <Container>
          <Eyebrow>Two capability families</Eyebrow>
          <SectionHeading className="mt-4 max-w-[18ch]">Specialists connected by one event plan.</SectionHeading>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {[{title:"Photo + Video",body:"Photography, filmmaking, and coordinated coverage.",asset:media.capture,href:"/services/photo-video",labels:["Photography","Film","Combined coverage"]},{title:"Entertainment + Production",body:"DJ/MC, sound, lighting, and event enhancements.",asset:media.production,href:"/services/entertainment-production",labels:["DJ + MC","Sound + lighting","Enhancements"]}].map((capability) => (
              <article key={capability.title} className="group">
                <MediaFrame asset={capability.asset} sizes="(min-width:1024px) 50vw,100vw" />
                <div className="mt-6 flex flex-wrap gap-2">{capability.labels.map((label) => <span key={label} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-ink-muted">{label}</span>)}</div>
                <h3 className="mt-5 text-3xl font-extrabold">{capability.title}</h3>
                <p className="mt-3 text-ink-muted">{capability.body}</p>
                <TrackedLink event="service_path_select" details={{ path: capability.href }} href={capability.href} className="mt-5 inline-flex min-h-12 items-center font-extrabold text-brand-primary">Explore capability <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></TrackedLink>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="alt" id="pricing-menu">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><Eyebrow>Build your event</Eyebrow><SectionHeading className="mt-4">Put a starting plan together.</SectionHeading></div>
            <Lead>These provisional anchors are visible for customer review. Select a useful direction and carry it into availability.</Lead>
          </div>
          <div className="mt-10"><PricingPlanner /></div>
          <Button href="/pricing" variant="secondary" className="mt-8">Open the self-contained pricing page <span className="ml-2" aria-hidden="true">→</span></Button>
        </Container>
      </Section>

      <Section id="process">
        <Container>
          <Eyebrow>How it works</Eyebrow>
          <SectionHeading className="mt-4">Start simple. Scope carefully.</SectionHeading>
          <ol className="mt-10 grid overflow-hidden rounded-card border border-border md:grid-cols-3">
            {[{n:"01",t:"Share the date",b:"Event type, city, timing, and what matters."},{n:"02",t:"Choose the pieces",b:"Media, entertainment, production, or a coordinated mix."},{n:"03",t:"Confirm exact scope",b:"Resolve details before an anchor is treated as final."}].map((item) => (
              <li key={item.n} className="border-b border-border bg-surface p-6 last:border-0 md:border-b-0 md:border-r md:last:border-r-0">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-black text-on-brand">{item.n}</span>
                <h3 className="mt-8 text-xl font-extrabold">{item.t}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{item.b}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section theme="alt" id="questions">
        <Container variant="reading">
          <Eyebrow>Questions, answered</Eyebrow>
          <SectionHeading className="mb-9 mt-4">Know what happens next.</SectionHeading>
          <FAQList items={commonFaqs} />
        </Container>
      </Section>
      <Section theme="brand">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div><Eyebrow className="!text-ink/70">Start here</Eyebrow><SectionHeading className="mt-4 max-w-[17ch]">One date is enough to start.</SectionHeading><p className="mt-5 max-w-[58ch] text-lg text-ink/75">Tell us the event, city, and what you are considering. Exact scope comes next.</p></div>
            <Button href="/check-availability" variant="secondary" className="border-ink bg-ink text-on-brand hover:bg-ink/85">Check Availability <span className="ml-2" aria-hidden="true">→</span></Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
