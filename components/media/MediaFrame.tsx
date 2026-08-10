import Image from "next/image"; import type { MediaAsset } from "@/lib/media"; import { config } from "@/lib/config";
export function MediaFrame({ asset, className = "", priority = false, sizes = "100vw", aspectRatioOverride }: { asset: MediaAsset; className?: string; priority?: boolean; sizes?: string; aspectRatioOverride?: string }) {
 return <figure className={`relative overflow-hidden rounded-media bg-surface-elevated ${className}`} style={{ aspectRatio: aspectRatioOverride ?? asset.desktopAspect }} data-mobile-aspect={asset.mobileAspect}>
  <Image src={asset.src} alt={asset.alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: asset.objectPosition }} />
  {config.showDevelopmentLabels && asset.truth === "development-placeholder" ? <figcaption className="absolute left-3 top-3 rounded-md bg-ink/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-brand">{asset.id} · Layout Placeholder</figcaption> : null}
 </figure>;
}
