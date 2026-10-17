"use client";

import { useEffect, useRef, useState } from "react";
import type { DesktopHeroCandidate } from "@/lib/media";

const DESKTOP_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REPLAY_PAUSE_MS = 20_000;

function usePlaybackEnvironment() {
  const [environment, setEnvironment] = useState({ ready: false, desktop: false, reduced: true });

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setEnvironment({ ready: true, desktop: desktop.matches, reduced: reduced.matches });
    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return environment;
}

/**
 * A desktop-only candidate player. It mounts one video element and only gives
 * the browser the active candidate's URLs, so inactive films cannot preload.
 * On mobile and with reduced motion the component renders nothing; the poster
 * in CinematicHeroMedia remains visible and no video URL is requested.
 */
export function HeroVideo({ candidates }: { candidates: readonly DesktopHeroCandidate[] }) {
  const environment = usePlaybackEnvironment();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const active = candidates[0];

  useEffect(() => {
    if (!environment.desktop || environment.reduced || !videoRef.current || !active) return;

    let cancelled = false;
    const video = videoRef.current;
    const playbackRate = active.playbackRate ?? 1;
    video.defaultPlaybackRate = playbackRate;
    video.playbackRate = playbackRate;

    const play = () => {
      void video
        .play()
        .then(() => {
          if (!cancelled) setPaused(false);
        })
        .catch(() => {
          if (!cancelled) setPaused(true);
        });
    };

    let replayTimer: ReturnType<typeof setTimeout> | undefined;
    const handleEnded = () => {
      replayTimer = setTimeout(() => {
        if (cancelled) return;
        video.currentTime = 0;
        play();
      }, REPLAY_PAUSE_MS);
    };
    video.addEventListener("ended", handleEnded);

    setPaused(false);
    play();

    return () => {
      cancelled = true;
      if (replayTimer) clearTimeout(replayTimer);
      video.removeEventListener("ended", handleEnded);
    };
  }, [active, environment.desktop, environment.reduced]);

  if (!environment.ready || !environment.desktop || environment.reduced || !active) return null;

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <>
      <video
        key={active.id}
        ref={videoRef}
        data-testid="desktop-hero-video"
        data-candidate={active.id}
        className="cinematic-video absolute inset-0 hidden h-full w-full object-cover md:block"
        style={{
          transform: `translateX(${active.desktopFocal.translateXPercent}%) translateY(${active.desktopFocal.translateYPercent ?? 0}%) scale(${active.desktopFocal.scale})`,
          transformOrigin: `${active.desktopFocal.originXPercent}% 50%`,
          objectPosition: active.desktopFocal.objectPosition ?? "center",
        }}
        autoPlay
        muted
        playsInline
        controls={false}
        preload="metadata"
        poster={active.poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={active.webm} type='video/webm; codecs="av01.0.05M.08"' />
        <source src={active.mp4} type="video/mp4" />
      </video>
      <div
        className="absolute bottom-5 right-5 z-20 hidden items-center gap-2 rounded-full border border-white/20 bg-black/55 p-1.5 text-white shadow-lg backdrop-blur-sm md:flex"
        aria-label="Desktop hero video controls"
        data-testid="desktop-hero-controls"
      >
        <button
          type="button"
          className="min-h-9 rounded-full px-3 text-xs font-bold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={paused ? "Play hero video" : "Pause hero video"}
          aria-pressed={paused}
          onClick={togglePlayback}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </>
  );
}
