import Link from "next/link";
import { CueFrame } from "@/components/brand/CueFrame";
import { MediaFrame } from "@/components/media/MediaFrame";
import { DevFlag } from "@/components/media/DevFlag";
import { FeaturedWorkGallery } from "@/components/sections/FeaturedWorkGallery";
import { media } from "@/lib/media";
import {
  hero,
  credibility,
  eventChooser,
  servicesIntro,
  services,
  featuredWork,
  packagesPreview,
  process,
  socialContent,
  proof,
  finalCta,
} from "@/lib/content/home";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
        <MediaFrame
          asset={media.heroReception}
          className="absolute inset-0 h-full w-full"
          sizes="100vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className={`${container} relative pb-14 pt-32 sm:pb-20`}>
          <div className="max-w-2xl animate-[var(--animate-headline-in)]">
            <p className="font-accent text-sm italic tracking-wide text-marigold sm:text-base">
              {hero.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ivory sm:text-7xl">
              {hero.h1}
            </h1>
            <p className="mt-5 max-w-lg font-body text-base text-ivory/80 sm:text-lg">
              {hero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/check-availability"
                className="rounded-full bg-pomegranate px-7 py-3.5 font-body text-sm font-semibold text-ivory transition-transform hover:scale-[1.03]"
              >
                {hero.primaryCta}
              </Link>
              <Link
                href="/work"
                className="rounded-full border border-ivory/30 px-7 py-3.5 font-body text-sm font-semibold text-ivory transition-colors hover:border-ivory"
              >
                {hero.secondaryCta}
              </Link>
            </div>
            <p className="mt-6 font-body text-sm text-ivory/50">{hero.microcopy}</p>
          </div>
        </div>
      </section>

      {/* CREDIBILITY STRIP */}
      <section className="border-b border-ink/10 bg-ivory">
        <div className={`${container} flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6`}>
          {credibility.items.map((item) => (
            <span key={item} className="font-body text-xs font-semibold uppercase tracking-widest text-ink/50">
              {item}
            </span>
          ))}
          <DevFlag
            reason="individual experience isn't documented yet — confirm real combined-years figure with Sunny before this ships to a real audience"
            className="font-body text-xs font-semibold uppercase tracking-widest text-ink/50"
          >
            50+ Combined Years
          </DevFlag>
        </div>
      </section>

      {/* EVENT CHOOSER */}
      <section className={`${container} py-20 sm:py-28`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventChooser.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col overflow-hidden rounded-sm ${i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}`}
            >
              <MediaFrame
                asset={media[item.mediaKey]}
                className="rounded-sm transition-transform duration-500 group-hover:scale-[1.04]"
                aspectRatioOverride={i === 0 ? "16/11" : "4/5"}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl font-semibold text-ivory">{item.title}</h3>
                <p className="mt-1.5 max-w-[38ch] font-body text-sm text-ivory/75">{item.body}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wide text-marigold">
                  {item.linkLabel}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className={`${container} scroll-mt-20 py-20 sm:py-28`}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-md">
            <p className="font-accent text-sm italic text-jade">{servicesIntro.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {servicesIntro.h2}
            </h2>
            <p className="mt-4 font-body text-base text-ink/65">{servicesIntro.body}</p>
            <Link
              href="/check-availability"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-body text-sm font-semibold text-ivory transition-colors hover:bg-ink/85"
            >
              {servicesIntro.cta}
            </Link>
          </div>

          <ul className="grid flex-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {services.map((s, i) => (
              <li key={s.title} className="border-t border-ink/10 pt-4">
                <span className="font-accent text-sm italic text-pomegranate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 font-body text-sm text-ink/60">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="bg-ink py-20 text-ivory sm:py-28">
        <div className={container}>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-lg">
              <p className="font-accent text-sm italic text-marigold">{featuredWork.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {featuredWork.h2}
              </h2>
              <p className="mt-4 font-body text-base text-ivory/65">{featuredWork.body}</p>
            </div>
            <Link
              href="/work"
              className="inline-block shrink-0 rounded-full border border-ivory/30 px-6 py-3 font-body text-sm font-semibold transition-colors hover:border-ivory"
            >
              {featuredWork.cta}
            </Link>
          </div>

          <div className="mt-10">
            <FeaturedWorkGallery />
          </div>

          <p className="mt-6 font-body text-xs text-ivory/40">{featuredWork.note}</p>
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section className={`${container} py-20 sm:py-28`}>
        <div className="max-w-2xl">
          <p className="font-accent text-sm italic text-jade">{packagesPreview.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {packagesPreview.h2}
          </h2>
          <p className="mt-4 font-body text-base text-ink/65">{packagesPreview.body}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {packagesPreview.columns.map((c) => (
            <div key={c.title} className="rounded-sm border border-ink/10 p-6">
              <CueFrame className="h-6 w-6 text-pomegranate" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 font-body text-sm text-ink/60">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/check-availability"
            className="inline-block w-fit rounded-full bg-pomegranate px-6 py-3 font-body text-sm font-semibold text-ivory"
          >
            {packagesPreview.cta}
          </Link>
          <p className="font-body text-xs text-ink/45">{packagesPreview.note}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-marigold/10 py-20 sm:py-28">
        <div className={container}>
          <p className="font-accent text-sm italic text-pomegranate">{process.eyebrow}</p>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            {process.steps.map((step) => (
              <div key={step.number}>
                <span className="font-display text-5xl font-semibold text-ink/15">{step.number}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 font-body text-sm text-ink/60">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL CONTENT */}
      <section className={`${container} py-20 sm:py-28`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 max-w-md lg:order-1">
            <p className="font-accent text-sm italic text-jade">{socialContent.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {socialContent.h2}
            </h2>
            <p className="mt-4 font-body text-base text-ink/65">{socialContent.body}</p>
            <Link
              href="/check-availability"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-body text-sm font-semibold text-ivory"
            >
              {socialContent.cta}
            </Link>
          </div>
          <div className="order-1 mx-auto w-full max-w-[280px] lg:order-2">
            <MediaFrame asset={media.socialContentVertical} className="rounded-sm" sizes="(min-width: 1024px) 25vw, 80vw" />
          </div>
        </div>
      </section>

      {/* PROOF PLACEHOLDER */}
      <section className="border-y border-dashed border-ink/15 bg-ivory py-16">
        <div className={`${container} max-w-xl text-center`}>
          <p className="font-accent text-sm italic text-ink/50">{proof.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink/80">{proof.h2}</h2>
          <p className="mt-3 font-body text-sm text-ink/50">{proof.body}</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-pomegranate py-20 sm:py-28">
        <div className={`${container} flex flex-col items-start gap-6`}>
          <CueFrame className="h-10 w-10 text-ivory" withCenter />
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
            {finalCta.h2}
          </h2>
          <p className="max-w-md font-body text-base text-ivory/85">{finalCta.body}</p>
          <Link
            href="/check-availability"
            className="rounded-full bg-ivory px-7 py-3.5 font-body text-sm font-semibold text-pomegranate transition-transform hover:scale-[1.03]"
          >
            {finalCta.primaryCta}
          </Link>
        </div>
      </section>
    </>
  );
}
