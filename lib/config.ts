export const config = {
  siteUrl: "https://focuslabproductions.com",
  businessName: "Focus Lab Productions",
  shortStatement:
    "One crew for event media, entertainment and production across Dallas–Fort Worth.",
  serviceArea: "Dallas–Fort Worth",
  languages: ["English", "Urdu", "Hindi", "Punjabi"],
  contact: { phone: "", email: "", verified: false },
  social: { instagram: "", tiktok: "" },
  workPublished: false,
  /**
   * The interactive plan/quote builder — Add to Plan controls, the sticky plan
   * bar, running subtotals, and carrying selections into the inquiry.
   *
   * Off for launch: Focus Lab publishes pricing for reference and the team
   * prepares the actual quote around the real date, venue, hours, and services.
   * A genuinely useful automatic builder needs more pricing logic than the
   * current offer universe supports (exact, hourly, starting, custom,
   * duration-, venue-, and crew-dependent work).
   *
   * The capability is intact behind this flag, not deleted. Turning it back on
   * restores the full planner. See `tests/quote-builder-capability.spec.ts`.
   */
  quoteBuilderEnabled: false,
} as const;
