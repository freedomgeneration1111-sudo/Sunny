type CueFrameProps = {
  className?: string;
  /** Show the center cue dot. Off by default for large decorative uses. */
  withCenter?: boolean;
  /** Animate the brackets drawing inward on mount (respects reduced motion via CSS). */
  animate?: boolean;
};

/**
 * Four independent corner brackets, like a camera viewfinder or a stage
 * mark — not a monogram, not a logo lockup. Meant to be recolored with
 * `text-*` (uses currentColor) and reused at very different scales: a
 * tiny header glyph, a full-bleed section divider, a reveal animation
 * wrapper.
 */
export function CueFrame({ className, withCenter = false, animate = false }: CueFrameProps) {
  const armLength = 22;
  const inset = 4;
  const size = 100;
  const far = size - inset;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={animate ? { animation: "var(--animate-cue-reveal)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {/* top-left */}
      <path
        d={`M ${inset} ${inset + armLength} L ${inset} ${inset} L ${inset + armLength} ${inset}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      {/* top-right */}
      <path
        d={`M ${far - armLength} ${inset} L ${far} ${inset} L ${far} ${inset + armLength}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      {/* bottom-right */}
      <path
        d={`M ${far} ${far - armLength} L ${far} ${far} L ${far - armLength} ${far}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      {/* bottom-left */}
      <path
        d={`M ${inset + armLength} ${far} L ${inset} ${far} L ${inset} ${far - armLength}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      {withCenter ? <circle cx={size / 2} cy={size / 2} r="3" fill="currentColor" /> : null}
    </svg>
  );
}
