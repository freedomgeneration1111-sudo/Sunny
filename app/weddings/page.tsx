import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
export const metadata: Metadata = { title: "Weddings", description: "Coordinate wedding entertainment, production, photography, and video around one DFW event plan." };
export default function WeddingsPage() { return <EventPage page={commercialPages.weddings} />; }
