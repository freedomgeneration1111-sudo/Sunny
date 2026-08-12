import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { MediaFrame } from "@/components/media/MediaFrame";
import { PlanItemCard } from "@/components/planning/PlanItemCard";
import type {
  CommercialPageContent,
  CommercialSection,
} from "@/lib/content/commercial";
import { PageHero } from "./PageHero";

export function EventPage({ page }: { page: CommercialPageContent }) {
  const eventQuery = page.cta.event
    ? `?event=${encodeURIComponent(page.cta.event)}`
    : "";

  return (
    <>
      <PageHero {...page.hero} />
      {page.sections.map((section) => (
        <EventSection key={section.id} section={section} />
      ))}
      <Section theme="alt" id="questions">
        <Container variant="reading">
          <Eyebrow>Questions, answered</Eyebrow>
          <SectionHeading className="mb-9 mt-4">Plan with fewer unknowns.</SectionHeading>
          <div className="divide-y divide-border border-y border-border">
            {page.faqs.map((faq, index) => (
              <details key={faq.question} className="group" open={index === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-lg font-extrabold marker:content-none">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-xl group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[65ch] pb-7 pr-12 leading-7 text-ink-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
      <Section theme="brand" className="overflow-hidden">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow className="!text-ink/70">The next useful step</Eyebrow>
              <SectionHeading className="mt-4 max-w-[18ch]">{page.cta.title}</SectionHeading>
              <p className="mt-5 max-w-[60ch] text-lg leading-8 text-ink/75">{page.cta.body}</p>
            </div>
            <Button href={`/check-availability${eventQuery}`} variant="secondary" className="border-ink bg-ink text-on-brand hover:border-ink hover:bg-ink/85">
              Check Availability <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function EventSection({ section }: { section: CommercialSection }) {
  const isDark = section.theme === "dark";
  return (
    <Section id={section.id} theme={section.theme ?? "default"}>
      <Container>
        {section.kind === "editorial" ? (
          <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <SectionIntro section={section} isDark={isDark} />
            {section.media ? <MediaFrame asset={section.media} sizes="(min-width:1024px) 54vw,100vw" /> : null}
          </div>
        ) : (
          <>
            <SectionIntro section={section} isDark={isDark} />
            {section.kind === "packages" && section.planItemIds ? (
              <div className={`mt-10 grid gap-4 ${section.planItemIds.length === 1 ? "max-w-md" : "md:grid-cols-2 xl:grid-cols-3"}`}>
                {section.planItemIds.map((id) => <PlanItemCard id={id} key={id} compact={section.planItemIds!.length > 3} />)}
              </div>
            ) : null}
            {(section.kind === "cards" || section.kind === "checklist") && section.items ? (
              <div className={`mt-10 grid gap-4 ${section.items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
                {section.items.map((item, index) => (
                  <article key={item.title} className={`rounded-card border p-6 ${isDark ? "border-on-brand/15 bg-on-brand/[.04]" : "border-border bg-surface"}`}>
                    {section.kind === "checklist" ? (
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-primary text-sm font-black text-on-brand">✓</span>
                    ) : (
                      <p className={`text-xs font-extrabold uppercase tracking-[.14em] ${isDark ? "text-brand-accent" : "text-brand-primary"}`}>{item.meta ?? String(index + 1).padStart(2, "0")}</p>
                    )}
                    <h3 className="mt-5 text-xl font-extrabold">{item.title}</h3>
                    <p className={`mt-3 leading-7 ${isDark ? "text-on-brand/65" : "text-ink-muted"}`}>{item.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {section.kind === "timeline" && section.items ? (
              <div className="mt-10 grid overflow-hidden rounded-card border border-border md:grid-cols-2 xl:grid-cols-4">
                {section.items.map((item, index) => (
                  <article key={item.title} className={`border-b p-6 md:border-r xl:border-b-0 xl:last:border-r-0 ${isDark ? "border-on-brand/15 bg-on-brand/[.04]" : "border-border bg-surface"}`}>
                    <span className="text-sm font-black text-brand-primary">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-8 text-lg font-extrabold">{item.title}</h3>
                    <p className={`mt-3 text-sm leading-6 ${isDark ? "text-on-brand/65" : "text-ink-muted"}`}>{item.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {section.kind === "timeline" && section.media ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <MediaFrame asset={section.media} sizes="(min-width:768px) 50vw,100vw" />
                {section.secondaryMedia ? <MediaFrame asset={section.secondaryMedia} sizes="(min-width:768px) 50vw,100vw" /> : null}
              </div>
            ) : null}
            {section.kind === "pricing-bridge" ? (
              <div className={`mt-10 flex flex-col gap-5 rounded-media border p-6 sm:flex-row sm:items-center sm:justify-between md:p-8 ${isDark ? "border-on-brand/15 bg-on-brand/[.04]" : "border-border bg-surface"}`}>
                <p className={`max-w-[54ch] text-sm leading-6 ${isDark ? "text-on-brand/65" : "text-ink-muted"}`}>Review every published development anchor in one place. Add-to-Plan choices persist as you move between pages.</p>
                <Button href="/pricing" variant={isDark ? "primary" : "secondary"}>Open Pricing Planner <span className="ml-2" aria-hidden="true">→</span></Button>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </Section>
  );
}

function SectionIntro({ section, isDark }: { section: CommercialSection; isDark: boolean }) {
  return (
    <div className="max-w-[760px]">
      {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
      <SectionHeading className="mt-4">{section.title}</SectionHeading>
      <Lead className={`mt-5 ${isDark ? "!text-on-brand/68" : ""}`}>{section.body}</Lead>
    </div>
  );
}
