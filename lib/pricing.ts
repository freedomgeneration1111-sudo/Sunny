import source from "@/lib/content/servicePricing.json";
import { cmsBuildContent } from "@/lib/content/cmsContent";

export type PricingKey=keyof typeof source.values;
type PricingValue={amount:number;mode:"exact"|"from"|"hourly"|"custom";label:string};
type PricingValues=Record<PricingKey,PricingValue>;
const values:PricingValues=(cmsBuildContent?.pricing.values as PricingValues|undefined)??(source.values as PricingValues);
export const servicePricing={...source,values};

const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
export function formatPrice(key:PricingKey){const item=servicePricing.values[key];switch(item.mode){case"custom":return"Custom Quote";case"hourly":return`${money.format(item.amount)}/hour`;case"from":return`From ${money.format(item.amount)}`;default:return money.format(item.amount);}}
export function isCustomQuote(key:PricingKey){return servicePricing.values[key].mode==="custom";}
export function pricingLabel(key:PricingKey){return servicePricing.values[key].label;}
