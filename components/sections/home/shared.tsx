import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Typography";
import { getGuide } from "@/lib/content/guides";

/**
 * Shared pieces for the homepage event sections. Each section owns its own
 * rhythm; these cover only what genuinely repeats — the capability summary and
 * the closing actions.
 */

export function Capabilities({
  items,
  tone = "light",
  title = "What we can cover",
}: {
  items: readonly string[];
  tone?: "light" | "dark";
  title?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className="mt-12">
      <h3 className={`text-xs font-extrabold uppercase tracking-[.16em] ${dark ? "text-brand-accent" : "text-brand-primary"}`}>
        {title}
      </h3>
      <ul className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className={`flex gap-4 border-t pt-3 leading-7 ${dark ? "border-on-brand/15 text-on-brand/72" : "border-border text-ink-muted"}`}
          >
            <span aria-hidden="true" className={dark ? "font-black text-brand-accent" : "font-black text-brand-primary"}>
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The closing block of every event section: pricing for this event type, the
 * conversion CTA, and any planning guides that genuinely help here.
 */
export function SectionActions({
  pricing,
  guides = [],
  tone = "light",
  eventType,
}: {
  pricing: { href: string; label: string };
  guides?: readonly string[];
  tone?: "light" | "dark";
  eventType: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`mt-12 border-t pt-8 ${dark ? "border-on-brand/15" : "border-border"}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Button href={pricing.href}>{pricing.label}</Button>
        <Button
          href={`/check-availability?event=${encodeURIComponent(eventType)}`}
          variant="secondary"
          className={dark ? "!border-on-brand/40 !text-on-brand hover:!border-on-brand" : ""}
        >
          Check Availability
        </Button>
      </div>

      {guides.length ? (
        <p className={`mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${dark ? "text-on-brand/55" : "text-ink-muted"}`}>
          <span className="font-bold">Planning help:</span>
          {guides.map((slug) => {
            const guide = getGuide(slug);
            if (!guide) return null;
            return (
              <Link
                key={slug}
                href={`/guides/${slug}`}
                className={`min-h-11 items-center underline underline-offset-4 hover:text-brand-primary ${dark ? "hover:!text-brand-accent" : ""}`}
              >
                {guide.title}
              </Link>
            );
          })}
        </p>
      ) : null}
    </div>
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
      <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-.035em] text-balance">
        {title}
      </h2>
      <p className={`mt-6 max-w-[62ch] text-lg leading-8 ${tone === "dark" ? "text-on-brand/68" : "text-ink-muted"}`}>
        {lead}
      </p>
    </div>
  );
}
