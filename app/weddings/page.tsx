import type { Metadata } from "next";
import { PlanningGuidePage } from "@/components/sections/PlanningGuidePage";
import { weddingGuide } from "@/lib/content/planningGuides";
import { media } from "@/lib/media";
import { socialMetadata } from "@/lib/seo";

const title = "Complete DFW Wedding Planning Guide";
const description =
  "Build a wedding timeline that survives a real venue: ceremony sound, the cocktail-hour squeeze, the five reception transitions, coverage hours, and a run-of-show checklist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/weddings/" },
  ...socialMetadata(title, description, media.weddingsHero.src),
};

export default function WeddingsPage() {
  return <PlanningGuidePage guide={weddingGuide} />;
}
