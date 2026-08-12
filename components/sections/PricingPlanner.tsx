"use client";

import { useState } from "react";
import { PlanItemCard } from "@/components/planning/PlanItemCard";
import { usePlan } from "@/components/planning/PlanProvider";
import { track } from "@/lib/analytics";
import { planItems, type PlanItemId } from "@/lib/plan";

const groups = {
  Wedding: ["wedding-dj-core", "wedding-dj-ceremony", "wedding-production", "photography", "videography", "photo-video"],
  "South Asian": ["south-asian-media", "wedding-dj-core", "photo-video", "wedding-production"],
  Party: ["party-3h", "party-4h", "party-5h", "digital-booth", "booth-360"],
  Corporate: ["corporate-dj", "corporate-half-day", "corporate-full-day"],
  Enhancements: ["digital-booth", "booth-360", "clouds", "cold-sparks"],
} as const satisfies Record<string, readonly PlanItemId[]>;

type GroupName = keyof typeof groups;

export function PricingPlanner() {
  const [tab, setTab] = useState<GroupName>("Wedding");
  const { selected, remove, clear, estimatedAnchor, inquiryHref } = usePlan();

  return (
    <div>
      <div className="rounded-card border-2 border-brand-primary bg-brand-primary/10 p-4 text-sm font-extrabold text-ink">
        Prototype review pricing · Provisional and not approved for production publication.
      </div>
      <div role="tablist" aria-label="Event pricing" className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(groups) as GroupName[]).map((name) => (
          <button
            key={name}
            id={`pricing-tab-${name.replaceAll(" ", "-")}`}
            type="button"
            role="tab"
            aria-selected={tab === name}
            aria-controls="pricing-panel"
            onClick={() => { setTab(name); track("pricing_tab_change", { tab: name }); }}
            className={`min-h-12 shrink-0 rounded-control px-4 font-extrabold ${tab === name ? "bg-ink text-on-brand" : "border border-border bg-surface hover:border-ink"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div id="pricing-panel" role="tabpanel" aria-labelledby={`pricing-tab-${tab.replaceAll(" ", "-")}`} className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups[tab].map((id) => <PlanItemCard key={id} id={id} />)}
      </div>
      <section aria-labelledby="plan-summary-heading" className="mt-10 rounded-media bg-ink p-6 text-on-brand md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 id="plan-summary-heading" className="text-2xl font-extrabold">Your planning summary</h3>
            <p className="mt-2 text-sm text-on-brand/65">Anchors are added for visibility; no discounts, taxes, fees, or incompatible combinations are inferred.</p>
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
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-on-brand/55">DEV planning anchor</p><p className="mt-1 text-3xl font-black tabular-nums">{selected.length ? `$${estimatedAnchor.toLocaleString()}` : "—"}</p></div>
          <a onClick={() => track("pricing_to_inquiry", { count: selected.length })} href={inquiryHref} className="inline-flex min-h-12 items-center justify-center rounded-control bg-brand-primary px-6 text-sm font-extrabold text-on-brand hover:bg-brand-primary-hover">Continue to Availability <span className="ml-2" aria-hidden="true">→</span></a>
        </div>
      </section>
    </div>
  );
}
