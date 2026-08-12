import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
export const metadata: Metadata = { title: "Entertainment + Production", description: "DJ/MC, sound, lighting, and production planning for DFW weddings and events.", alternates: { canonical: "/services/entertainment-production/" } };
export default function ProductionPage() { return <EventPage page={commercialPages.production} />; }
