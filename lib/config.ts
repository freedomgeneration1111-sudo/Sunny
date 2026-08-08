/**
 * Central brand + environment config.
 *
 * `businessName` is a placeholder — FocusLab was flagged for trademark
 * risk, so Sunny Lab stands in until a cleared name comes back from the
 * client. Nothing outside this file should hardcode a brand string.
 *
 * `phone`/`email` use the reserved fictional 555 exchange and a .test
 * domain on purpose: obviously non-routable if this ever leaked before
 * real contact info is swapped in, no separate flag needed.
 */
export const config = {
  businessName: "Sunny Lab",
  shortStatement: "Event media + entertainment for Dallas–Fort Worth.",
  phone: "(214) 555-0142",
  phoneDisplay: "(214) 555-0142",
  smsPhone: "(214) 555-0142",
  email: "hello@sunnylab.test",
  serviceArea: "Dallas–Fort Worth",
  social: {
    instagram: "",
    tiktok: "",
  },
  /** Master switch for every PROXY / ASSET NEEDED / unverified-claim badge. */
  showDevelopmentLabels: true,
} as const;

export type SiteConfig = typeof config;
