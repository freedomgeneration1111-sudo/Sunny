import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckAvailabilityForm } from "@/components/sections/CheckAvailabilityForm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/Typography";
import { socialMetadata } from "@/lib/seo";

const title = "Check Availability";
const description = "Share your event date and starting scope with Focus Lab Productions.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/check-availability/" }, ...socialMetadata(title, description) };
export default function CheckAvailabilityPage() {
  return <Section id="inquiry-form" className="pt-8! md:pt-10!"><Container><div className="grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-20"><Suspense fallback={<p>Loading form…</p>}><CheckAvailabilityForm/></Suspense><aside><Eyebrow>What to expect</Eyebrow><SectionHeading className="mt-4 text-2xl!">Two short steps.</SectionHeading><ol className="mt-6 space-y-5 text-sm leading-6 text-ink-muted"><li><strong className="text-ink">1. Event details</strong><br/>Date, type, venue or city, services, guest count, and optional budget context.</li><li><strong className="text-ink">2. Contact</strong><br/>How Focus Lab should follow up.</li></ol><p className="mt-7 border-t border-border pt-5 text-xs leading-5 text-ink-muted">An inquiry is not an availability confirmation or booking.</p></aside></div></Container></Section>;
}
