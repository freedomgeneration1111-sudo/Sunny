import Link from "next/link";
import { PlanItemCard } from "@/components/planning/PlanItemCard";
import { Eyebrow } from "@/components/ui/Typography";
import type { PlanGroup } from "@/lib/content/eventSections";

/**
 * Shared building blocks for the homepage event sections. Each section owns its
 * own rhythm; these only cover the parts that genuinely repeat.
 */

/** Match the column count to the group size so short groups don't leave a hole. */
function gridColumns(count: number) {
  if (count <= 2) return "sm:grid-cols-2";
  if (count === 3) return "sm:grid-cols-2 xl:grid-cols-3";
  return "sm:grid-cols-2 xl:grid-cols-4";
}

export function PlanGroups({ groups, tone = "light" }: { groups: readonly PlanGroup[]; tone?: "light" | "dark" }) {
  return (
    <div className="mt-12 space-y-10">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h4 className="text-lg font-extrabold">{group.title}</h4>
            {group.note ? (
              <p className={`text-sm ${tone === "dark" ? "text-on-brand/55" : "text-ink-muted"}`}>{group.note}</p>
            ) : null}
          </div>
          <div className={`mt-5 grid gap-4 ${gridColumns(group.ids.length)}`}>
            {group.ids.map((id) => (
              <PlanItemCard key={id} id={id} compact />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GuideLink({ href, label, tone = "light" }: { href: string; label: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={`group mt-12 inline-flex min-h-12 items-center gap-3 border-b-2 pb-1 text-base font-extrabold transition-colors ${
        tone === "dark"
          ? "border-on-brand/25 text-on-brand hover:border-brand-accent hover:text-brand-accent"
          : "border-border text-ink hover:border-brand-primary hover:text-brand-primary"
      }`}
    >
      {label}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  lead,
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow className={tone === "dark" ? "!text-brand-accent" : ""}>{eyebrow}</Eyebrow>
      <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-.035em] text-balance">
        {title}
      </h3>
      <p className={`mt-6 max-w-[62ch] text-lg leading-8 ${tone === "dark" ? "text-on-brand/68" : "text-ink-muted"}`}>
        {lead}
      </p>
    </div>
  );
}
