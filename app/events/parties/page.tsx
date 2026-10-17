import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { partyGuide } from "@/lib/content/planningGuides";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";

const title = "Party & Celebration Planning Guide";
const description =
  "Plan a birthday, shower, anniversary, or graduation: choosing a duration, reading the room, announcements, do-not-play lists, documentation, lighting, and venue questions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/events/parties/" },
  ...socialMetadata(title, description, media.partyHero.src),
};

export default function PartiesPage() {
  return <PlanningGuidePage guide={partyGuide} />;
}
