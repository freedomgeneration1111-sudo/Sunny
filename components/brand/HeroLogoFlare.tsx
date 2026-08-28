import type { ReactNode } from "react";

/**
 * Decorative flare for the logo as it appears over the homepage hero photo.
 *
 * Two elements lifted from the client's marketing artwork: a warm starburst off
 * the icon's upper-right edge, and a soft streak beneath the lockup. Both are
 * purely ornamental — `aria-hidden`, no pointer events, and the logo's
 * accessible name is untouched. The SVG files themselves are not modified.
 *
 * Geometry is measured from the reference (`fllogo2.jpeg`): the warm glow reads
 * at 17.4% of the icon's width, centred 87.6% across and 13.5% down the icon's
 * own box. Those ratios are mapped onto each lockup's artwork below.
 *
 * Only applied where the header is transparent over the hero photo. On every
 * other route the header is opaque, so there is nothing for a flare to sit on.
 */
type Lockup = "compact" | "expanded";

/**
 * Per-lockup placement, as percentages of the rendered logo box.
 *
 *   compact  → focus-lab-compact-dark.svg,  viewBox "0 20 1250 350",
 *              mark spans x 65.1–302.9, y 54.2–292
 *   expanded → focus-lab-expanded-dark.svg, viewBox "0 0 1400 470",
 *              mark spans x 73.9–358.1, y 78.8–363
 *
 * Both lockups place their artwork's bottom edge at ~77% of the box height,
 * so a single streak position serves both.
 */
const PLACEMENT: Record<Lockup, { burstX: string; burstY: string; burstSize: string }> = {
  // icon width 237.8 of 1250 → burst box 0.55 × icon = 130.8 → 10.5%
  compact: { burstX: "21.9%", burstY: "18.9%", burstSize: "10.5%" },
  // icon width 284.2 of 1400 → burst box 0.55 × icon = 156.3 → 11.2%
  expanded: { burstX: "23.1%", burstY: "24.9%", burstSize: "11.2%" },
};

export function HeroLogoFlare({
  lockup,
  children,
}: {
  lockup: Lockup;
  children: ReactNode;
}) {
  const p = PLACEMENT[lockup];

  return (
    // `h-full` re-exports the header's logo-slot height (set on the ancestor
    // `<span>` in Header.tsx — same mechanism the compact/scrolled header uses)
    // down to this wrapper, so the child `<img class="h-full">` and this
    // element's `.hero-flare` (`inset: 0`) both resolve their percentages
    // against the intended slot height instead of collapsing to `auto` and
    // letting the artwork render at intrinsic size. `w-fit` shrink-wraps the
    // box to the sized artwork so the flare placement percentages stay
    // anchored to the logo, not to the full width of the nav row.
    <span className="relative block h-full w-fit">
      {children}
      <span
        aria-hidden="true"
        className="hero-flare"
        style={
          {
            "--burst-x": p.burstX,
            "--burst-y": p.burstY,
            "--burst-size": p.burstSize,
          } as React.CSSProperties
        }
      >
        <span className="hero-flare__burst" />
        <span className="hero-flare__streak" />
      </span>
    </span>
  );
}
