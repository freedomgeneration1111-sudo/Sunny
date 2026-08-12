"use client";

import { usePlan } from "@/components/planning/PlanProvider";
import { track } from "@/lib/analytics";
import { planItems, type PlanItem, type PlanItemId } from "@/lib/plan";
import { formatPrice } from "@/lib/pricing";

export function PlanItemCard({
  id,
  compact = false,
}: {
  id: PlanItemId;
  compact?: boolean;
}) {
  const item: PlanItem = planItems[id];
  const { includes, toggle } = usePlan();
  const selected = includes(id);

  return (
    <article
      // `text-ink` is explicit: these cards sit on dark sections too, where the
      // inherited colour would otherwise render the title and price white-on-white.
      className={`group flex h-full flex-col rounded-card border bg-surface text-ink transition-[border-color,background-color,transform] motion-safe:hover:-translate-y-1 ${
        selected
          ? "border-brand-primary bg-brand-primary/8"
          : "border-border hover:border-ink/50"
      } ${compact ? "p-5" : "p-6"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-ink-muted">
          <span>{item.category}</span>
          {item.draft ? (
            <span
              title="Draft service invented for layout review. Scope and price are not decided."
              className="rounded-full border border-brand-primary px-2 py-0.5 text-[10px] tracking-wider text-brand-primary"
            >
              Draft
            </span>
          ) : null}
        </p>
        {selected ? (
          <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-on-brand">
            In plan
          </span>
        ) : null}
      </div>
      <h3
        className={`${compact ? "mt-3 text-lg" : "mt-5 text-2xl"} font-extrabold leading-tight`}
      >
        {item.label}
      </h3>
      <p className="mt-3 text-sm leading-6 text-ink-muted">{item.detail}</p>
      {item.priceKey ? (
        <p className="mt-5 text-2xl font-black tabular-nums">
          {formatPrice(item.priceKey)}
        </p>
      ) : null}
      {/* mt-auto pins every button to the card floor so rows align regardless
          of how the label, detail, or price above them wrapped. */}
      <div className="mt-auto pt-6">
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
    </article>
  );
}
