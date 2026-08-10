"use client";

import { useSearchParams } from "next/navigation";
import { useRef,useState,type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { inquirySubmissionEnabled,submitInquiry } from "@/lib/operations-api";

type State = { eventType:string;date:string;location:string;services:string[];guests:string;budget:string;name:string;email:string;phone:string;contact:string;note:string };
type SubmissionState = { kind:"idle"|"demo"|"submitting"|"success"|"error";message?:string };
const initial: State = { eventType:"",date:"",location:"",services:[],guests:"",budget:"",name:"",email:"",phone:"",contact:"email",note:"" };
const events = ["Wedding","South Asian Wedding","Party / Celebration","Corporate / Community"];
const services = ["Photo","Video","DJ / MC","Lighting / Production","Photo Booth / 360"];
const input = "mt-2 min-h-12 w-full rounded-control border border-border bg-surface px-4 text-ink";
const chip = "min-h-12 rounded-control border px-4 py-3 text-sm font-bold";

export function CheckAvailabilityForm() {
  const params = useSearchParams();
  const carried = params.getAll("interest");
  const [step,setStep] = useState<1|2|3>(1);
  const [form,setForm] = useState<State>(() => ({ ...initial,services: carried }));
  const [submission,setSubmission] = useState<SubmissionState>({ kind:"idle" });
  const idempotencyKey = useRef<string | null>(null);
  const next = (nextStep:2|3) => { track("inquiry_step_complete",{ step:nextStep-1 });setStep(nextStep); };
  const toggle = (service:string) => setForm((current) => ({ ...current,services:current.services.includes(service) ? current.services.filter((item) => item!==service) : [...current.services,service] }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!inquirySubmissionEnabled) {
      setSubmission({ kind:"demo" });
      track("inquiry_submit_error",{ reason:"demo_mode" });
      return;
    }
    setSubmission({ kind:"submitting" });
    track("inquiry_submit_attempt");
    idempotencyKey.current ??= crypto.randomUUID();
    try {
      const result = await submitInquiry(form,idempotencyKey.current);
      setSubmission({ kind:"success",message:result.message });
      track("inquiry_submit_success");
    } catch (error) {
      setSubmission({ kind:"error",message:error instanceof Error ? error.message : "The inquiry could not be sent. Please try again." });
      track("inquiry_submit_error",{ reason:"request_failed" });
    }
  }

  return <div className="max-w-3xl">
    {!inquirySubmissionEnabled ? <div className="mb-8 rounded-card border-2 border-brand-primary bg-brand-primary/10 p-4 text-sm font-bold">Demo inquiry · Nothing is transmitted. A submission backend and verified contact route are still required.</div> : null}
    <div role="progressbar" aria-label="Inquiry progress" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} className="mb-10 grid grid-cols-3 gap-2">{[1,2,3].map((item) => <span key={item} className={`h-2 rounded-full ${item<=step?"bg-brand-primary":"bg-border"}`}/>)}</div>
    <form onSubmit={submit}>
      {step===1 ? <fieldset className="space-y-7"><legend className="text-3xl font-bold">Start with the event.</legend>
        <div><span className="text-sm font-bold">Event type</span><div className="mt-3 flex flex-wrap gap-2">{events.map((item) => <button key={item} type="button" aria-pressed={form.eventType===item} onClick={() => setForm((current) => ({ ...current,eventType:item }))} className={`${chip} ${form.eventType===item?"border-brand-primary bg-brand-primary text-on-brand":"border-border bg-surface"}`}>{item}</button>)}</div></div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Preferred date<input required name="date" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current,date:event.target.value }))} className={input}/></label><label className="text-sm font-bold">Venue or city<input name="location" autoComplete="street-address" value={form.location} onChange={(event) => setForm((current) => ({ ...current,location:event.target.value }))} className={input}/></label></div>
        <button disabled={!form.eventType||!form.date} type="button" onClick={() => next(2)} className="min-h-12 rounded-control bg-ink px-6 font-bold text-on-brand disabled:opacity-35">Continue</button>
      </fieldset> : null}
      {step===2 ? <fieldset className="space-y-7"><legend className="text-3xl font-bold">Shape the starting scope.</legend>
        <div><span className="text-sm font-bold">Services</span><div className="mt-3 flex flex-wrap gap-2">{services.map((item) => <button key={item} type="button" aria-pressed={form.services.includes(item)} onClick={() => toggle(item)} className={`${chip} ${form.services.includes(item)?"border-brand-primary bg-brand-primary text-on-brand":"border-border bg-surface"}`}>{item}</button>)}</div>{carried.length ? <p className="mt-3 text-sm text-ink-muted">Pricing planner context carried forward: {carried.join(", ")}</p> : null}</div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Estimated guest count<input name="guests" type="number" inputMode="numeric" min="1" value={form.guests} onChange={(event) => setForm((current) => ({ ...current,guests:event.target.value }))} className={input}/></label><label className="text-sm font-bold">Budget context (optional)<select name="budget" value={form.budget} onChange={(event) => setForm((current) => ({ ...current,budget:event.target.value }))} className={input}><option value="">Select a range</option><option>Under $2,000</option><option>$2,000–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option><option>Not sure yet</option></select></label></div>
        <div className="flex gap-3"><button type="button" onClick={() => setStep(1)} className={`${chip} border-border`}>Back</button><button type="button" onClick={() => next(3)} className="min-h-12 rounded-control bg-ink px-6 font-bold text-on-brand">Continue</button></div>
      </fieldset> : null}
      {step===3 ? <fieldset className="space-y-6"><legend className="text-3xl font-bold">How should Focus Lab reach you?</legend>
        <label className="block text-sm font-bold">Name<input required name="name" autoComplete="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current,name:event.target.value }))} className={input}/></label>
        <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Email<input required name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={(event) => setForm((current) => ({ ...current,email:event.target.value }))} className={input}/></label><label className="text-sm font-bold">Phone (optional)<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current,phone:event.target.value }))} className={input}/></label></div>
        <label className="block text-sm font-bold">Preferred contact<select name="contact" value={form.contact} onChange={(event) => setForm((current) => ({ ...current,contact:event.target.value }))} className={input}><option value="email">Email</option><option value="phone">Phone</option></select></label>
        <label className="block text-sm font-bold">Anything else? (optional)<textarea name="note" rows={4} value={form.note} onChange={(event) => setForm((current) => ({ ...current,note:event.target.value }))} className={`${input} py-3`}/></label>
        <div className="flex gap-3"><button type="button" onClick={() => setStep(2)} className={`${chip} border-border`}>Back</button><button disabled={submission.kind==="submitting"||submission.kind==="success"} type="submit" className="min-h-12 rounded-control bg-brand-primary px-6 font-bold text-on-brand disabled:opacity-50">{submission.kind==="submitting"?"Sending…":inquirySubmissionEnabled?"Send Inquiry":"Review Demo Submission"}</button></div>
        {submission.kind==="demo" ? <div role="status" aria-live="polite" className="rounded-card border border-brand-primary bg-brand-primary/10 p-5"><strong>Demo only—no inquiry was sent.</strong><p className="mt-2 text-sm text-ink-muted">Your entries remain on this page for review. Production submission is intentionally disabled.</p></div> : null}
        {submission.kind==="success" ? <div role="status" aria-live="polite" className="rounded-card border border-brand-primary bg-brand-primary/10 p-5"><strong>Inquiry received for review.</strong><p className="mt-2 text-sm text-ink-muted">{submission.message}</p></div> : null}
        {submission.kind==="error" ? <div role="alert" className="rounded-card border border-red-700 bg-red-50 p-5 text-red-950"><strong>Your inquiry was not sent.</strong><p className="mt-2 text-sm">{submission.message}</p></div> : null}
      </fieldset> : null}
    </form>
  </div>;
}
