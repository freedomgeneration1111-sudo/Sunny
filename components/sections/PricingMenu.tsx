"use client";

import Link from "next/link";
import { PlanItemCard } from "@/components/planning/PlanItemCard";
import { usePlan } from "@/components/planning/PlanProvider";
import { track } from "@/lib/analytics";
import { planItems, type PlanItemId } from "@/lib/plan";

const groups = [
  {
    slug: "weddings",
    title: "Weddings",
    body: "Single-day wedding starting points, from a reception-only plan to a ceremony and reception that share one timeline.",
    ids: ["wedding-dj-core", "wedding-dj-ceremony", "wedding-production", "ceremony-sound"],
  },
  {
    slug: "shaadi",
    title: "Shaadi Celebrations",
    body: "Multi-event celebrations are scoped around the events your family is actually planning. These are entry points, not a fixed sequence.",
    ids: ["sa-single-event", "sa-wedding-reception", "sa-full-celebration", "sa-baraat", "south-asian-media"],
  },
  {
    slug: "parties",
    title: "Parties & Celebrations",
    body: "Birthdays, showers, anniversaries, graduations, and family celebrations. Time block first, then anything you want documented.",
    ids: ["party-3h", "party-4h", "party-5h", "party-photography", "party-highlight-video"],
  },
  {
    slug: "corporate",
    title: "Corporate & Community",
    body: "Organised around the job the room has to do — entertainment, AV, documentation, or a combination.",
    ids: ["corporate-dj", "corporate-av-basic", "corporate-half-day", "corporate-full-day", "corporate-media", "corporate-livestream"],
  },
  {
    slug: "photo-video",
    title: "Photo + Video",
    body: "Photography, filmmaking, combined coverage, and the sessions or short-form edits that sit either side of the event.",
    ids: ["photography", "videography", "photo-video", "engagement-session", "social-content"],
  },
  {
    slug: "enhancements",
    title: "Enhancements",
    body: "Optional guest experiences and venue-dependent effects to consider once the event foundation is clear. Every effect needs venue approval.",
    ids: ["digital-booth", "booth-360", "clouds", "cold-sparks", "uplighting", "monogram", "led-wall"],
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  title: string;
  body: string;
  ids: readonly PlanItemId[];
}>;

export function PricingMenu() {
  const {
    selected,
    remove,
    clear,
    estimatedAnchor,
    customItemCount,
    inquiryHref,
  } = usePlan();

  return (
    <div>
      <div className="rounded-card border-2 border-brand-primary bg-brand-primary/10 p-4 text-sm font-extrabold text-ink">
        Prototype review pricing · Provisional and not approved for production publication. Items marked <span className="text-brand-primary">Draft</span> were created for layout review; their scope and price are not decided.
      </div>

      <div className="mt-10 space-y-14">
        {groups.map((group) => (
          <section key={group.title} aria-labelledby={"pricing-" + group.slug}>
            <div className="max-w-[760px]">
              <h3 id={"pricing-" + group.slug} className="text-2xl font-extrabold md:text-3xl">
                {group.title}
              </h3>
              <p className="mt-3 leading-7 text-ink-muted">{group.body}</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.ids.map((id) => <PlanItemCard key={id} id={id} compact />)}
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="plan-summary-heading" className="mt-14 rounded-media bg-ink p-6 text-on-brand md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 id="plan-summary-heading" className="text-2xl font-extrabold">Your planning summary</h3>
            <p className="mt-2 max-w-[70ch] text-sm text-on-brand/65">
              Summable development anchors appear as a subtotal. Custom-scope selections stay separate; no discounts, taxes, fees, or compatible combinations are inferred.
            </p>
          </div>
          {selected.length ? <button type="button" onClick={clear} className="min-h-11 rounded-control border border-on-brand/25 px-4 text-sm font-bold hover:border-on-brand">Clear plan</button> : null}
        </div>

        {selected.length ? (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {selected.map((id) => (
              <li key={id} className="flex items-center justify-between gap-4 rounded-control border border-on-brand/15 bg-on-brand/[.05] px-4 py-3">
                <span className="text-sm font-bold">{planItems[id].label}</span>
                <button type="button" onClick={() => remove(id)} aria-label={`Remove ${planItems[id].label}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl text-on-brand/65 hover:bg-on-brand/10 hover:text-on-brand">×</button>
              </li>
            ))}
          </ul>
        ) : <p className="mt-6 rounded-control border border-dashed border-on-brand/20 p-5 text-on-brand/65">Choose an item above to start a plan.</p>}

        <div className="mt-7 flex flex-col gap-4 border-t border-on-brand/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-on-brand/55">DEV planning subtotal</p>
            <p className="mt-1 text-3xl font-black tabular-nums">{estimatedAnchor > 0 ? `$${estimatedAnchor.toLocaleString()}` : "—"}</p>
            {customItemCount ? <p className="mt-2 text-sm font-bold text-brand-accent">+ {customItemCount} custom-scope {customItemCount === 1 ? "selection" : "selections"}</p> : null}
          </div>
          <Link onClick={() => track("pricing_to_inquiry", { count: selected.length })} href={inquiryHref} className="inline-flex min-h-12 items-center justify-center rounded-control bg-brand-primary px-6 text-sm font-extrabold text-on-brand hover:bg-brand-primary-hover">
            Continue to Availability <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
