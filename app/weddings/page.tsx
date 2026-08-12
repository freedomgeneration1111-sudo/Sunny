import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { weddingGuide } from "@/lib/content/planningGuides";

export const metadata: Metadata = {
  title: "Complete DFW Wedding Planning Guide",
  description:
    "Build a wedding timeline that survives a real venue: ceremony sound, the cocktail-hour squeeze, the five reception transitions, coverage hours, and a run-of-show checklist.",
  alternates: { canonical: "/weddings/" },
};

export default function WeddingsPage() {
  return <PlanningGuidePage guide={weddingGuide} />;
}
