import Link from "next/link";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { workHero, galleryIntro, whatToLookFor, workFinalCta } from "@/lib/content/work";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function WorkPage() {
  return (
    <>
      <section className={`${container} pb-10 pt-20 sm:pt-28`}>
        <p className="font-accent text-sm italic text-jade">{workHero.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
          {workHero.h1}
        </h1>
        <p className="mt-5 max-w-xl font-body text-base text-ink/65 sm:text-lg">{workHero.subhead}</p>
        <p className="mt-4 max-w-xl font-body text-sm text-ink/45">{galleryIntro.body}</p>
      </section>

      <section className={`${container} pb-20 sm:pb-28`}>
        <WorkGallery />
      </section>

      <section className="bg-ink/[0.03] py-20 sm:py-28">
        <div className={container}>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            What to look for
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {whatToLookFor.map((item) => (
              <li key={item.title} className="border-t border-ink/10 pt-4">
                <h3 className="font-display text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 font-body text-sm text-ink/60">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className={`${container} flex flex-col items-start gap-6`}>
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
            {workFinalCta.h2}
          </h2>
          <Link
            href="/check-availability"
            className="rounded-full bg-pomegranate px-7 py-3.5 font-body text-sm font-semibold text-ivory"
          >
            {workFinalCta.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
