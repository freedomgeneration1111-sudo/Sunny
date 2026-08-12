import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { corporateGuide } from "@/lib/content/planningGuides";

export const metadata: Metadata = {
  title: "Corporate Event & AV Planning Guide",
  description:
    "A practical AV guide for professional and community events: defining the outcome, room acoustics, microphone counts, playback and displays, staging, documentation, and load-in.",
  alternates: { canonical: "/events/corporate/" },
};

export default function CorporatePage() {
  return <PlanningGuidePage guide={corporateGuide} />;
}
