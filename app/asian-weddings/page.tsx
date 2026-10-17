import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { asianWeddingsGuide } from "@/lib/content/planningGuides";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";

const title = "Complete Asian Wedding Planning Guide";
const description =
  "Map a multi-event celebration on your family's own sequence: performances and rehearsal, Baraat sound, media continuity across events, venue changes, and a full-week checklist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/asian-weddings/" },
  ...socialMetadata(title, description, media.asianWeddingHero.src),
};

export default function AsianWeddingsPage() {
  return <PlanningGuidePage guide={asianWeddingsGuide} />;
}
