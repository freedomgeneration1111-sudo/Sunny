import { MediaFrame } from "@/components/media/MediaFrame";
import { PlanItemCard } from "@/components/planning/PlanItemCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { corporateSection as content } from "@/lib/content/eventSections";
import { GuideLink, SectionIntro } from "./shared";

/**
 * Rhythm: a job-to-be-done quadrant, deliberately structural rather than
 * celebratory. Corporate buyers are choosing a capability, not a package —
 * so this section must not read like the wedding sections above it.
 */
export function CorporateSection() {
  return (
    <Section theme="alt" id={content.anchor}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-16">
          <SectionIntro eyebrow={content.eyebrow} title={content.title} lead={content.lead} />
          <MediaFrame
            asset={content.media}
            sizes="(min-width:1024px) 44vw,100vw"
            aspectRatioOverride="16/10"
          />
        </div>

        {/* Stacked job rows rather than a 2×2 grid: the four jobs carry very
            different numbers of options, and a quadrant would leave one cell
            padded with empty space to match its neighbour. */}
        <div className="mt-14 border-t border-border">
          {content.jobs.map((job) => (
            <article
              key={job.title}
              className="grid gap-8 border-b border-border py-9 lg:grid-cols-[.42fr_.58fr] lg:gap-14"
            >
              <div>
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl font-black text-brand-primary">{job.code}</span>
                  <h4 className="text-2xl font-extrabold">{job.title}</h4>
                </div>
                <p className="mt-4 max-w-[52ch] leading-7 text-ink-muted">{job.body}</p>
              </div>
              <div
                className={`grid gap-4 ${job.ids.length >= 3 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2"}`}
              >
                {job.ids.map((id) => (
                  <PlanItemCard key={id} id={id} compact />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-media bg-ink p-7 text-on-brand md:p-10">
          <h4 className="font-display text-3xl font-bold tracking-[-.03em]">
            {content.logistics.title}
          </h4>
          <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {content.logistics.items.map((item) => (
              <li key={item} className="flex gap-4 border-t border-on-brand/15 pt-4 leading-7">
                <span aria-hidden="true" className="font-black text-brand-accent">
                  ✓
                </span>
                <span className="text-on-brand/72">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <GuideLink {...content.guide} />
      </Container>
    </Section>
  );
}
