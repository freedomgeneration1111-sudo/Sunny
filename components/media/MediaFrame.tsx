import Image from "next/image";
import { CueFrame } from "@/components/brand/CueFrame";
import { config } from "@/lib/config";
import type { MediaAsset } from "@/lib/media";

type MediaFrameProps = {
  asset: MediaAsset;
  className?: string;
  /** Sizes attribute passed to next/image; defaults to a sensible full-bleed value. */
  sizes?: string;
  priority?: boolean;
  /** Override the asset's registered aspect ratio for this specific placement. */
  aspectRatioOverride?: string;
};

const badgeText: Record<MediaAsset["status"], string | null> = {
  proxy: "PROXY · REPLACE",
  needed: "ASSET NEEDED",
  real: null,
};

export function MediaFrame({
  asset,
  className,
  sizes = "100vw",
  priority = false,
  aspectRatioOverride,
}: MediaFrameProps) {
  const badge = badgeText[asset.status];
  const showBadge = badge && config.showDevelopmentLabels;

  return (
    <div
      className={`relative overflow-hidden bg-ink/5 ${className ?? ""}`}
      style={{ aspectRatio: aspectRatioOverride ?? asset.aspectRatio ?? "4/5" }}
    >
      {asset.status === "needed" ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 bg-ivory px-4 text-center">
          <CueFrame className="h-8 w-8 text-ink/30" />
          <p className="font-body text-xs uppercase tracking-wide text-ink/50">Asset needed</p>
          <p className="font-body text-[11px] text-ink/40">{asset.purpose}</p>
        </div>
      ) : (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}

      {showBadge ? (
        <span
          className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-sm bg-ink/70 px-1.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-ivory backdrop-blur-sm"
          title={`${asset.purpose} — development placeholder, not for production`}
        >
          <CueFrame className="h-2.5 w-2.5" />
          {badge}
        </span>
      ) : null}
    </div>
  );
}
