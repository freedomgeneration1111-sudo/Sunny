"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CueFrame } from "@/components/brand/CueFrame";
import {
  eventTypeOptions,
  needOptions,
  budgetOptions,
  confirmation,
} from "@/lib/content/checkAvailability";

type FormState = {
  eventType: string;
  date: string;
  location: string;
  needs: string[];
  firstName: string;
  lastName: string;
  contactMethod: "text" | "email" | "";
  phone: string;
  email: string;
  message: string;
  budget: string;
};

const initialState: FormState = {
  eventType: "",
  date: "",
  location: "",
  needs: [],
  firstName: "",
  lastName: "",
  contactMethod: "",
  phone: "",
  email: "",
  message: "",
  budget: "",
};

const chipBase =
  "rounded-full border px-4 py-2 font-body text-sm transition-colors focus-visible:outline-2 focus-visible:outline-pomegranate";
const chipActive = "border-pomegranate bg-pomegranate text-ivory";
const chipInactive = "border-ink/15 text-ink/70 hover:border-ink/35";

export function CheckAvailabilityForm() {
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [form, setForm] = useState<FormState>(initialState);

  function toggleNeed(need: string) {
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(need) ? f.needs.filter((n) => n !== need) : [...f.needs, need],
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // FORM NOT CONNECTED — nothing is transmitted anywhere. See README.
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="max-w-lg animate-[var(--animate-headline-in)]">
        <CueFrame className="h-10 w-10 text-pomegranate" withCenter />
        <h2 className="mt-5 font-display text-3xl font-semibold text-ink">{confirmation.h2}</h2>
        <p className="mt-3 font-body text-base text-ink/65">{confirmation.body}</p>
        <div className="mt-8 flex flex-wrap gap-4 font-body text-sm font-semibold">
          <Link href="/work" className="text-pomegranate">
            See Our Work
          </Link>
          <a href="tel:+12145550142" className="text-pomegranate">
            Call
          </a>
          <a href="sms:+12145550142" className="text-pomegranate">
            Text
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8 flex items-center gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? "bg-pomegranate" : "bg-ink/10"}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <fieldset className="space-y-8">
            <legend className="font-display text-2xl font-semibold text-ink">
              What are you celebrating?
            </legend>

            <div>
              <p className="font-body text-sm font-semibold text-ink/70">Event type</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {eventTypeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={form.eventType === opt}
                    onClick={() => setForm((f) => ({ ...f, eventType: opt }))}
                    className={`${chipBase} ${form.eventType === opt ? chipActive : chipInactive}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="font-body text-sm font-semibold text-ink/70">
                  Preferred date
                </label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
                />
              </div>
              <div>
                <label htmlFor="location" className="font-body text-sm font-semibold text-ink/70">
                  Location / venue <span className="font-normal text-ink/40">(optional)</span>
                </label>
                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
                />
              </div>
            </div>

            <div>
              <p className="font-body text-sm font-semibold text-ink/70">What do you need?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {needOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={form.needs.includes(opt)}
                    onClick={() => toggleNeed(opt)}
                    className={`${chipBase} ${form.needs.includes(opt) ? chipActive : chipInactive}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!form.eventType || !form.date}
              onClick={() => setStep(2)}
              className="rounded-full bg-ink px-7 py-3.5 font-body text-sm font-semibold text-ivory disabled:opacity-30"
            >
              Continue
            </button>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="space-y-8">
            <legend className="font-display text-2xl font-semibold text-ink">
              How should we reach you?
            </legend>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="font-body text-sm font-semibold text-ink/70">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="font-body text-sm font-semibold text-ink/70">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
                />
              </div>
            </div>

            <div>
              <p className="font-body text-sm font-semibold text-ink/70">Preferred contact</p>
              <div className="mt-3 flex gap-2">
                {(["text", "email"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    aria-pressed={form.contactMethod === method}
                    onClick={() => setForm((f) => ({ ...f, contactMethod: method }))}
                    className={`${chipBase} ${form.contactMethod === method ? chipActive : chipInactive}`}
                  >
                    {method === "text" ? "Text me" : "Email me"}
                  </button>
                ))}
              </div>
            </div>

            {form.contactMethod === "text" ? (
              <div>
                <label htmlFor="phone" className="font-body text-sm font-semibold text-ink/70">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
                />
              </div>
            ) : null}

            {form.contactMethod === "email" ? (
              <div>
                <label htmlFor="email" className="font-body text-sm font-semibold text-ink/70">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
                />
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full border border-ink/20 px-7 py-3.5 font-body text-sm font-semibold text-ink"
              >
                Back
              </button>
              <button
                type="button"
                disabled={
                  !form.firstName ||
                  !form.contactMethod ||
                  (form.contactMethod === "text" && !form.phone) ||
                  (form.contactMethod === "email" && !form.email)
                }
                onClick={() => setStep(3)}
                className="rounded-full bg-ink px-7 py-3.5 font-body text-sm font-semibold text-ivory disabled:opacity-30"
              >
                Continue
              </button>
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="space-y-8">
            <legend className="font-display text-2xl font-semibold text-ink">
              Anything we should know?
            </legend>

            <div>
              <label htmlFor="message" className="font-body text-sm font-semibold text-ink/70">
                Message <span className="font-normal text-ink/40">(optional)</span>
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="mt-2 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 font-body text-sm text-ink"
              />
            </div>

            <div>
              <p className="font-body text-sm font-semibold text-ink/70">Budget</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={form.budget === opt}
                    onClick={() => setForm((f) => ({ ...f, budget: opt }))}
                    className={`${chipBase} ${form.budget === opt ? chipActive : chipInactive}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-ink/20 px-7 py-3.5 font-body text-sm font-semibold text-ink"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-full bg-pomegranate px-7 py-3.5 font-body text-sm font-semibold text-ivory"
              >
                Check Availability
              </button>
            </div>
          </fieldset>
        ) : null}
      </form>
    </div>
  );
}
