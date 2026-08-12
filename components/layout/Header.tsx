"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PublicChatTrigger } from "@/components/operations/NativeChatPanel";
import { config } from "@/lib/config";

const groups = [
  {
    label: "Events",
    items: [
      { href: "/events/parties", label: "Parties & Celebrations" },
      { href: "/events/corporate", label: "Corporate & Community" },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/services/photo-video", label: "Photo + Video" },
      {
        href: "/services/entertainment-production",
        label: "Entertainment + Production",
      },
    ],
  },
] as const;

const direct = [
  { href: "/weddings", label: "Weddings" },
  { href: "/south-asian-weddings", label: "South Asian Weddings" },
] as const;

export function Header() {
  const path = usePathname();
  const isHome = path === "/";
  const [heroTop, setHeroTop] = useState(isHome);
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobile(false);
    setOpen(null);
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

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobile(false);
        setOpen(null);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const active = (href: string) => path === href || path.startsWith(`${href}/`);
  const expanded = isHome && heroTop && !mobile;
  const headerTone = expanded
    ? "border-transparent bg-transparent text-on-brand"
    : "border-border/70 bg-canvas/95 text-ink shadow-[0_8px_28px_rgba(17,18,20,.08)] backdrop-blur";
  const navHover = expanded
    ? "hover:text-brand-accent aria-[current=page]:text-brand-accent"
    : "hover:text-brand-primary aria-[current=page]:text-brand-primary";

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
          <span className={expanded ? "block w-[190px] sm:w-[225px] md:hidden" : "hidden"}>
            <BrandLogo mode="compact" tone="light" priority />
          </span>
          <span className={expanded ? "hidden w-[360px] md:block lg:w-[385px] xl:w-[410px]" : "hidden"}>
            <BrandLogo mode="expanded" tone="light" priority />
          </span>
          <span className={expanded ? "hidden" : "hidden w-[205px] min-[380px]:block sm:w-[230px]"}>
            <BrandLogo mode="compact" tone="dark" priority />
          </span>
          <span className={expanded ? "hidden" : "block w-11 min-[380px]:hidden"}>
            <BrandLogo mode="mark" tone="dark" priority />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
          {direct.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={`text-sm font-semibold transition-colors ${navHover}`}
            >
              {item.label}
            </Link>
          ))}
          {groups.map((group) => (
            <div key={group.label} className="relative">
              <button
                type="button"
                aria-expanded={open === group.label}
                onClick={() => setOpen(open === group.label ? null : group.label)}
                className={`min-h-12 text-sm font-semibold transition-colors ${navHover}`}
              >
                {group.label} <span aria-hidden="true">⌄</span>
              </button>
              {open === group.label ? (
                <div className="absolute left-0 top-full w-72 rounded-card border border-border bg-surface p-2 text-ink shadow-xl">
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-control px-4 py-3 text-sm font-semibold hover:bg-canvas-alt"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
          <Link
            href="/pricing"
            aria-current={active("/pricing") ? "page" : undefined}
            className={`text-sm font-semibold transition-colors ${navHover}`}
          >
            Pricing
          </Link>
          {config.workPublished ? <Link href="/work">Work</Link> : null}
        </nav>

        <div className="flex shrink-0 items-center gap-2"><PublicChatTrigger className={`hidden min-h-12 items-center rounded-control border px-4 text-sm font-bold transition-colors xl:inline-flex ${expanded?"border-on-brand/45 text-on-brand hover:border-on-brand":"border-border bg-transparent text-ink hover:border-ink"}`}/>
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
            {direct.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt">
                {item.label}
              </Link>
            ))}
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pt-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt">
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/pricing" className="rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt">
              Pricing
            </Link>
            <Link href="/about" className="rounded-control px-3 py-3 font-semibold hover:bg-canvas-alt">
              Our Approach
            </Link>
            <PublicChatTrigger onOpen={()=>setMobile(false)} className="mt-3 min-h-12 rounded-control border border-border px-4 py-3 text-center font-bold text-ink hover:border-ink"/>
            <Link
              href="/check-availability"
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
