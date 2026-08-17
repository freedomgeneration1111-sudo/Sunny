import { MediaFrame } from "@/components/media/MediaFrame";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { asianWeddingsSection as content } from "@/lib/content/eventSections";
import { Capabilities, SectionActions, SectionIntro } from "./shared";

/**
 * Rhythm: the dark cinematic beat of the page. An event-sequence rail carries
 * the cultural point — these are common examples, never a required order —
 * followed by an editorial pair and the shared-planning argument.
 */
export function AsianWeddingsSection() {
  return (
    <Section theme="dark" id={content.anchor}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-16">
          <div>
            <SectionIntro
              eyebrow={content.eyebrow}
              title={content.title}
              lead={content.lead}
              tone="dark"
            />
            <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-extrabold uppercase tracking-[.14em] text-brand-accent">
              {content.languages.map((language, index) => (
                <span key={language}>
                  {language}
                  {index < content.languages.length - 1 ? (
                    <span aria-hidden="true" className="ml-3 text-on-brand/30">·</span>
                  ) : null}
                </span>
              ))}
            </p>
          </div>
          <MediaFrame
            asset={content.media}
            sizes="(min-width:1024px) 44vw,100vw"
            aspectRatioOverride="3/2"
          />
        </div>

        {/* Sequence rail. The disclaimer is part of the design, not a footnote. */}
        <div className="mt-16">
          <p className="max-w-[60ch] rounded-control border border-brand-accent/40 bg-brand-accent/10 px-5 py-4 text-sm font-bold leading-6 text-brand-accent">
            {content.sequenceNote}
          </p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-media bg-on-brand/15 sm:grid-cols-2 lg:grid-cols-3">
            {content.sequence.map((event) => (
              <li key={event.label} className="bg-ink p-6 md:p-7">
                <h3 className="text-xl font-extrabold">{event.label}</h3>
                <p className="mt-3 text-sm leading-6 text-on-brand/60">{event.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {content.editorialMedia.map((asset) => (
            <MediaFrame
              key={asset.id}
              asset={asset}
              sizes="(min-width:640px) 46vw,100vw"
              aspectRatioOverride="4/3"
            />
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <h3 className="font-display text-3xl font-bold leading-tight tracking-[-.03em]">
              {content.continuity.title}
            </h3>
            <p className="mt-5 leading-8 text-on-brand/68">{content.continuity.body}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {content.continuity.points.map((point) => (
              <li key={point.title} className="rounded-card border border-on-brand/15 bg-on-brand/[.04] p-6">
                <h3 className="text-lg font-extrabold">{point.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-brand/60">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <Capabilities items={content.capabilities} tone="dark" />
        <SectionActions
          pricing={content.pricing}
          guides={content.guides}
          tone="dark"
          eventType="Asian Wedding"
        />
      </Container>
    </Section>
  );
}
