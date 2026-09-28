"use client";

import { usePlan } from "@/components/planning/PlanProvider";
import { track } from "@/lib/analytics";
import { config } from "@/lib/config";
import { planItems, type PlanItem, type PlanItemId } from "@/lib/plan";
import { formatPrice,pricingLabel } from "@/lib/pricing";

/**
 * A single service: name, what it covers, and its price.
 *
 * When `config.quoteBuilderEnabled` is on, the card also carries the Add to
 * Plan control and participates in the planner. With the builder off it is a
 * reference card and nothing more — the customer reads it and contacts Focus
 * Lab for a quote.
 */
export function PlanItemCard({
  id,
  compact = false,
}: {
  id: PlanItemId;
  compact?: boolean;
}) {
  const item: PlanItem = planItems[id];
  const { includes, toggle } = usePlan();
  const selected = config.quoteBuilderEnabled && includes(id);

  return (
    <article
      // `text-ink` is explicit: these cards sit on dark sections too, where the
      // inherited color would otherwise render the name and price white-on-white.
      className={`group flex h-full flex-col rounded-card border bg-surface text-ink transition-[border-color,background-color,transform] ${
        config.quoteBuilderEnabled ? "motion-safe:hover:-translate-y-1" : ""
      } ${
        selected ? "border-brand-primary bg-brand-primary/8" : "border-border"
      } ${compact ? "p-5" : "p-6"}`}
    >
      {/* The category label is only useful in the planner, where cards appear
          outside their pricing group. On /pricing the group heading says it. */}
      {config.quoteBuilderEnabled ? (
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-ink-muted">
            {item.category}
          </p>
          {selected ? (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-on-brand">
              In plan
            </span>
          ) : null}
        </div>
      ) : null}

      <h3 className={`${compact ? "text-lg" : "text-2xl"} font-extrabold leading-tight`}>
        {item.priceKey?pricingLabel(item.priceKey):item.label}
      </h3>
      <p className="mt-3 text-sm leading-6 text-ink-muted">{item.detail}</p>

      {item.priceKey ? (
        <p className="mt-auto pt-5 text-2xl font-black tabular-nums">
          {formatPrice(item.priceKey)}
        </p>
      ) : null}

      {config.quoteBuilderEnabled ? (
        <div className="pt-6">
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => {
              toggle(id);
              track("pricing_item_toggle", { item: id, selected: !selected });
            }}
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-control border px-4 text-sm font-extrabold transition-colors ${
              selected
                ? "border-ink bg-ink text-on-brand hover:bg-ink/85"
                : "border-border bg-canvas text-ink hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {selected ? "Remove from Plan" : "Add to Plan"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
