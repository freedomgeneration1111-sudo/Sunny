import { MediaFrame } from "@/components/media/MediaFrame";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { weddingsSection as content } from "@/lib/content/eventSections";
import { GuideLink, PlanGroups, SectionIntro } from "./shared";

/**
 * Rhythm: a horizontal ceremony→reception spine. The day reads left to right
 * before any service is offered, so the plan items land as answers to moments
 * the visitor has already pictured.
 */
export function WeddingsSection() {
  return (
    <Section theme="alt" id={content.anchor}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:gap-16">
          <SectionIntro eyebrow={content.eyebrow} title={content.title} lead={content.lead} />
          <MediaFrame
            asset={content.media}
            sizes="(min-width:1024px) 46vw,100vw"
            aspectRatioOverride="3/2"
          />
        </div>

        {/* The spine. Horizontal scroll on phones, five equal columns above. */}
        <ol className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible">
          {content.moments.map((moment, index) => (
            <li
              key={moment.label}
              className="relative w-[76vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto lg:pr-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-black text-on-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-border lg:block"
                />
              </div>
              <h4 className="mt-6 text-xl font-extrabold">{moment.label}</h4>
              <p className="mt-3 text-sm leading-6 text-ink-muted lg:pr-4">{moment.note}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <MediaFrame
            asset={content.detailMedia}
            sizes="(min-width:1024px) 42vw,100vw"
            aspectRatioOverride="4/3"
          />
          <div>
            <h4 className="font-display text-3xl font-bold leading-tight tracking-[-.03em]">
              Choose only what your wedding actually needs.
            </h4>
            <p className="mt-5 max-w-[58ch] leading-7 text-ink-muted">
              Nothing here is a bundle you have to take whole. Add what belongs on your
              day, and the rest stays out of the conversation.
            </p>
          </div>
        </div>

        <PlanGroups groups={content.planGroups} />
        <GuideLink {...content.guide} />
      </Container>
    </Section>
  );
}
