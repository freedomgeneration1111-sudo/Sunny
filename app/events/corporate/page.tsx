import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
export const metadata: Metadata = { title: "Corporate & Community", description: "Plan professional entertainment, media, AV, and event production around the purpose of the room." };
export default function CorporatePage() { return <EventPage page={commercialPages.corporate} />; }
