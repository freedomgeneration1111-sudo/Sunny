import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckAvailabilityForm } from "@/components/sections/CheckAvailabilityForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/Typography";

export const metadata: Metadata = { title: "Check Availability", description: "Share your event date and starting scope with Focus Lab Productions.", alternates: { canonical: "/check-availability/" } };
export default function CheckAvailabilityPage() {
  return <><PageHero variant="textLed" eyebrow="Start Here" title="Tell us what you’re planning." body="Begin with the date and event. Services and contact details come next."/><Section><Container><div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-20"><Suspense fallback={<p>Loading form…</p>}><CheckAvailabilityForm/></Suspense><aside className="order-first lg:order-last"><Eyebrow>What to expect</Eyebrow><SectionHeading className="mt-4 text-2xl!">Three short steps.</SectionHeading><ol className="mt-6 space-y-5 text-sm leading-6 text-ink-muted"><li><strong className="text-ink">1. Event basics</strong><br/>Date, type, and city or venue.</li><li><strong className="text-ink">2. Starting scope</strong><br/>Services, guest count, and optional budget context.</li><li><strong className="text-ink">3. Contact</strong><br/>How Focus Lab should follow up.</li></ol><p className="mt-7 border-t border-border pt-5 text-xs leading-5 text-ink-muted">An inquiry is not an availability confirmation or booking.</p></aside></div></Container></Section></>;
}
