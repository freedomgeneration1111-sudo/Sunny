import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { weddingsSection as content } from "@/lib/content/eventSections";
import { Capabilities, SectionActions, SectionIntro } from "./shared";

/**
 * Rhythm: a horizontal ceremony-to-reception spine. The day reads left to right
 * first, so the services below land as answers to moments already pictured.
 */
export function WeddingsSection() {
  return (
    <Section theme="alt" id={content.anchor}>
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:gap-16">
          <SectionIntro eyebrow={content.eyebrow} title={content.title} lead={content.lead} />
          <MediaFrame
            asset={content.media}
            sizes="(min-width:1024px) 46vw,100vw"
            aspectRatioOverride="3/2"
          />
        </Reveal>

        {/* The spine. Horizontal scroll on phones, five columns above. */}
        <ol className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible">
          {content.moments.map((moment, index) => (
            <Reveal
              as="li"
              index={index}
              key={moment.label}
              className="relative w-[76vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto lg:pr-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-black text-on-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-border lg:block" />
              </div>
              <h3 className="mt-6 text-xl font-extrabold">{moment.label}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted lg:pr-4">{moment.note}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <MediaFrame
            asset={content.detailMedia}
            sizes="(min-width:1024px) 42vw,100vw"
            aspectRatioOverride="4/3"
          />
          <div>
            <h3 className="font-display text-3xl font-bold leading-tight tracking-[-.03em]">
              Take only what your wedding needs.
            </h3>
            <p className="mt-5 max-w-[58ch] leading-7 text-ink-muted">
              Nothing here is a bundle you have to take whole. Book one service or several — the
              difference is that several are planned together.
            </p>
            <Capabilities items={content.capabilities} />
          </div>
        </Reveal>

        <SectionActions pricing={content.pricing} guides={content.guides} eventType="Wedding" />
      </Container>
    </Section>
  );
}
