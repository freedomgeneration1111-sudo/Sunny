"use client";

import { useEffect, useRef, useState } from "react";

export type HeroClip = {
  desktop?: string;
  mobile?: string;
  poster: string;
  /**
   * Pause early, for clips ending on a transition where freezing the literal
   * last frame would park the page mid-wipe. Omit to hold the true last frame.
   */
  holdAtSeconds?: number;
};

/**
 * The hero film plays once at normal speed, holds on a still frame, then hands
 * over to the next clip in the rotation.
 *
 * `loop` is deliberately not used — it restarts instantly and never fires
 * `ended`, so there is nowhere to hang the hold.
 *
 * Rotation runs on two stacked <video> elements rather than swapping `src` on
 * one. Swapping `src` blanks the element while the new file loads, which shows
 * as a flash at the handover; with two elements the incoming clip is already
 * decoded behind the outgoing one, so the swap is only an opacity change.
 *
 * Keeping real <source media> children on each element preserves the
 * responsive and reduced-motion behaviour for free: under
 * `prefers-reduced-motion` no source matches, nothing downloads, and the
 * poster image behind stands in.
 */
export function HeroVideo({
  clips,
  holdMs = 20_000,
}: {
  clips: readonly HeroClip[];
  holdMs?: number;
}) {
  const slotA = useRef<HTMLVideoElement>(null);
  const slotB = useRef<HTMLVideoElement>(null);

  // Which slot is visible, and which clip each slot currently holds.
  const [visibleSlot, setVisibleSlot] = useState<0 | 1>(0);
  const [assigned, setAssigned] = useState<[number, number]>([0, clips.length > 1 ? 1 : 0]);

  // Mirrors of the above for use inside listeners, which are registered once.
  const slotRef = useRef<0 | 1>(0);
  const assignedRef = useRef<[number, number]>(assigned);
  assignedRef.current = assigned;

  useEffect(() => {
    const a = slotA.current;
    const b = slotB.current;
    if (!a || !b) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      a.pause();
      b.pause();
      return;
    }

    const elementFor = (slot: 0 | 1) => (slot === 0 ? a : b);
    let holdTimer: number | undefined;
    let cancelled = false;

    const advance = () => {
      if (cancelled) return;
      const current = elementFor(slotRef.current);

      // A single clip simply replays itself.
      if (clips.length < 2) {
        current.currentTime = 0;
        void current.play().catch(() => undefined);
        return;
      }

      const nextSlot: 0 | 1 = slotRef.current === 0 ? 1 : 0;
      const incoming = elementFor(nextSlot);

      incoming.currentTime = 0;
      void incoming.play().catch(() => undefined);
      slotRef.current = nextSlot;
      setVisibleSlot(nextSlot);

      // Park the outgoing clip at its start, ready for its next turn.
      current.pause();
      current.currentTime = 0;

      // Queue the clip after this one into the slot just freed.
      setAssigned((prev) => {
        const nowShowing = prev[nextSlot];
        const next: [number, number] = [prev[0], prev[1]];
        next[nextSlot === 0 ? 1 : 0] = (nowShowing + 1) % clips.length;
        return next;
      });
    };

    const beginHold = () => {
      window.clearTimeout(holdTimer);
      holdTimer = window.setTimeout(advance, holdMs);
    };

    const listen = (slot: 0 | 1) => {
      const video = elementFor(slot);

      const onEnded = () => {
        if (slotRef.current !== slot) return;
        video.pause();
        beginHold();
      };

      // `timeupdate` fires roughly four times a second, so an early pause lands
      // within ~0.25s of the mark. Choose `holdAtSeconds` with that margin.
      const onTimeUpdate = () => {
        if (slotRef.current !== slot) return;
        const at = clips[assignedRef.current[slot]]?.holdAtSeconds;
        if (at === undefined || video.paused || video.currentTime < at) return;
        video.pause();
        beginHold();
      };

      video.addEventListener("ended", onEnded);
      video.addEventListener("timeupdate", onTimeUpdate);
      return () => {
        video.removeEventListener("ended", onEnded);
        video.removeEventListener("timeupdate", onTimeUpdate);
      };
    };

    const stopA = listen(0);
    const stopB = listen(1);
    void elementFor(slotRef.current).play().catch(() => undefined);

    return () => {
      cancelled = true;
      window.clearTimeout(holdTimer);
      stopA();
      stopB();
    };
  }, [holdMs, clips]);

  return (
    <>
      {([0, 1] as const).map((slot) => {
        const clip = clips[assigned[slot]] ?? clips[0];
        if (!clip) return null;
        return (
          <video
            key={slot}
            ref={slot === 0 ? slotA : slotB}
            className={`cinematic-video absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none motion-safe:block ${
              slot === visibleSlot ? "opacity-100" : "opacity-0"
            }`}
            autoPlay={slot === 0}
            muted
            playsInline
            controls={false}
            preload="auto"
            poster={clip.poster}
            aria-hidden="true"
            tabIndex={-1}
          >
            {clip.mobile ? (
              <source src={clip.mobile} media="(prefers-reduced-motion: no-preference) and (max-width: 767px)" />
            ) : null}
            {clip.desktop ? (
              <source src={clip.desktop} media="(prefers-reduced-motion: no-preference) and (min-width: 768px)" />
            ) : null}
          </video>
        );
      })}
    </>
  );
}
