import Image from "next/image";

type BrandLogoProps = {
  mode?: "expanded" | "compact" | "stacked" | "mark";
  tone?: "light" | "dark";
  priority?: boolean;
  className?: string;
  /**
   * Which axis the caller is sizing. Wide lockups are driven by width; the
   * stacked lockup is tall, so in a fixed-height bar it has to be driven by
   * height or it overflows.
   */
  fit?: "width" | "height";
};

const assets = {
  expanded: {
    light: { src: "/brand/focus-lab-expanded-dark.svg", width: 1400, height: 470 },
    dark: { src: "/brand/focus-lab-primary-light.svg", width: 1400, height: 470 },
  },
  compact: {
    // The full "FocusLab | PRODUCTIONS" lockup runs to x≈1237 in the artwork,
    // so these dimensions must match the widened viewBox — next/image uses them
    // for the intrinsic aspect ratio.
    light: { src: "/brand/focus-lab-compact-dark.svg", width: 1250, height: 350 },
    dark: { src: "/brand/focus-lab-compact-light.svg", width: 1250, height: 350 },
  },
  // The guide's COMPACT / STACKED variant: mark above the wordmark, with
  // "— PRODUCTIONS —" beneath. Guide minimum width is 90px.
  stacked: {
    light: { src: "/brand/focus-lab-stacked-dark.svg", width: 707, height: 538 },
    dark: { src: "/brand/focus-lab-stacked-light.svg", width: 707, height: 538 },
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
  fit = "width",
}: BrandLogoProps) {
  const asset = assets[mode][tone];

  return (
    <Image
      src={asset.src}
      alt=""
      aria-hidden="true"
      width={asset.width}
      height={asset.height}
      className={`${fit === "height" ? "h-full w-auto" : "h-auto w-full"} ${className}`}
      priority={priority}
    />
  );
}
