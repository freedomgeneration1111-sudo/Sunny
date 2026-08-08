import type { ReactNode } from "react";
import { config } from "@/lib/config";

type DevFlagProps = {
  children: ReactNode;
  /** Why this line is flagged — shown on hover/focus, not printed inline. */
  reason: string;
  className?: string;
};

/**
 * Same idea as the PROXY image badge, applied to copy. The build prompt's
 * media system only covers images; several lines in the copy doc carry
 * their own inline "do not publish until confirmed" notes (50+ combined
 * years, the SLA promise, etc.) with no equivalent visual treatment. This
 * closes that gap rather than silently dropping the flag once the text
 * leaves the markdown file.
 */
export function DevFlag({ children, reason, className }: DevFlagProps) {
  if (!config.showDevelopmentLabels) {
    return <>{children}</>;
  }

  return (
    <span
      className={`decoration-marigold decoration-2 underline-offset-4 [text-decoration-style:dashed] underline ${className ?? ""}`}
      title={`Unverified — ${reason}`}
    >
      {children}
    </span>
  );
}
