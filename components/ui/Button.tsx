import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Variants exist per background rather than per colour, because overriding
 * `secondary` with utility classes is a precedence fight the base classes tend
 * to win — which silently produces white text on a white button.
 *
 *   secondary  light backgrounds (canvas, alt)
 *   outline    dark backgrounds (ink)
 *   inverse    brand backgrounds (orange)
 */
type Variant = "primary" | "secondary" | "outline" | "inverse" | "text";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const styles: Record<Variant, string> = {
  primary: "bg-brand-primary text-on-brand hover:bg-brand-primary-hover",
  secondary: "border border-border bg-surface text-ink hover:border-ink",
  outline:
    "border border-on-brand/40 bg-transparent text-on-brand hover:border-on-brand hover:bg-on-brand/10",
  inverse: "border border-ink bg-ink text-on-brand hover:bg-ink/85",
  text: "text-brand-primary hover:text-brand-primary-hover",
};

export function Button({ href, children, variant = "primary", className = "", ...rest }: Props) {
  const cls = `inline-flex min-h-12 items-center justify-center rounded-control px-6 py-3 text-sm font-bold transition-colors ${styles[variant]} ${className}`;
  return href ? (
    <Link href={href} className={cls} onClick={rest.onClick}>
      {children}
    </Link>
  ) : (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
