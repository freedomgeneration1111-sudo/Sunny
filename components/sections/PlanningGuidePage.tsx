import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { FAQList } from "@/components/sections/FAQList";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lead, SectionHeading } from "@/components/ui/Typography";
import { getGuide } from "@/lib/content/guides";
import type { GuideChapter, PlanningGuide } from "@/lib/content/planningGuides";

/**
 * The knowledge-layer page shell. Long-form, scannable, and print-friendly —
 * these pages have to be worth reading even for someone who never books.
 */
export function PlanningGuidePage({ guide }: { guide: PlanningGuide }) {
  return (
    <>
      <PageHero
        variant="fullBleed"
        eyebrow={guide.hero.eyebrow}
        title={guide.hero.title}
        body={guide.hero.body}
        media={guide.hero.media}
        inquiryEvent={guide.inquiryEvent}
      />

      {/* Commercial first: a search visitor sees what we cover and where
          pricing is before the planning guide begins. */}
      <Section theme="alt">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <div>
              <SectionHeading>{guide.commercial.title}</SectionHeading>
              <p className="mt-6 max-w-[62ch] text-lg leading-8 text-ink-muted">
                {guide.commercial.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={guide.commercial.pricing.href}>{guide.commercial.pricing.label}</Button>
                <Button
                  href={`/check-availability?event=${encodeURIComponent(guide.inquiryEvent)}`}
                  variant="secondary"
                >
                  Check Availability
                </Button>
              </div>
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-primary">
                What we can cover
              </h2>
              <ul className="mt-5 grid gap-3">
                {guide.commercial.capabilities.map((item) => (
                  <li key={item} className="flex gap-4 border-t border-border pt-3 leading-7 text-ink-muted">
                    <span aria-hidden="true" className="font-black text-brand-primary">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section compact className="border-b border-border">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <div>
              <Lead>{guide.intro}</Lead>
              <p className="mt-5 text-sm font-bold uppercase tracking-[.14em] text-ink-muted">
                {guide.readingTime}
              </p>
            </div>
            <nav aria-label="Guide contents" className="rounded-card border border-border bg-surface p-6 print:hidden">
              <h2 className="text-xs font-extrabold uppercase tracking-[.16em] text-ink-muted">
                In this guide
              </h2>
              <ol className="mt-4 grid gap-1">
                {guide.chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      className="flex min-h-11 items-center gap-3 rounded-control px-2 text-sm font-semibold hover:bg-canvas-alt hover:text-brand-primary"
                    >
                      <span className="tabular-nums text-ink-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{chapter.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </Container>
      </Section>

      {guide.chapters.map((chapter, index) => (
        <GuideChapterSection
          key={chapter.id}
          chapter={chapter}
          fallbackTheme={index % 2 ? "alt" : "default"}
        />
      ))}

      {guide.relatedGuides.length ? (
        <Section>
          <Container>
            <Eyebrow>Go deeper</Eyebrow>
            <SectionHeading className="mt-4">Focused checklists on single topics.</SectionHeading>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {guide.relatedGuides.map((slug) => {
                const related = getGuide(slug);
                if (!related) return null;
                return (
                  <article
                    key={slug}
                    className="flex h-full flex-col rounded-card border border-border bg-surface p-6"
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-primary">
                      {related.eyebrow}
                    </p>
                    <h3 className="mt-4 text-xl font-extrabold">{related.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">
                      {related.description}
                    </p>
                    <Link
                      href={`/guides/${related.slug}`}
                      className="mt-6 inline-flex min-h-12 items-center font-extrabold text-brand-primary"
                    >
                      Open checklist <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section theme="alt">
        <Container variant="reading">
          <Eyebrow>Questions, answered</Eyebrow>
          <SectionHeading className="mb-9 mt-4">Before you ask us anything.</SectionHeading>
          <FAQList items={guide.faqs} />
        </Container>
      </Section>

      <Section theme="brand" className="print:hidden">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow className="!text-ink/70">The next useful step</Eyebrow>
              <SectionHeading className="mt-4 max-w-[20ch]">{guide.cta.title}</SectionHeading>
              <p className="mt-5 max-w-[60ch] text-lg leading-8 text-ink/75">{guide.cta.body}</p>
            </div>
            <Button
              href={`/check-availability?event=${encodeURIComponent(guide.inquiryEvent)}`}
              variant="secondary"
              className="border-ink bg-ink text-on-brand hover:bg-ink/85"
            >
              Check Availability <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </div>
          <Link
            href={`/#${guide.homeAnchor}`}
            className="mt-10 inline-flex min-h-12 items-center font-extrabold text-ink"
          >
            ← Back to Focus Lab
          </Link>
        </Container>
      </Section>
    </>
  );
}

function GuideChapterSection({
  chapter,
  fallbackTheme,
}: {
  chapter: GuideChapter;
  fallbackTheme: "default" | "alt";
}) {
  const theme = chapter.theme ?? fallbackTheme;
  const isDark = theme === "dark";
  const muted = isDark ? "text-on-brand/65" : "text-ink-muted";

  return (
    <Section id={chapter.id} theme={theme} className="break-inside-avoid">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
          <div>
            <Eyebrow className={isDark ? "!text-brand-accent" : ""}>{chapter.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,2.8vw,2.75rem)] font-bold leading-[1.06] tracking-[-.03em] text-balance">
              {chapter.title}
            </h2>
            {chapter.media ? (
              <MediaFrame
                asset={chapter.media}
                className="mt-8 hidden lg:block print:hidden"
                sizes="(min-width:1024px) 32vw,100vw"
                aspectRatioOverride="4/3"
              />
            ) : null}
          </div>

          <div>
            <p className={`max-w-[68ch] text-lg leading-8 ${muted}`}>{chapter.body}</p>

            {chapter.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className={`mt-5 max-w-[68ch] leading-8 ${muted}`}>
                {paragraph}
              </p>
            ))}

            {chapter.cards ? (
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {chapter.cards.map((card) => (
                  <article
                    key={card.title}
                    className={`rounded-card border p-5 ${
                      isDark ? "border-on-brand/15 bg-on-brand/[.04]" : "border-border bg-surface"
                    }`}
                  >
                    <h3 className="text-lg font-extrabold">{card.title}</h3>
                    <p className={`mt-2 text-sm leading-6 ${muted}`}>{card.body}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {chapter.checklist ? (
              <div className="mt-9">
                {chapter.checklistTitle ? (
                  <h3 className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-primary">
                    {chapter.checklistTitle}
                  </h3>
                ) : null}
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {chapter.checklist.map((item) => (
                    <li
                      key={item}
                      className={`flex break-inside-avoid gap-3 rounded-control border p-4 leading-7 ${
                        isDark ? "border-on-brand/15 bg-on-brand/[.04]" : "border-border bg-surface"
                      }`}
                    >
                      <span aria-hidden="true" className="font-black text-brand-primary">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

          </div>
        </div>
      </Container>
    </Section>
  );
}
