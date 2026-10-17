import { config } from "@/lib/config";

/**
 * Sitewide LocalBusiness markup. Only carries fields backed by real,
 * verified data in config.ts -- no fabricated phone/email/sameAs. Contact
 * and social fields are blank in config.ts today, so they're omitted
 * entirely rather than emitted empty.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.businessName,
    description: config.shortStatement,
    url: config.siteUrl,
    image: new URL("/brand/focus-lab-mark.svg", config.siteUrl).toString(),
    areaServed: config.serviceArea,
    knowsLanguage: config.languages,
    ...(config.contact.verified && config.contact.phone ? { telephone: config.contact.phone } : {}),
    ...(config.contact.verified && config.contact.email ? { email: config.contact.email } : {}),
  };
}

/** Service schema for a single commercial service page. */
export function serviceJsonLd(serviceType: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    description,
    areaServed: config.serviceArea,
    provider: { "@type": "LocalBusiness", name: config.businessName, url: config.siteUrl },
  };
}
