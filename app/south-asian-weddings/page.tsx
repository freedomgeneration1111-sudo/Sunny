import Link from "next/link";
import { CueFrame } from "@/components/brand/CueFrame";
import { MediaFrame } from "@/components/media/MediaFrame";
import { media } from "@/lib/media";
import {
  saHero,
  knowTheFlow,
  multiDay,
  familySection,
  coordinationSection,
  proofBlock,
  saFinalCta,
} from "@/lib/content/southAsianWeddings";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function SouthAsianWeddingsPage() {
  return (
    <>
      <section className="relative flex min-h-[80svh] items-end overflow-hidden bg-ink">
        <MediaFrame asset={media.saCeremonyWide} className="absolute inset-0 h-full w-full" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className={`${container} relative pb-14 pt-32`}>
          <p className="font-accent text-sm italic text-marigold">{saHero.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[0.97] tracking-tight text-ivory sm:text-6xl">
            {saHero.h1}
          </h1>
          <p className="mt-5 max-w-lg font-body text-base text-ivory/80 sm:text-lg">{saHero.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/check-availability" className="rounded-full bg-pomegranate px-7 py-3.5 font-body text-sm font-semibold text-ivory">
              {saHero.primaryCta}
            </Link>
            <Link href="/work" className="rounded-full border border-ivory/30 px-7 py-3.5 font-body text-sm font-semibold text-ivory">
              {saHero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className={`${container} grid gap-8 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16`}>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {knowTheFlow.h2}
        </h2>
        <div className="space-y-4 font-body text-base text-ink/65">
          <p>{knowTheFlow.body}</p>
          <p>{knowTheFlow.body2}</p>
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory sm:py-28">
        <div className={container}>
          <p className="font-accent text-sm italic text-marigold">{multiDay.eyebrow}</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {multiDay.h2}
          </h2>
          <p className="mt-4 max-w-2xl font-body text-base text-ivory/65">{multiDay.body}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MediaFrame asset={media.saMehndiColor} className="rounded-sm" />
            <MediaFrame asset={media.saEntranceReaction} className="rounded-sm" />
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {multiDay.items.map((item, i) => (
              <li key={item.title} className="border-t border-ivory/15 pt-4">
                <span className="font-accent text-sm italic text-pomegranate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-1.5 font-body text-sm text-ivory/60">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${container} grid gap-8 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16`}>
        <MediaFrame asset={media.saGenerations} className="rounded-sm lg:order-2" />
        <div className="lg:order-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {familySection.h2}
          </h2>
          <p className="mt-4 font-body text-base text-ink/65">{familySection.body}</p>
        </div>
      </section>

      <section className="bg-jade/10 py-20 sm:py-28">
        <div className={`${container} max-w-2xl`}>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {coordinationSection.h2}
          </h2>
          <p className="mt-4 font-body text-base text-ink/65">{coordinationSection.body}</p>
          <p className="mt-3 font-body text-xs italic text-ink/40">{coordinationSection.note}</p>
        </div>
      </section>

      <section className="border-y border-dashed border-ink/15 py-16">
        <div className={container}>
          <p className="font-accent text-sm italic text-ink/50">{proofBlock.eyebrow}</p>
          <p className="mt-2 max-w-xl font-body text-sm text-ink/55">{proofBlock.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {proofBlock.needed.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 rounded-sm bg-ink/5 px-2.5 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-ink/50"
              >
                <CueFrame className="h-2.5 w-2.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-pomegranate py-20 sm:py-28">
        <div className={`${container} flex flex-col items-start gap-6`}>
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
            {saFinalCta.h2}
          </h2>
          <p className="max-w-md font-body text-base text-ivory/85">{saFinalCta.body}</p>
          <Link
            href="/check-availability"
            className="rounded-full bg-ivory px-7 py-3.5 font-body text-sm font-semibold text-pomegranate"
          >
            {saFinalCta.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
