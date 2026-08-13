import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";
import { config } from "@/lib/config";
import { guides } from "@/lib/content/guides";

/**
 * The footer carries the depth the header deliberately leaves out: planning
 * guides, event pages, and services.
 *
 * Labels are distinct from the header on purpose. The header's "Weddings"
 * scrolls to `/#weddings`; the footer's "Wedding Planning Guide" goes to
 * `/weddings`. Two destinations should never share one label.
 */
const columns = [
  {
    heading: "Events & Planning",
    links: [
      { href: "/weddings", label: "Wedding Planning Guide" },
      { href: "/south-asian-weddings", label: "Shaadi Planning Guide" },
      { href: "/events/parties", label: "Party Planning Guide" },
      { href: "/events/corporate", label: "Corporate Event Guide" },
    ],
  },
  {
    heading: "Services",
    links: [
      { href: "/services/photo-video", label: "Photo + Video" },
      { href: "/services/entertainment-production", label: "Entertainment + Production" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "Our Approach" },
      { href: "/check-availability", label: "Check Availability" },
    ],
  },
] as const;

const linkClass =
  "inline-flex min-h-9 items-center text-on-brand/65 transition-colors hover:text-on-brand";

export function Footer() {
  return (
    <footer className="bg-ink py-16 text-on-brand">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="w-[205px]">
              <BrandLogo mode="compact" tone="light" />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-on-brand/65">
              {config.shortStatement}
            </p>
            <p className="mt-4 text-sm text-on-brand/65">
              Serving {config.serviceArea} · {config.languages.join(" · ")}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-sm font-bold">{column.heading}</h2>
              <ul className="mt-4 space-y-1 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <nav aria-label="Planning checklists" className="mt-12 border-t border-on-brand/15 pt-8">
          <h2 className="text-sm font-bold">Planning Checklists</h2>
          <ul className="mt-4 grid gap-x-10 gap-y-1 text-sm sm:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} className={linkClass}>
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-on-brand/15 pt-6 text-xs text-on-brand/45">
          <p>
            © {new Date().getFullYear()} {config.businessName}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-6">
            <Link href="/privacy" className="min-h-9 items-center hover:text-on-brand/80">
              Privacy
            </Link>
            <Link href="/terms" className="min-h-9 items-center hover:text-on-brand/80">
              Terms
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
