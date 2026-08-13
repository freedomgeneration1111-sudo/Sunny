import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DisplayHeading, Eyebrow, Lead } from "@/components/ui/Typography";
import { MediaFrame } from "@/components/media/MediaFrame";
import type { MediaAsset } from "@/lib/media";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  media?: MediaAsset;
  variant?: "split" | "fullBleed" | "textLed";
  secondaryHref?: string;
  secondaryLabel?: string;
  inquiryEvent?: string;
};

export function PageHero({
  eyebrow,
  title,
  body,
  media,
  variant = "split",
  secondaryHref = "/pricing",
  secondaryLabel = "View Pricing",
  inquiryEvent,
}: PageHeroProps) {
  const inquiryHref = inquiryEvent
    ? `/check-availability?event=${encodeURIComponent(inquiryEvent)}`
    : "/check-availability";

  if (variant === "textLed") {
    return (
      <section className="relative overflow-hidden border-b border-border bg-canvas py-[var(--section-y)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[44px] border-brand-primary/10" aria-hidden="true" />
        <Container variant="reading" className="relative">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)]">{title}</DisplayHeading>
          <Lead className="mt-6">{body}</Lead>
        </Container>
      </section>
    );
  }

  if (variant === "fullBleed" && media) {
    return (
      <section className="relative isolate flex min-h-[min(82svh,780px)] items-end overflow-hidden bg-ink text-on-brand">
        <Image src={media.src} alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: media.objectPosition }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,10,.96)_0%,rgba(8,9,10,.78)_45%,rgba(8,9,10,.18)_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,9,10,.78)_0%,transparent_60%,rgba(8,9,10,.25)_100%)]" />
        <Container variant="wide" className="relative z-10 py-14 md:py-20 lg:py-24">
          <div className="max-w-[760px]">
            <Eyebrow>{eyebrow}</Eyebrow>
            <DisplayHeading className="mt-5 text-[clamp(3rem,6vw,5.6rem)]">{title}</DisplayHeading>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-on-brand/75">{body}</p>
            <HeroActions inquiryHref={inquiryHref} secondaryHref={secondaryHref} secondaryLabel={secondaryLabel} dark />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border-b border-border bg-ink text-on-brand">
      <Container variant="wide" className="grid min-h-[min(78svh,760px)] items-center gap-10 py-10 md:grid-cols-[.88fr_1.12fr] md:py-12 lg:gap-16">
        <div className="z-10 max-w-2xl py-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading className="mt-5 text-[clamp(3rem,6vw,5.6rem)]">{title}</DisplayHeading>
          <p className="mt-6 max-w-xl text-lg leading-8 text-on-brand/70">{body}</p>
          <HeroActions inquiryHref={inquiryHref} secondaryHref={secondaryHref} secondaryLabel={secondaryLabel} dark />
        </div>
        {media ? <MediaFrame asset={media} priority className="w-full" sizes="(min-width:768px) 56vw,100vw" /> : null}
      </Container>
    </section>
  );
}

function HeroActions({ inquiryHref, secondaryHref, secondaryLabel, dark }: { inquiryHref: string; secondaryHref: string; secondaryLabel: string; dark?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button href={inquiryHref}>Check Availability</Button>
      <Button href={secondaryHref} variant={dark ? "outline" : "secondary"}>
        {secondaryLabel} <span className="ml-2" aria-hidden="true">→</span>
      </Button>
    </div>
  );
}
