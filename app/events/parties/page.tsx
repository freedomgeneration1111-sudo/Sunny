import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
export const metadata: Metadata = { title: "Parties & Celebrations", description: "Plan private-event entertainment, enhancements, and optional media across Dallas–Fort Worth." };
export default function PartiesPage() { return <EventPage page={commercialPages.parties} />; }
