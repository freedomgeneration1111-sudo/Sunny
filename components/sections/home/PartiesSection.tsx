import { MediaFrame } from "@/components/media/MediaFrame";
import { PlanItemCard } from "@/components/planning/PlanItemCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { partiesSection as content } from "@/lib/content/eventSections";
import { GuideLink, PlanGroups, SectionIntro } from "./shared";

/**
 * Rhythm: duration-first. The three time blocks are the largest thing in the
 * section because for most celebrations that is genuinely the first decision.
 * Everything else is a secondary strip.
 */
export function PartiesSection() {
  return (
    <Section id={content.anchor}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-16">
          <SectionIntro eyebrow={content.eyebrow} title={content.title} lead={content.lead} />
          <MediaFrame
            asset={content.media}
            sizes="(min-width:1024px) 44vw,100vw"
            aspectRatioOverride="16/10"
          />
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {content.occasions.map((occasion) => (
            <li
              key={occasion}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-ink-muted"
            >
              {occasion}
            </li>
          ))}
        </ul>

        {/* Primary axis: how long the room stays alive. */}
        <div className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h4 className="font-display text-3xl font-bold tracking-[-.03em]">Pick a time block.</h4>
            <p className="max-w-[52ch] text-sm text-ink-muted">{content.durationNote}</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {content.durationIds.map((id) => (
              <PlanItemCard key={id} id={id} />
            ))}
          </div>
        </div>

        <PlanGroups groups={content.planGroups} />
        <GuideLink {...content.guide} />
      </Container>
    </Section>
  );
}
