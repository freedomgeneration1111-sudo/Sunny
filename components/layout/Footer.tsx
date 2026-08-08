import Link from "next/link";
import { CueFrame } from "@/components/brand/CueFrame";
import { config } from "@/lib/config";

const services = ["DJ & MC", "Photography", "Film", "Lighting & Effects", "Social Content"];

const events = [
  { href: "/south-asian-weddings", label: "South Asian Weddings" },
  { href: "/weddings", label: "Weddings" },
  { href: "/parties", label: "Parties & Milestones" },
  { href: "/corporate", label: "Corporate & Organizations" },
];

const utility = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/check-availability", label: "Check Availability" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink pb-24 pt-16 text-ivory sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <CueFrame className="h-5 w-5 text-marigold" withCenter />
              <span className="font-display text-base font-semibold">{config.businessName}</span>
            </div>
            <p className="mt-3 max-w-[22ch] font-body text-sm text-ivory/60">
              {config.shortStatement}
            </p>
          </div>

          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-ivory/40">
              Services
            </p>
            <ul className="mt-3 space-y-2">
              {services.map((s) => (
                <li key={s} className="font-body text-sm text-ivory/70">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-ivory/40">
              Events
            </p>
            <ul className="mt-3 space-y-2">
              {events.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="font-body text-sm text-ivory/70 hover:text-ivory">
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-ivory/40">
              Site
            </p>
            <ul className="mt-3 space-y-2">
              {utility.map((u) => (
                <li key={u.href}>
                  <Link href={u.href} className="font-body text-sm text-ivory/70 hover:text-ivory">
                    {u.label}
                  </Link>
                </li>
              ))}
              {/* "Privacy" is listed in the footer copy but has no route in
                  the build prompt's allowed route list — left unlinked
                  rather than pointing at a page that doesn't exist yet. */}
              <li className="font-body text-sm text-ivory/30">Privacy</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ivory/10 pt-6 font-body text-sm text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{config.phoneDisplay}</p>
          <p>{config.email}</p>
        </div>
      </div>
    </footer>
  );
}
