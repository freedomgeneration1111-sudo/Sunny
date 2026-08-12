import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { shaadiGuide } from "@/lib/content/planningGuides";

export const metadata: Metadata = {
  title: "Complete Shaadi & South Asian Wedding Planning Guide",
  description:
    "Map a multi-event celebration on your family's own sequence: performances and rehearsal, Baraat sound, media continuity across events, venue changes, and a full-week checklist.",
  alternates: { canonical: "/south-asian-weddings/" },
};

export default function SouthAsianWeddingsPage() {
  return <PlanningGuidePage guide={shaadiGuide} />;
}
