import Image from "next/image";
import { HeroVideo } from "@/components/media/HeroVideo";
import type { DesktopHeroCandidate, MediaAsset } from "@/lib/media";

type CinematicHeroMediaProps = {
  asset: MediaAsset;
  /** User-approved candidates available for comparison on desktop only. */
  candidates?: readonly DesktopHeroCandidate[];
  /**
   * Portrait still for narrow screens. The film is shot both ways, so cropping
   * the landscape frame down to a phone would throw away the framing.
   */
  mobilePosterSrc?: string;
};

export function CinematicHeroMedia({
  asset,
  candidates,
  mobilePosterSrc,
}: CinematicHeroMediaProps) {
  const hasVideo = Boolean(candidates?.length);
  const desktopPosterSrc = candidates?.[0]?.poster ?? asset.src;

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
        className={`cinematic-poster object-cover ${mobilePosterSrc ? "hidden md:block" : ""}`}
        style={{ objectPosition: asset.objectPosition }}
      />
      {mobilePosterSrc ? (
        <Image
          src={mobilePosterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="cinematic-poster object-cover md:hidden"
        />
      ) : null}
      {hasVideo ? <HeroVideo candidates={candidates!} /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,10,.96)_0%,rgba(8,9,10,.82)_38%,rgba(8,9,10,.38)_68%,rgba(8,9,10,.55)_100%)] md:bg-[linear-gradient(90deg,rgba(8,9,10,.97)_0%,rgba(8,9,10,.82)_38%,rgba(8,9,10,.2)_72%,rgba(8,9,10,.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,9,10,.74)_0%,transparent_42%,rgba(8,9,10,.34)_100%)]" />
    </div>
  );
}
