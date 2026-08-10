import type { ElementType, ReactNode } from "react";
export function Section({ children, theme = "default", compact = false, className = "", as: Tag = "section", id }: { children: ReactNode; theme?: "default" | "alt" | "dark" | "brand"; compact?: boolean; className?: string; as?: ElementType; id?: string }) {
  const themes = { default: "bg-canvas text-ink", alt: "bg-canvas-alt text-ink", dark: "bg-ink text-on-brand", brand: "bg-brand-primary text-on-brand" };
  return <Tag id={id} className={`${themes[theme]} ${compact ? "py-12 md:py-16" : "py-[var(--section-y)]"} ${className}`}>{children}</Tag>;
}
