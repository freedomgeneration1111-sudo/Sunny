import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
import { serviceJsonLd } from "@/lib/jsonld";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";
const title = "Entertainment + Production";
const description = "DJ/MC, sound, lighting, and production planning for DFW weddings and events.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/services/entertainment-production/" }, ...socialMetadata(title, description, media.productionHero.src) };
export default function ProductionPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd("DJ/MC, Sound, Lighting and Event Production", description)) }} />
    <EventPage page={commercialPages.production} />
  </>;
}
