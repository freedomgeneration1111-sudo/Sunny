import Image from "next/image"; import type { MediaAsset } from "@/lib/media";
export function MediaFrame({ asset, className = "", priority = false, sizes = "100vw", aspectRatioOverride }: { asset: MediaAsset; className?: string; priority?: boolean; sizes?: string; aspectRatioOverride?: string }) {
 return <figure className={`relative overflow-hidden rounded-media bg-surface-elevated ${className}`} style={{ aspectRatio: aspectRatioOverride ?? asset.desktopAspect }} data-mobile-aspect={asset.mobileAspect}>
  <Image src={asset.src} alt={asset.alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: asset.objectPosition }} />
 </figure>;
}
