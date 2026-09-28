import type { FaqDocument,PricingDocument } from "./cmsSnapshot";

type BuildContent={pricing:PricingDocument;faqs:FaqDocument;revisionIds:{pricing:string;faqs:string}};
export const cmsBuildContent=parseBuildContent(process.env.NEXT_PUBLIC_FOCUS_CMS_CONTENT_JSON);
function parseBuildContent(value:string|undefined):BuildContent|null{if(!value)return null;const parsed=JSON.parse(value) as BuildContent;return parsed;}
