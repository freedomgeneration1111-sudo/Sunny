import source from "@/lib/content/servicePricing.json";

/**
 * The published Focus Lab service and pricing menu.
 *
 * `lib/content/servicePricing.json` is the single customer-facing source of
 * truth for offerings, names, prices, and pricing modes. Changing what a
 * customer sees is an edit to that file — never to a component.
 */
export const servicePricing = source;

export type PricingKey = keyof typeof source.values;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Render a price the way its mode intends: $X, From $X, $X/hour, or Custom Quote. */
export function formatPrice(key: PricingKey) {
  const item = source.values[key];
  switch (item.mode) {
    case "custom":
      return "Custom Quote";
    case "hourly":
      return `${money.format(item.amount)}/hour`;
    case "from":
      return `From ${money.format(item.amount)}`;
    default:
      return money.format(item.amount);
  }
}

/** Custom-quote services show no figure, so callers can lay them out differently. */
export function isCustomQuote(key: PricingKey) {
  return source.values[key].mode === "custom";
}
