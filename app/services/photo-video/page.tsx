import type { Metadata } from "next";
import { EventPage } from "@/components/sections/EventPage";
import { commercialPages } from "@/lib/content/commercial";
export const metadata: Metadata = { title: "Photo + Video", description: "Photography and filmmaking coverage planned around one event timeline.", alternates: { canonical: "/services/photo-video/" } };
export default function PhotoVideoPage() { return <EventPage page={commercialPages.photoVideo} />; }
