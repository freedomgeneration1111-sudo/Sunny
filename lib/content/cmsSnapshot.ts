import staticPricing from "./servicePricing.json";

export type PricingMode="exact"|"from"|"hourly"|"custom";
export type PricingDocument={schemaVersion:1;values:Record<string,{amount:number;mode:PricingMode;label:string}>};
export type FaqItem={id:string;question:string;answer:string};
export type FaqDocument={schemaVersion:1;common:FaqItem[];pricing:FaqItem[]};
export type FocusCmsSnapshot={schemaVersion:1;business:"focus";exportedAt:string;documents:{pricing:{revisionId:string;schemaVersion:1;content:PricingDocument};faqs:{revisionId:string;schemaVersion:1;content:FaqDocument}};integrity:{algorithm:"SHA-256";hash:string}};
const pricingKeys=Object.keys(staticPricing.values).sort();

export function parseFocusCmsSnapshot(value:unknown):FocusCmsSnapshot{
  const snapshot=record(value,"snapshot");
  if(snapshot.schemaVersion!==1||snapshot.business!=="focus"||typeof snapshot.exportedAt!=="string")fail("Snapshot schema/business is incompatible");
  const documents=record(snapshot.documents,"documents");const pricingEnvelope=record(documents.pricing,"pricing document");const faqEnvelope=record(documents.faqs,"FAQ document");
  if(typeof pricingEnvelope.revisionId!=="string"||pricingEnvelope.schemaVersion!==1||typeof faqEnvelope.revisionId!=="string"||faqEnvelope.schemaVersion!==1)fail("Snapshot revision metadata is invalid");
  const pricing=parsePricing(pricingEnvelope.content);const faqs=parseFaqs(faqEnvelope.content);const integrity=record(snapshot.integrity,"integrity");
  if(integrity.algorithm!=="SHA-256"||typeof integrity.hash!=="string"||!/^sha256-[0-9a-f]{64}$/.test(integrity.hash))fail("Snapshot integrity metadata is invalid");
  return{schemaVersion:1,business:"focus",exportedAt:snapshot.exportedAt,documents:{pricing:{revisionId:pricingEnvelope.revisionId,schemaVersion:1,content:pricing},faqs:{revisionId:faqEnvelope.revisionId,schemaVersion:1,content:faqs}},integrity:{algorithm:"SHA-256",hash:integrity.hash}};
}
export function snapshotCore(snapshot:FocusCmsSnapshot){const {integrity:_,...core}=snapshot;void _;return core;}
export function stableStringify(value:unknown):string{if(Array.isArray(value))return`[${value.map(stableStringify).join(",")}]`;if(value&&typeof value==="object")return`{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;return JSON.stringify(value)??"null";}
function parsePricing(value:unknown):PricingDocument{const document=record(value,"pricing content");if(document.schemaVersion!==1)fail("Pricing schema version is incompatible");const values=record(document.values,"pricing values");const actual=Object.keys(values).sort();if(actual.join("|")!==pricingKeys.join("|"))fail("Pricing identifiers do not match Sunny's stable service inventory");for(const [key,itemValue] of Object.entries(values)){const item=record(itemValue,`price ${key}`);if(!Number.isInteger(item.amount)||Number(item.amount)<0||typeof item.label!=="string"||!item.label.trim()||!["exact","from","hourly","custom"].includes(String(item.mode)))fail(`Price ${key} is invalid`);}return document as PricingDocument;}
function parseFaqs(value:unknown):FaqDocument{const document=record(value,"FAQ content");if(document.schemaVersion!==1)fail("FAQ schema version is incompatible");for(const collection of ["common","pricing"] as const){if(!Array.isArray(document[collection]))fail(`${collection} FAQs must be an array`);const seen=new Set<string>();for(const value of document[collection]){const item=record(value,"FAQ");if(typeof item.id!=="string"||!item.id||seen.has(item.id)||typeof item.question!=="string"||!item.question.trim()||typeof item.answer!=="string"||!item.answer.trim())fail(`${collection} FAQs are invalid`);seen.add(item.id);}}return document as FaqDocument;}
function record(value:unknown,label:string):Record<string,unknown>{if(!value||typeof value!=="object"||Array.isArray(value))fail(`${label} must be an object`);return value as Record<string,unknown>;}
function fail(message:string):never{throw new Error(`Invalid Focus CMS snapshot: ${message}`);}
