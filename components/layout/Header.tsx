"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HeroLogoFlare } from "@/components/brand/HeroLogoFlare";
import { PublicChatTrigger } from "@/components/operations/NativeChatPanel";
import { config } from "@/lib/config";

/**
 * Primary navigation is anchor-first. The homepage carries the whole customer
 * journey, so these links scroll within `/` and cross-navigate to `/#anchor`
 * from anywhere else. `Pricing` and `Check Availability` are real routes.
 *
 * Planning guides deliberately live in the footer, not here — the header stays
 * focused on the event types, pricing, and the conversion action.
 */
const anchorNav = [
  { anchor: "weddings", label: "Weddings" },
  { anchor: "asian-weddings", label: "Asian Weddings" },
  { anchor: "parties", label: "Parties" },
  { anchor: "corporate", label: "Corporate" },
] as const;

const routeNav = [{ href: "/pricing", label: "Pricing" }] as const;

export function Header() {
  const path = usePathname();
  const isHome = path === "/";
  const [heroTop, setHeroTop] = useState(isHome);
  const [mobile, setMobile] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobile(false);
    setHeroTop(isHome);
  }, [isHome, path]);

  useEffect(() => {
    if (!isHome) return;

    const sentinel = document.getElementById("home-hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroTop(entry?.isIntersecting ?? false),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  // Scroll-spy: mark whichever anchored section currently owns the viewport.
  useEffect(() => {
    if (!isHome) {
      setActiveAnchor(null);
      return;
    }

    const sections = anchorNav
      .map((item) => document.getElementById(item.anchor))
      .filter((element): element is HTMLElement => element !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveAnchor(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobile(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const anchorHref = (anchor: string) => (isHome ? `#${anchor}` : `/#${anchor}`);
  const routeActive = (href: string) => path === href || path.startsWith(`${href}/`);
  const expanded = isHome && heroTop && !mobile;
  const headerTone = expanded
    ? "border-transparent bg-transparent text-on-brand"
    : "border-border/70 bg-canvas/95 text-ink shadow-[0_8px_28px_rgba(17,18,20,.08)] backdrop-blur";
  const navHover = expanded
    ? "hover:text-brand-accent aria-[current=true]:text-brand-accent aria-[current=page]:text-brand-accent"
    : "hover:text-brand-primary aria-[current=true]:text-brand-primary aria-[current=page]:text-brand-primary";

  return (
    <header
      data-testid="site-header"
      data-header-state={expanded ? "expanded" : "compact"}
      className={`${isHome ? "fixed" : "sticky"} left-0 right-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,color] duration-300 motion-reduce:transition-none ${headerTone}`}
    >
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 transition-[height,padding] duration-300 motion-reduce:transition-none md:px-8 lg:px-10 ${expanded ? "h-[104px] md:h-[128px] xl:h-[140px]" : "h-[var(--header-h)]"}`}
      >
        <Link
          href="/"
          aria-label="Focus Lab Productions home"
          className="relative flex min-w-0 items-center"
        >
          {/* The flare belongs to the transparent-over-photo state only. It is
              scoped to these two spans, which render solely while `expanded`
              — i.e. the homepage header sitting over the hero image. */}
          <span className={expanded ? "block w-[190px] sm:w-[225px] md:hidden" : "hidden"}>
            <HeroLogoFlare lockup="compact">
              <BrandLogo mode="compact" tone="light" priority />
            </HeroLogoFlare>
          </span>
          <span className={expanded ? "hidden w-[360px] md:block lg:w-[385px] xl:w-[410px]" : "hidden"}>
            <HeroLogoFlare lockup="expanded">
              <BrandLogo mode="expanded" tone="light" priority />
            </HeroLogoFlare>
          </span>
          {/* Scrolled nav uses the guide's stacked lockup. It is height-driven,
              not width-driven: the bar has a fixed height and a stacked logo is
              tall, so sizing it by width would overflow the header. */}
          <span
            className={
              expanded
                ? "hidden"
                : "hidden h-[58px] min-[380px]:block md:h-[64px] xl:h-[68px]"
            }
          >
            <BrandLogo mode="stacked" tone="dark" fit="height" priority />
          </span>
          <span className={expanded ? "hidden" : "block w-11 min-[380px]:hidden"}>
            <BrandLogo mode="mark" tone="dark" priority />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
          {anchorNav.map((item) => (
            <Link
              key={item.anchor}
              href={anchorHref(item.anchor)}
              aria-current={activeAnchor === item.anchor ? true : undefined}
              className={`text-sm font-semibold transition-colors ${navHover}`}
            >
              {item.label}
            </Link>
          ))}
          {routeNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={routeActive(item.href) ? "page" : undefined}
              className={`text-sm font-semibold transition-colors ${navHover}`}
            >
              {item.label}
            </Link>
          ))}
          {config.workPublished ? <Link href="/work">Work</Link> : null}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <PublicChatTrigger
            className={`hidden min-h-12 items-center rounded-control border px-4 text-sm font-bold transition-colors xl:inline-flex ${expanded ? "border-on-brand/45 text-on-brand hover:border-on-brand" : "border-border bg-transparent text-ink hover:border-ink"}`}
          />
          <Link
            href="/check-availability"
            className="hidden min-h-12 items-center rounded-control bg-brand-primary px-5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-primary-hover sm:inline-flex"
          >
            Check Availability
          </Link>
          <button
            ref={menuButton}
            type="button"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile((value) => !value)}
            className={`grid h-12 w-12 place-items-center rounded-control border transition-colors xl:hidden ${expanded ? "border-on-brand/40 text-on-brand hover:border-on-brand" : "border-border text-ink hover:border-ink"}`}
          >
            <span aria-hidden="true">{mobile ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {mobile ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile primary"
          className="max-h-[calc(100svh-var(--header-h))] overscroll-contain overflow-y-auto border-t border-border bg-canvas px-5 py-5 text-ink xl:hidden"
        >
          <div className="grid gap-1">
            <p className="px-3 pb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
              Your event
            </p>
            {anchorNav.map((item) => (
              <Link
                key={item.anchor}
                href={anchorHref(item.anchor)}
                onClick={() => setMobile(false)}
                className="rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt"
              >
                {item.label}
              </Link>
            ))}
            <p className="px-3 pt-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
              Focus Lab
            </p>
            {routeNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobile(false)}
                className="rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMobile(false)}
              className="rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt"
            >
              Our Approach
            </Link>
            <PublicChatTrigger
              onOpen={() => setMobile(false)}
              className="mt-3 min-h-12 rounded-control border border-border px-4 py-3 text-center font-bold text-ink hover:border-ink"
            />
            <Link
              href="/check-availability"
              onClick={() => setMobile(false)}
              className="mt-3 rounded-control bg-brand-primary px-4 py-4 text-center font-bold text-on-brand hover:bg-brand-primary-hover"
            >
              Check Availability
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
