import { CheckAvailabilityForm } from "@/components/sections/CheckAvailabilityForm";
import { checkAvailabilityHero } from "@/lib/content/checkAvailability";

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function CheckAvailabilityPage() {
  return (
    <section className={`${container} py-20 sm:py-28`}>
      <p className="font-accent text-sm italic text-jade">{checkAvailabilityHero.eyebrow}</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {checkAvailabilityHero.h1}
      </h1>
      <p className="mt-4 max-w-lg font-body text-base text-ink/65">{checkAvailabilityHero.subhead}</p>

      <div className="mt-12">
        <CheckAvailabilityForm />
      </div>
    </section>
  );
}
