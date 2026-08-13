"use client";

import { useEffect, useRef } from "react";

/**
 * The hero film plays once at normal speed, holds on a still frame, then plays
 * again.
 *
 * `loop` is deliberately not used — it restarts instantly and never fires
 * `ended`, so there is nowhere to hang the hold.
 *
 * `holdAtSeconds` exists because the supplied clip ends on a half-second
 * sparkle transition. Freezing on the literal final frame parks the page on a
 * mid-wipe effect, which reads as a broken player. Pausing just before it holds
 * a clean image instead. Leave it undefined to hold on the true last frame.
 *
 * Under `prefers-reduced-motion` no `<source>` matches, so nothing downloads
 * and the poster image stands in.
 */
export function HeroVideo({
  desktopSrc,
  mobileSrc,
  poster,
  holdMs = 20_000,
  holdAtSeconds,
}: {
  desktopSrc?: string;
  mobileSrc?: string;
  poster: string;
  holdMs?: number;
  holdAtSeconds?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    let holdTimer: number | undefined;

    const restart = () => {
      video.currentTime = 0;
      // Autoplay can be refused (a background tab, for instance). The held
      // frame simply stays put, which is what the hold was already showing.
      void video.play().catch(() => undefined);
    };

    const beginHold = () => {
      window.clearTimeout(holdTimer);
      holdTimer = window.setTimeout(restart, holdMs);
    };

    // `timeupdate` fires roughly four times a second, so the pause lands within
    // ~0.25s of the mark. Choose `holdAtSeconds` with that margin in mind.
    const onTimeUpdate = () => {
      if (holdAtSeconds === undefined) return;
      if (video.paused || video.currentTime < holdAtSeconds) return;
      video.pause();
      beginHold();
    };

    video.addEventListener("ended", beginHold);
    video.addEventListener("timeupdate", onTimeUpdate);
    void video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("ended", beginHold);
      video.removeEventListener("timeupdate", onTimeUpdate);
      window.clearTimeout(holdTimer);
    };
  }, [holdMs, holdAtSeconds]);

  return (
    <video
      ref={ref}
      className="cinematic-video absolute inset-0 hidden h-full w-full object-cover motion-safe:block"
      autoPlay
      muted
      playsInline
      controls={false}
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      {mobileSrc ? (
        <source src={mobileSrc} media="(prefers-reduced-motion: no-preference) and (max-width: 767px)" />
      ) : null}
      {desktopSrc ? (
        <source src={desktopSrc} media="(prefers-reduced-motion: no-preference) and (min-width: 768px)" />
      ) : null}
    </video>
  );
}
