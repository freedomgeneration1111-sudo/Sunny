import Link from "next/link";
import { CueFrame } from "@/components/brand/CueFrame";
import { MediaFrame } from "@/components/media/MediaFrame";
import { TeamSlot } from "@/components/sections/TeamSlot";
import { media } from "@/lib/media";
import { aboutHero, disciplines, teamBlock, dfwSection, aboutFinalCta } from "@/lib/content/about";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const teamCardFields = ["Name", "Specialty", "Relevant experience", "South Asian experience"] as const;

export default function AboutPage() {
  return (
    <>
      <section className={`${container} pb-16 pt-20 sm:pt-28`}>
        <p className="font-accent text-sm italic text-jade">{aboutHero.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
          {aboutHero.h1}
        </h1>
        <p className="mt-5 max-w-xl font-body text-base text-ink/65 sm:text-lg">{aboutHero.subhead}</p>
      </section>

      <section className={`${container} pb-16`}>
        <MediaFrame asset={media.processCoordination} className="rounded-sm" sizes="100vw" />
      </section>

      <section className={`${container} grid gap-10 pb-20 sm:pb-28 lg:grid-cols-2 lg:gap-16`}>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {disciplines.h2}
        </h2>
        <p className="font-body text-base text-ink/65">{disciplines.body}</p>
      </section>

      {/* TEAM BLOCK */}
      <section className="bg-ink/[0.03] py-20 sm:py-28">
        <div className={container}>
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {teamBlock.heading}
            </h2>
            <p className="mt-3 font-body text-sm text-ink/55">{teamBlock.body}</p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {teamBlock.roles.map((role) => (
              <TeamSlot key={role} role={role} fields={teamCardFields} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${container} py-20 sm:py-28`}>
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {dfwSection.h2}
          </h2>
          <p className="mt-3 font-body text-base text-ink/65">{dfwSection.body}</p>
        </div>
      </section>

      <section className="bg-jade py-20 sm:py-28">
        <div className={`${container} flex flex-col items-start gap-6`}>
          <CueFrame className="h-10 w-10 text-ivory" withCenter />
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
            {aboutFinalCta.h2}
          </h2>
          <Link
            href="/check-availability"
            className="rounded-full bg-ivory px-7 py-3.5 font-body text-sm font-semibold text-jade transition-transform hover:scale-[1.03]"
          >
            {aboutFinalCta.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
