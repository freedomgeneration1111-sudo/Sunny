import { MediaFrame } from "@/components/media/MediaFrame";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { corporateSection as content } from "@/lib/content/eventSections";
import { SectionActions, SectionIntro } from "./shared";

/**
 * Rhythm: structural and operational rather than celebratory. Corporate buyers
 * are choosing what the room needs, so this section must not read like the
 * wedding and party sections above it.
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

        <div className="mt-14 grid gap-px overflow-hidden rounded-media border border-border bg-border md:grid-cols-2 xl:grid-cols-3">
          {content.jobs.map((job) => (
            <article key={job.title} className="bg-canvas p-7">
              <span className="font-display text-2xl font-black text-brand-primary">{job.code}</span>
              <h3 className="mt-4 text-xl font-extrabold">{job.title}</h3>
              <p className="mt-3 leading-7 text-ink-muted">{job.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-media bg-ink p-7 text-on-brand md:p-10">
          <h3 className="font-display text-3xl font-bold tracking-[-.03em]">{content.logistics.title}</h3>
          <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {content.logistics.items.map((item) => (
              <li key={item} className="flex gap-4 border-t border-on-brand/15 pt-4 leading-7">
                <span aria-hidden="true" className="font-black text-brand-accent">✓</span>
                <span className="text-on-brand/72">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <SectionActions
          pricing={content.pricing}
          guides={content.guides}
          eventType="Corporate / Community"
        />
      </Container>
    </Section>
  );
}
