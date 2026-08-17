import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { asianWeddingsGuide } from "@/lib/content/planningGuides";

export const metadata: Metadata = {
  title: "Complete Asian Wedding Planning Guide",
  description:
    "Map a multi-event celebration on your family's own sequence: performances and rehearsal, Baraat sound, media continuity across events, venue changes, and a full-week checklist.",
  alternates: { canonical: "/asian-weddings/" },
};

export default function AsianWeddingsPage() {
  return <PlanningGuidePage guide={asianWeddingsGuide} />;
}
