import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { corporateGuide } from "@/lib/content/planningGuides";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";

const title = "Corporate Event & AV Planning Guide";
const description =
  "A practical AV guide for professional and community events: defining the outcome, room acoustics, microphone counts, playback and displays, staging, documentation, and load-in.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/events/corporate/" },
  ...socialMetadata(title, description, media.corporateHero.src),
};

export default function CorporatePage() {
  return <PlanningGuidePage guide={corporateGuide} />;
}
