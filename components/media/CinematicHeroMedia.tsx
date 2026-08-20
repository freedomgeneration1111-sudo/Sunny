import Image from "next/image";
import { HeroVideo } from "@/components/media/HeroVideo";
import { MobileHeroPoster } from "@/components/media/MobileHeroPoster";
import type { DesktopHeroCandidate, MediaAsset, MobileHeroCandidate } from "@/lib/media";

type CinematicHeroMediaProps = {
  asset: MediaAsset;
  /** User-approved candidates available for comparison on desktop only. */
  candidates?: readonly DesktopHeroCandidate[];
  /**
   * Portrait stills for narrow screens, rotated as a single poster. Mobile
   * doesn't play video, so this is a still-photo rotation instead of the film.
   */
  mobileCandidates?: readonly MobileHeroCandidate[];
};

export function CinematicHeroMedia({
  asset,
  candidates,
  mobileCandidates,
}: CinematicHeroMediaProps) {
  const hasVideo = Boolean(candidates?.length);
  const hasMobilePosters = Boolean(mobileCandidates?.length);
  const initialCandidate = candidates?.[0];
  const desktopPosterSrc = initialCandidate?.poster ?? asset.src;

  return (
    <div
      className="cinematic-media absolute inset-0 overflow-hidden bg-ink"
      data-media-mode={hasVideo ? "video-ready" : "simulated"}
      data-reduced-motion-fallback="poster"
    >
      <Image
        src={desktopPosterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`cinematic-poster object-cover ${hasMobilePosters ? "hidden md:block" : ""}`}
        style={{
          objectPosition: asset.objectPosition,
          transform: initialCandidate
            ? `translateX(${initialCandidate.desktopFocal.translateXPercent}%) scale(${initialCandidate.desktopFocal.scale})`
            : undefined,
          transformOrigin: initialCandidate
            ? `${initialCandidate.desktopFocal.originXPercent}% 50%`
            : undefined,
        }}
      />
      {hasMobilePosters ? <MobileHeroPoster candidates={mobileCandidates!} /> : null}
      {hasVideo ? <HeroVideo candidates={candidates!} /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,10,.96)_0%,rgba(8,9,10,.82)_38%,rgba(8,9,10,.38)_68%,rgba(8,9,10,.55)_100%)] md:bg-[linear-gradient(90deg,rgba(8,9,10,.97)_0%,rgba(8,9,10,.82)_38%,rgba(8,9,10,.2)_72%,rgba(8,9,10,.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,9,10,.74)_0%,transparent_42%,rgba(8,9,10,.34)_100%)]" />
    </div>
  );
}
