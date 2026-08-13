"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { config } from "@/lib/config";
import {
  buildPlanInquiryHref,
  customQuoteCount,
  isPlanItemId,
  planSubtotal,
  type PlanItemId,
} from "@/lib/plan";

type PlanContextValue = {
  selected: PlanItemId[];
  toggle: (id: PlanItemId) => void;
  remove: (id: PlanItemId) => void;
  clear: () => void;
  includes: (id: PlanItemId) => boolean;
  estimatedAnchor: number;
  customItemCount: number;
  inquiryHref: string;
};

const PlanContext = createContext<PlanContextValue | null>(null);
const storageKey = "focuslab.event-plan.v1";


export function PlanProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<PlanItemId[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) {
          setSelected(parsed.filter((value): value is PlanItemId => typeof value === "string" && isPlanItemId(value)));
        }
      } catch {
        window.sessionStorage.removeItem(storageKey);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.sessionStorage.setItem(storageKey, JSON.stringify(selected));
  }, [hydrated, selected]);

  const toggle = (id: PlanItemId) => {
    setSelected((current) => {
      const isRemoving = current.includes(id);
      const next = isRemoving ? current.filter((item) => item !== id) : [...current, id];
      if (!isRemoving) window.dispatchEvent(new CustomEvent("focuslab:plan-item-added", { detail: { id } }));
      return next;
    });
  };

  const estimatedAnchor = planSubtotal(selected);
  const customItemCount = customQuoteCount(selected);

  const value: PlanContextValue = {
    selected,
    toggle,
    remove: (id) => setSelected((current) => current.filter((item) => item !== id)),
    clear: () => setSelected([]),
    includes: (id) => selected.includes(id),
    estimatedAnchor,
    customItemCount,
    inquiryHref: buildPlanInquiryHref(selected),
  };

  return <PlanContext.Provider value={value}>{children}<PlanBar /></PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside PlanProvider");
  return context;
}

function PlanBar() {
  const pathname = usePathname();
  const { selected, estimatedAnchor, customItemCount, inquiryHref, clear } = usePlan();

  if (!config.quoteBuilderEnabled) return null;
  if (!selected.length || pathname.startsWith("/check-availability")) return null;

  return (
    <aside aria-label="Event plan summary" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-5">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-[16px] border border-on-brand/15 bg-ink px-4 py-3 text-on-brand shadow-[0_18px_55px_rgba(0,0,0,.28)] sm:px-6">
        <div className="min-w-0" aria-live="polite">
          <p className="text-sm font-extrabold">Your plan: {selected.length} {selected.length === 1 ? "item" : "items"}</p>
          <p className="truncate text-xs text-on-brand/60">
            {estimatedAnchor > 0
              ? `$${estimatedAnchor.toLocaleString()}${customItemCount ? ` + ${customItemCount} custom` : ""}`
              : `${customItemCount} custom ${customItemCount === 1 ? "quote" : "quotes"}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={clear} className="hidden min-h-11 rounded-control px-3 text-xs font-bold text-on-brand/65 hover:text-on-brand sm:inline-flex sm:items-center">Clear</button>
          <Link href={inquiryHref} className="inline-flex min-h-11 items-center rounded-control bg-brand-primary px-4 text-sm font-extrabold text-on-brand hover:bg-brand-primary-hover">
            Continue <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
