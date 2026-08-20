"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MobileHeroCandidate } from "@/lib/media";

const ROTATE_MS = 5000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Cycles through authentic mobile stills as a single poster image. Renders
 * one `.cinematic-poster` element at all times (never zero, never more than
 * one) so it stays a plain crossfade-free swap under reduced motion, matching
 * the desktop poster's fallback behavior.
 */
export function MobileHeroPoster({ candidates }: { candidates: readonly MobileHeroCandidate[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (candidates.length < 2 || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % candidates.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [candidates.length]);

  const active = candidates[index] ?? candidates[0];
  if (!active) return null;

  return (
    <Image
      key={active.id}
      src={active.src}
      alt={active.alt}
      fill
      priority
      sizes="100vw"
      className="cinematic-poster object-cover md:hidden"
      data-testid="mobile-hero-poster"
      data-candidate={active.id}
    />
  );
}
