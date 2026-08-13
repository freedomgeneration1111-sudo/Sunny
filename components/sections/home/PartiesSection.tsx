import { MediaFrame } from "@/components/media/MediaFrame";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { partiesSection as content } from "@/lib/content/eventSections";
import { Capabilities, SectionActions, SectionIntro } from "./shared";

/**
 * Rhythm: duration first. For most celebrations the length of the night really
 * is the first decision, so it leads. Prices live on /pricing.
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

        <div className="mt-14 grid gap-px overflow-hidden rounded-media border border-border bg-border md:grid-cols-3">
          {content.durations.map((duration) => (
            <div key={duration.label} className="bg-surface p-7 md:p-8">
              <p className="font-display text-4xl font-black tracking-[-.04em]">{duration.label}</p>
              <p className="mt-4 leading-7 text-ink-muted">{duration.note}</p>
            </div>
          ))}
        </div>

        <Capabilities items={content.capabilities} />
        <SectionActions
          pricing={content.pricing}
          guides={content.guides}
          eventType="Party / Celebration"
        />
      </Container>
    </Section>
  );
}
