"use client";

import Link from "next/link";
import { useState } from "react";
import { CueFrame } from "@/components/brand/CueFrame";
import { config } from "@/lib/config";

const eventLinks = [
  { href: "/south-asian-weddings", label: "South Asian Weddings" },
  { href: "/weddings", label: "Weddings" },
  { href: "/parties", label: "Parties & Milestones" },
  { href: "/corporate", label: "Corporate & Organizations" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <CueFrame className="h-6 w-6 text-pomegranate" withCenter />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            {config.businessName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setEventsOpen(true)}
            onMouseLeave={() => setEventsOpen(false)}
          >
            <button
              type="button"
              className="font-body text-sm font-medium text-ink/80 transition-colors hover:text-ink"
              aria-expanded={eventsOpen}
              aria-haspopup="true"
              onClick={() => setEventsOpen((v) => !v)}
            >
              Events
            </button>
            {eventsOpen ? (
              <div className="absolute left-0 top-full w-64 pt-3">
                <ul className="rounded-md border border-ink/10 bg-ivory p-2 shadow-lg shadow-ink/5">
                  {eventLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded px-3 py-2 font-body text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <Link
            href="/#services"
            className="font-body text-sm font-medium text-ink/80 transition-colors hover:text-ink"
          >
            Services
          </Link>
          <Link
            href="/work"
            className="font-body text-sm font-medium text-ink/80 transition-colors hover:text-ink"
          >
            Work
          </Link>
          <Link
            href="/about"
            className="font-body text-sm font-medium text-ink/80 transition-colors hover:text-ink"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/check-availability"
            className="hidden rounded-full bg-pomegranate px-5 py-2.5 font-body text-sm font-semibold text-ivory transition-transform hover:scale-[1.03] sm:inline-block"
          >
            Check Availability
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-ink transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Primary"
          className="border-t border-ink/10 bg-ivory px-4 pb-6 pt-2 lg:hidden"
        >
          <p className="px-3 pt-3 font-body text-xs font-semibold uppercase tracking-wide text-ink/40">
            Events
          </p>
          {eventLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded px-3 py-2.5 font-body text-base text-ink/80"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-ink/10 pt-2">
            <Link
              href="/#services"
              className="block rounded px-3 py-2.5 font-body text-base text-ink/80"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/work"
              className="block rounded px-3 py-2.5 font-body text-base text-ink/80"
              onClick={() => setMenuOpen(false)}
            >
              Work
            </Link>
            <Link
              href="/about"
              className="block rounded px-3 py-2.5 font-body text-base text-ink/80"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <Link
            href="/check-availability"
            className="mt-4 block rounded-full bg-pomegranate px-5 py-3 text-center font-body text-sm font-semibold text-ivory"
            onClick={() => setMenuOpen(false)}
          >
            Check Availability
          </Link>
        </nav>
      ) : null}
      </header>

      {/* Mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-ink/10 bg-ink text-ivory sm:hidden">
        <a href={`tel:${config.phone.replace(/[^\d+]/g, "")}`} className="flex flex-col items-center gap-0.5 py-2.5 font-body text-xs">
          Call
        </a>
        <a href={`sms:${config.smsPhone.replace(/[^\d+]/g, "")}`} className="flex flex-col items-center gap-0.5 border-x border-ivory/10 py-2.5 font-body text-xs">
          Text
        </a>
        <Link href="/check-availability" className="flex flex-col items-center gap-0.5 py-2.5 font-body text-xs text-marigold">
          Check Date
        </Link>
      </div>
    </>
  );
}
