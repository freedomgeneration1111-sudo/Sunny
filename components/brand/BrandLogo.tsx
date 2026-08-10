import Image from "next/image";

type BrandLogoProps = {
  mode?: "expanded" | "compact" | "mark";
  tone?: "light" | "dark";
  priority?: boolean;
  className?: string;
};

const assets = {
  expanded: {
    light: { src: "/brand/focus-lab-expanded-dark.svg", width: 1400, height: 470 },
    dark: { src: "/brand/focus-lab-primary-light.svg", width: 1400, height: 470 },
  },
  compact: {
    light: { src: "/brand/focus-lab-compact-dark.svg", width: 920, height: 350 },
    dark: { src: "/brand/focus-lab-compact-light.svg", width: 920, height: 350 },
  },
  mark: {
    light: { src: "/brand/focus-lab-mark.svg", width: 440, height: 440 },
    dark: { src: "/brand/focus-lab-mark.svg", width: 440, height: 440 },
  },
} as const;

export function BrandLogo({
  mode = "compact",
  tone = "dark",
  priority = false,
  className = "",
}: BrandLogoProps) {
  const asset = assets[mode][tone];

  return (
    <Image
      src={asset.src}
      alt=""
      aria-hidden="true"
      width={asset.width}
      height={asset.height}
      className={`h-auto w-full ${className}`}
      priority={priority}
    />
  );
}
