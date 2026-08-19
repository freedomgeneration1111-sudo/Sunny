"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { getAvailability, type AvailabilityResult } from "@/lib/operations-api";

type CheckState = { kind: "idle" } | { kind: "checking" } | { kind: "result"; result: AvailabilityResult };
const inputClass = "mt-2 min-h-12 w-full rounded-control border border-border bg-surface px-4 text-ink placeholder:text-ink-muted/65";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function requestDateHref(date: string, confirmed: boolean) {
  return `/check-availability?date=${encodeURIComponent(date)}&availabilityChecked=${confirmed}#inquiry-form`;
}

export function AvailabilityChecker() {
  const [date, setDate] = useState("");
  const [state, setState] = useState<CheckState>({ kind: "idle" });

  async function check(checkDate: string) {
    if (!checkDate) return;
    setDate(checkDate);
    setState({ kind: "checking" });
    track("availability_check_attempt");
    const result = await getAvailability(checkDate);
    track("availability_check_result", { status: result.status });
    setState({ kind: "result", result });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void check(date);
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6 md:p-8">
      <h1 className="text-3xl font-extrabold md:text-4xl">Check Your Date</h1>
      <p className="mt-2 text-ink-muted">See if your event date is currently open.</p>
      <form onSubmit={submit} className="mt-6 flex flex-wrap items-end gap-4">
        <label className="min-w-[14rem] flex-1 text-sm font-extrabold">
          Event date
          <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
        </label>
        <Button type="submit" disabled={!date || state.kind === "checking"}>
          {state.kind === "checking" ? "Checking…" : "Check Availability"}
        </Button>
      </form>

      {state.kind === "result" ? (
        <div className="mt-6" role="status" aria-live="polite">
          {state.result.status === "available" ? (
            <div className="rounded-card border border-brand-primary bg-brand-primary/10 p-5">
              <strong>Good news — {formatDate(state.result.date)} is currently open.</strong>
              <p className="mt-2 text-sm text-ink-muted">This isn&apos;t a booking yet. Send an inquiry to start locking in your date.</p>
              <Button href={requestDateHref(state.result.date, true)} className="mt-4" onClick={() => track("availability_cta_request_date")}>
                Request This Date
              </Button>
            </div>
          ) : null}

          {state.result.status === "unavailable" ? (
            <div className="rounded-card border border-border bg-canvas-alt p-5">
              <strong>That date is currently booked.</strong>
              {state.result.nearby?.length ? (
                <div className="mt-4">
                  <p className="text-sm font-extrabold">Nearby dates that are open</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {state.result.nearby.map((entry) => (
                      <button
                        key={entry.date}
                        type="button"
                        onClick={() => void check(entry.date)}
                        className="min-h-12 rounded-control border border-border bg-surface px-4 text-sm font-bold transition-colors hover:border-ink"
                      >
                        {formatDate(entry.date)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <Button href={requestDateHref(state.result.date, false)} variant="secondary" className="mt-4" onClick={() => track("availability_cta_ask_options")}>
                Ask Us About Options
              </Button>
            </div>
          ) : null}

          {state.result.status === "unknown" ? (
            <div className="rounded-card border border-border bg-canvas-alt p-5">
              <strong>We couldn&apos;t confirm that date automatically.</strong>
              <p className="mt-2 text-sm text-ink-muted">Send an inquiry and the team will confirm your date directly.</p>
              <Button href={requestDateHref(state.result.date, false)} className="mt-4">
                Send an Inquiry
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
