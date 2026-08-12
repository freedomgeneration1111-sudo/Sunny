import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { partyGuide } from "@/lib/content/planningGuides";

export const metadata: Metadata = {
  title: "Party & Celebration Planning Guide",
  description:
    "Plan a birthday, shower, anniversary, or graduation: choosing a duration, reading the room, announcements, do-not-play lists, documentation, lighting, and venue questions.",
  alternates: { canonical: "/events/parties/" },
};

export default function PartiesPage() {
  return <PlanningGuidePage guide={partyGuide} />;
}
