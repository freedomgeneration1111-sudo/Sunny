import source from "@/docs/06_DEV_PRICING_DATA.json";

export const developmentPricing = source;
const publicationStage = process.env.NEXT_PUBLIC_PUBLICATION_STAGE ?? "prototype";
if (publicationStage === "production" && source.meta.status === "development_only") {
  throw new Error("Development-only pricing cannot be published with NEXT_PUBLIC_PUBLICATION_STAGE=production.");
}

export type PricingKey = keyof typeof source.values;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function formatPrice(key: PricingKey) {
  const item = source.values[key];
  if (item.mode === "custom-anchor-dev") return `Custom scope · ${money.format(item.amount)} DEV reference`;
  return `${String(item.mode).includes("starting") ? "From " : ""}${money.format(item.amount)}`;
}
