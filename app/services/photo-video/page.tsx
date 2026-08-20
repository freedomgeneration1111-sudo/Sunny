import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
import { serviceJsonLd } from "@/lib/jsonld";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";
const title = "Photo + Video";
const description = "Photography and filmmaking coverage planned around one event timeline.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/services/photo-video/" }, ...socialMetadata(title, description, media.photoVideoHero.src) };
export default function PhotoVideoPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd("Event Photography and Videography", description)) }} />
    <EventPage page={commercialPages.photoVideo} />
  </>;
}
