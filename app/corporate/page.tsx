import Link from "next/link";
import { MediaFrame } from "@/components/media/MediaFrame";
import { media } from "@/lib/media";
import { corporateHero, makeTheRoomWork, corporateProof, corporateFinalCta } from "@/lib/content/corporate";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function CorporatePage() {
  return (
    <>
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink">
        <MediaFrame asset={media.corporateStageWide} className="absolute inset-0 h-full w-full" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className={`${container} relative pb-14 pt-28`}>
          <p className="font-accent text-sm italic text-marigold">{corporateHero.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[0.97] tracking-tight text-ivory sm:text-6xl">
            {corporateHero.h1}
          </h1>
          <p className="mt-5 max-w-lg font-body text-base text-ivory/80 sm:text-lg">{corporateHero.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/check-availability" className="rounded-full bg-pomegranate px-7 py-3.5 font-body text-sm font-semibold text-ivory">
              {corporateHero.primaryCta}
            </Link>
            <Link href="/check-availability" className="rounded-full border border-ivory/30 px-7 py-3.5 font-body text-sm font-semibold text-ivory">
              {corporateHero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className={`${container} py-20 sm:py-28`}>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {makeTheRoomWork.h2}
          </h2>
          <p className="mt-4 font-body text-base text-ink/65">{makeTheRoomWork.body}</p>
        </div>
        <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {makeTheRoomWork.items.map((item, i) => (
            <li key={item.title} className="border-t border-ink/10 pt-4">
              <span className="font-accent text-sm italic text-pomegranate">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-display text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 font-body text-sm text-ink/60">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-dashed border-ink/15 py-16">
        <div className={`${container} max-w-xl text-center`}>
          <h2 className="font-display text-2xl font-semibold text-ink/70">{corporateProof.h2}</h2>
          <p className="mt-3 font-body text-xs text-ink/40">{corporateProof.note}</p>
        </div>
      </section>

      <section className="bg-jade py-20 sm:py-28">
        <div className={`${container} flex flex-col items-start gap-6`}>
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
            {corporateFinalCta.h2}
          </h2>
          <Link
            href="/check-availability"
            className="rounded-full bg-ivory px-7 py-3.5 font-body text-sm font-semibold text-jade"
          >
            {corporateFinalCta.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
