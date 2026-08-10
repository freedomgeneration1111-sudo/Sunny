import type { ReactNode } from "react";
export function Container({ children, variant = "content", className = "" }: { children: ReactNode; variant?: "wide" | "content" | "reading"; className?: string }) {
  const widths = { wide: "max-w-[1440px]", content: "max-w-[1240px]", reading: "max-w-[760px]" };
  return <div className={`mx-auto w-full px-5 md:px-8 lg:px-10 ${widths[variant]} ${className}`}>{children}</div>;
}
