import Image from "next/image";
import type { MediaAsset } from "@/lib/media";

type CinematicHeroMediaProps = {
  asset: MediaAsset;
  desktopVideoSrc?: string;
  mobileVideoSrc?: string;
};

export function CinematicHeroMedia({
  asset,
  desktopVideoSrc,
  mobileVideoSrc,
}: CinematicHeroMediaProps) {
  const hasVideo = Boolean(desktopVideoSrc || mobileVideoSrc);

  return (
    <div
      className="cinematic-media absolute inset-0 overflow-hidden bg-ink"
      data-media-mode={hasVideo ? "video-ready" : "simulated"}
      data-reduced-motion-fallback="poster"
    >
      <Image
        src={asset.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="cinematic-poster object-cover"
        style={{ objectPosition: asset.objectPosition }}
      />
      {hasVideo ? (
        <video
          className="cinematic-video absolute inset-0 hidden h-full w-full object-cover motion-safe:block"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="metadata"
          poster={asset.src}
          aria-hidden="true"
          tabIndex={-1}
        >
          {mobileVideoSrc ? (
            <source
              src={mobileVideoSrc}
              media="(prefers-reduced-motion: no-preference) and (max-width: 767px)"
            />
          ) : null}
          {desktopVideoSrc ? (
            <source
              src={desktopVideoSrc}
              media="(prefers-reduced-motion: no-preference) and (min-width: 768px)"
            />
          ) : null}
        </video>
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,10,.96)_0%,rgba(8,9,10,.82)_38%,rgba(8,9,10,.38)_68%,rgba(8,9,10,.55)_100%)] md:bg-[linear-gradient(90deg,rgba(8,9,10,.97)_0%,rgba(8,9,10,.82)_38%,rgba(8,9,10,.2)_72%,rgba(8,9,10,.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,9,10,.74)_0%,transparent_42%,rgba(8,9,10,.34)_100%)]" />
    </div>
  );
}
