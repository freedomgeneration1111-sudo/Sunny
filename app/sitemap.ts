import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { guides } from "@/lib/content/guides";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/about/",
  "/asian-weddings/",
  "/check-availability/",
  "/events/corporate/",
  "/events/parties/",
  "/guides/",
  "/pricing/",
  "/privacy/",
  "/services/entertainment-production/",
  "/services/photo-video/",
  "/terms/",
  "/weddings/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const guideRoutes = guides.map((guide) => `/guides/${guide.slug}/`);
  return [...staticRoutes, ...guideRoutes].map((path) => ({
    url: new URL(path, config.siteUrl).toString(),
  }));
}
