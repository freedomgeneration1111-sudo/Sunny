import type { ReactNode } from "react";
export const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => <p className={`text-xs font-bold uppercase tracking-[0.18em] text-brand-primary ${className}`}>{children}</p>;
export const DisplayHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => <h1 className={`font-display text-[clamp(3rem,6vw,5.5rem)] font-extrabold italic leading-[.96] tracking-[-.045em] text-balance ${className}`}>{children}</h1>;
export const SectionHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => <h2 className={`font-display text-[clamp(2rem,3.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-.035em] text-balance ${className}`}>{children}</h2>;
export const Lead = ({ children, className = "" }: { children: ReactNode; className?: string }) => <p className={`max-w-[65ch] text-lg leading-8 text-ink-muted md:text-xl ${className}`}>{children}</p>;
