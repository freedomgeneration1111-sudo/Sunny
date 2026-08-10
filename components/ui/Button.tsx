import Link from "next/link"; import type { ReactNode } from "react";
type Props = { href?: string; children: ReactNode; variant?: "primary" | "secondary" | "text"; className?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean };
export function Button({ href, children, variant = "primary", className = "", ...rest }: Props) {
 const styles = { primary: "bg-brand-primary text-on-brand hover:bg-brand-primary-hover", secondary: "border border-border bg-surface text-ink hover:border-ink", text: "text-brand-primary hover:text-brand-primary-hover" };
 const cls = `inline-flex min-h-12 items-center justify-center rounded-control px-6 py-3 text-sm font-bold transition-colors ${styles[variant]} ${className}`;
 return href ? <Link href={href} className={cls}>{children}</Link> : <button className={cls} {...rest}>{children}</button>;
}
