"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from "react";

const STAGGER_STEP_MS = 90;
const STAGGER_MAX_STEPS = 6;

// useLayoutEffect warns on the server; this file only ever runs its effect in
// the browser, so fall back to useEffect during the (no-op) SSR pass.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type RevealProps = {
  children: ReactNode;
  /** Position among sibling reveals, staggered ~90ms apart. */
  index?: number;
  as?: ElementType;
  className?: string;
};

/**
 * The homepage's one scroll-reveal signature: fade in and rise ~20px on
 * entering the viewport, staggered across siblings by `index`. Content
 * already in view on mount is marked visible before first paint, so it never
 * animates in on load. prefers-reduced-motion is handled in globals.css.
 */
export function Reveal({ children, index = 0, as: Tag = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [instant, setInstant] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      setInstant(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delay = Math.min(index, STAGGER_MAX_STEPS) * STAGGER_STEP_MS;

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "reveal-visible" : ""} ${instant ? "reveal-instant" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
