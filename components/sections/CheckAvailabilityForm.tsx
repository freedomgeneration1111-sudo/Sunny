"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { usePlan } from "@/components/planning/PlanProvider";
import { config } from "@/lib/config";
import { track } from "@/lib/analytics";
import { customerInquiryError, inquirySubmissionEnabled, submitInquiry, turnstileSiteKey } from "@/lib/operations-api";
import { isPlanItemId, planItems } from "@/lib/plan";

type State = { eventType:string;date:string;location:string;services:string[];guests:string;budget:string;name:string;email:string;phone:string;contact:string;note:string;availabilityChecked:boolean };
type SubmissionState = { kind:"idle"|"demo"|"submitting"|"success"|"error";message?:string };
const base: State = { eventType:"",date:"",location:"",services:[],guests:"",budget:"",name:"",email:"",phone:"",contact:"email",note:"",availabilityChecked:false };
const eventTypes = ["Wedding","Asian Wedding","Party / Celebration","Corporate / Community"];
const serviceOptions = ["Photo","Video","DJ / MC","Lighting / Production","Photo Booth / 360"];
const inputClass = "mt-2 min-h-12 w-full rounded-control border border-border bg-surface px-4 text-ink placeholder:text-ink-muted/65";
const chipClass = "min-h-12 rounded-control border px-4 py-3 text-sm font-extrabold transition-colors";

export function CheckAvailabilityForm() {
  const params = useSearchParams();
  const { selected, remove } = usePlan();
  const queryIds = useMemo(() => params.getAll("interest").filter(isPlanItemId), [params]);
  const carriedIds = useMemo(() => [...new Set([...queryIds, ...selected])], [queryIds, selected]);
  const carriedLabels = useMemo(() => carriedIds.map((id) => planItems[id].label), [carriedIds]);
  const [removedQueryIds,setRemovedQueryIds] = useState<string[]>([]);
  const visibleCarriedIds = useMemo(() => carriedIds.filter((id) => !removedQueryIds.includes(id)), [carriedIds, removedQueryIds]);
  const visibleCarriedLabels = useMemo(() => visibleCarriedIds.map((id) => planItems[id].label), [visibleCarriedIds]);
  const [step,setStep] = useState<1|2>(1);
  const [form,setForm] = useState<State>(() => ({ ...base, eventType: params.get("event") ?? "", date: params.get("date") ?? "", availabilityChecked: params.get("availabilityChecked") === "true", services: carriedLabels }));
  const [submission,setSubmission] = useState<SubmissionState>({ kind:"idle" });
  const [turnstileToken,setTurnstileToken] = useState("");
  const [website,setWebsite] = useState("");
  const [turnstileReset,setTurnstileReset] = useState(0);
  const idempotencyKey = useRef<string | null>(null);
  const handleTurnstileToken = useCallback((token:string)=>setTurnstileToken(token),[]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      services: [...new Set([...current.services.filter((label) => !carriedLabels.some((carried) => carried === label)), ...visibleCarriedLabels])],
    }));
  }, [carriedLabels, visibleCarriedLabels]);

  // Re-syncs when arriving via "Request This Date" from the availability checker above on this
  // same page — a same-route query-string change doesn't remount this component, so the lazy
  // useState initializer alone would never see the new date/availabilityChecked values.
  useEffect(() => {
    const paramDate = params.get("date");
    if (!paramDate) return;
    const paramChecked = params.get("availabilityChecked") === "true";
    setForm((current) => (current.date === paramDate && current.availabilityChecked === paramChecked ? current : { ...current, date: paramDate, availabilityChecked: paramChecked }));
  }, [params]);

  const removeCarried = (id: (typeof carriedIds)[number]) => {
    remove(id);
    setRemovedQueryIds((current) => current.includes(id) ? current : [...current, id]);
    setForm((current) => ({ ...current, services: current.services.filter((service) => service !== planItems[id].label) }));
  };
  const goToStep2 = () => { track("inquiry_step_complete",{ step:1 }); setStep(2); };
  const toggle = (service:string) => setForm((current) => ({ ...current, services: current.services.includes(service) ? current.services.filter((item) => item!==service) : [...current.services,service] }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!inquirySubmissionEnabled) { setSubmission({ kind:"demo" }); track("inquiry_submit_error",{ reason:"demo_mode" }); return; }
    setSubmission({ kind:"submitting" });
    track("inquiry_submit_attempt");
    idempotencyKey.current ??= crypto.randomUUID();
    try {
      const result = await submitInquiry({ ...form,turnstileToken,website },idempotencyKey.current);
      setSubmission({ kind:"success",message:result.message });
      track("inquiry_submit_success");
    } catch (error) {
      setSubmission({ kind:"error",message:customerInquiryError(error) });
      setTurnstileReset((value)=>value+1);
      track("inquiry_submit_error",{ reason:"request_failed" });
    }
  }

  return (
    <div className="max-w-4xl">
      {config.quoteBuilderEnabled && visibleCarriedIds.length ? <aside className="mb-8 rounded-card border border-border bg-surface p-5"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-primary">Services you selected</p><ul className="mt-3 flex flex-wrap gap-2">{visibleCarriedIds.map((id) => <li key={id} className="inline-flex items-center gap-2 rounded-full bg-canvas-alt pl-3 text-xs font-bold"><span>{planItems[id].label}</span><button type="button" onClick={() => removeCarried(id)} aria-label={`Remove ${planItems[id].label}`} className="grid h-10 w-10 place-items-center rounded-full text-lg text-ink-muted hover:bg-border hover:text-ink">×</button></li>)}</ul></aside> : null}
      <div role="progressbar" aria-label="Inquiry progress" aria-valuemin={1} aria-valuemax={2} aria-valuenow={step} className="mb-10 grid grid-cols-2 gap-2">{[1,2].map((item) => <span key={item} className={`h-2 rounded-full ${item<=step?"bg-brand-primary":"bg-border"}`}/>)}</div>
      <form onSubmit={submit}>
        {step===1 ? <fieldset className="space-y-7" aria-labelledby="inquiry-step1-heading"><h1 id="inquiry-step1-heading" className="text-3xl font-extrabold">Start with the event.</h1>
          <div><span className="text-sm font-extrabold">Event type</span><div className="mt-3 flex flex-wrap gap-2">{eventTypes.map((item) => <button key={item} type="button" aria-pressed={form.eventType===item} onClick={() => setForm((current) => ({ ...current,eventType:item }))} className={`${chipClass} ${form.eventType===item?"border-brand-primary bg-brand-primary text-on-brand":"border-border bg-surface hover:border-ink"}`}>{item}</button>)}</div></div>
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-extrabold">Preferred date<input required name="date" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current,date:event.target.value,availabilityChecked:event.target.value===current.date?current.availabilityChecked:false }))} className={inputClass}/></label><label className="text-sm font-extrabold">Venue or city<input name="location" autoComplete="street-address" value={form.location} onChange={(event) => setForm((current) => ({ ...current,location:event.target.value }))} className={inputClass}/></label></div>
          <div><span className="text-sm font-extrabold">Services</span><div className="mt-3 flex flex-wrap gap-2">{serviceOptions.map((item) => <button key={item} type="button" aria-pressed={form.services.includes(item)} onClick={() => toggle(item)} className={`${chipClass} ${form.services.includes(item)?"border-brand-primary bg-brand-primary text-on-brand":"border-border bg-surface hover:border-ink"}`}>{item}</button>)}</div></div>
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-extrabold">Estimated guest count<input name="guests" type="number" inputMode="numeric" min="1" value={form.guests} onChange={(event) => setForm((current) => ({ ...current,guests:event.target.value }))} className={inputClass}/></label><label className="text-sm font-extrabold">Budget range (optional)<select name="budget" value={form.budget} onChange={(event) => setForm((current) => ({ ...current,budget:event.target.value }))} className={inputClass}><option value="">Select a range</option><option>Under $2,000</option><option>$2,000–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option><option>Not sure yet</option></select></label></div>
          <button disabled={!form.eventType||!form.date} type="button" onClick={goToStep2} className="min-h-12 rounded-control bg-ink px-6 font-extrabold text-on-brand disabled:opacity-35">Continue <span className="ml-2" aria-hidden="true">→</span></button>
        </fieldset> : null}
        {step===2 ? <fieldset className="space-y-6"><legend className="text-3xl font-extrabold">How should Focus Lab reach you?</legend>
          <label className="block text-sm font-extrabold">Name<input required name="name" autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current,name:event.target.value }))} className={inputClass}/></label>
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-extrabold">Email<input required name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={(event) => setForm((current) => ({ ...current,email:event.target.value }))} className={inputClass}/></label><label className="text-sm font-extrabold">Phone (optional)<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current,phone:event.target.value }))} className={inputClass}/></label></div>
          <label className="block text-sm font-extrabold">Preferred contact<select name="contact" value={form.contact} onChange={(event) => setForm((current) => ({ ...current,contact:event.target.value }))} className={inputClass}><option value="email">Email</option><option value="phone">Phone</option></select></label>
          <label className="block text-sm font-extrabold">Anything else we should know? (optional)<textarea name="note" rows={4} value={form.note} onChange={(event) => setForm((current) => ({ ...current,note:event.target.value }))} className={`${inputClass} py-3`}/></label>
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event)=>setWebsite(event.target.value)}/></label></div>
          {inquirySubmissionEnabled ? <TurnstileWidget siteKey={turnstileSiteKey} onToken={handleTurnstileToken} resetSignal={turnstileReset}/> : null}
          <div className="flex gap-3"><button type="button" onClick={() => setStep(1)} className={`${chipClass} border-border bg-surface`}>Back</button><button disabled={submission.kind==="submitting"||submission.kind==="success"||(inquirySubmissionEnabled&&!turnstileToken)} type="submit" className="min-h-12 rounded-control bg-brand-primary px-6 font-extrabold text-on-brand disabled:opacity-50">{submission.kind==="submitting"?"Sending…":inquirySubmissionEnabled?"Send Inquiry":"Send Inquiry"}</button></div>
          {submission.kind==="demo" ? <div role="status" aria-live="polite" className="rounded-card border border-brand-primary bg-brand-primary/10 p-5"><strong>This form is not sending yet.</strong><p className="mt-2 text-sm text-ink-muted">Your details are still on this page. Please reach us through chat and we will pick it up from there.</p></div> : null}
          {submission.kind==="success" ? <div role="status" aria-live="polite" className="rounded-card border border-brand-primary bg-brand-primary/10 p-5"><strong>Thanks — we have your inquiry.</strong><p className="mt-2 text-sm text-ink-muted">{submission.message}</p></div> : null}
          {submission.kind==="error" ? <div role="alert" className="rounded-card border border-red-700 bg-red-50 p-5 text-red-950"><strong>Your inquiry was not sent.</strong><p className="mt-2 text-sm">{submission.message}</p></div> : null}
        </fieldset> : null}
      </form>
    </div>
  );
}
