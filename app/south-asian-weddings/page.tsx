import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
export const metadata: Metadata = { title: "South Asian Weddings", description: "Culturally fluent, multi-event media, entertainment, and production planning across DFW." };
export default function SouthAsianWeddingsPage() { return <EventPage page={commercialPages.southAsian} />; }
