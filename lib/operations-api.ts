export type InquirySubmission = {
  eventType: string; date: string; location: string; services: string[]; guests: string;
  budget: string; name: string; email: string; phone: string; contact: string; note: string;
  turnstileToken: string; website: string; availabilityChecked?: boolean;
};
export type InquirySubmissionResult = {
  ok: true; inquiryId: string; eventId: string; createdAt: string;
  status: "received_for_review"; message: string;
};
export type ChatStatus = {
  state: "live" | "async" | "unavailable"; label: "Live Chat" | "Send us a Message" | "Send us a DM" | "Messaging unavailable";
  destinationUrl: string | null; checkedAt: string;
};
export type AvailabilityStatus = "available" | "unavailable" | "unknown";
export type AvailabilityResult = { ok: true; date: string; status: AvailabilityStatus; nearby?: { date: string; status: AvailabilityStatus }[] };
export type InquiryClientConfig = { apiUrl:string;enabled:boolean };

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const inquiryFailureMessage = `We couldn't send your inquiry. Please try again. Your information has been kept on this page.`;
const inquiryRateLimitMessage = "Too many attempts. Please wait a minute and try again.";
const inquiryValidationMessage = "Please review your details and complete the security check, then try again.";

export function customerInquiryError(error:unknown){
  if(error instanceof Error&&(error.message===inquiryRateLimitMessage||error.message===inquiryValidationMessage))return error.message;
  return inquiryFailureMessage;
}

const apiUrl = process.env.NEXT_PUBLIC_INQUIRY_API_URL?.replace(/\/$/, "") ?? "";
const submissionRequested = process.env.NEXT_PUBLIC_INQUIRY_SUBMISSION_ENABLED === "true";
const publicConfig: InquiryClientConfig = { apiUrl,enabled:submissionRequested && Boolean(apiUrl) && Boolean(turnstileSiteKey) };
export const inquirySubmissionEnabled = publicConfig.enabled;
export const operationsApiConfigured = Boolean(apiUrl);

export function submitInquiry(input: InquirySubmission,idempotencyKey: string): Promise<InquirySubmissionResult> {
  return submitInquiryWithConfig(input,idempotencyKey,publicConfig);
}

export async function submitInquiryWithConfig(
  input: InquirySubmission,idempotencyKey: string,config: InquiryClientConfig,fetcher: typeof fetch = fetch,
): Promise<InquirySubmissionResult> {
  const baseUrl = config.apiUrl.replace(/\/$/, "");
  if (!config.enabled || !baseUrl) throw new Error("Inquiry transmission is not configured.");
  let response: Response;
  try {
    response = await fetcher(`${baseUrl}/v1/inquiries`,{
      method: "POST",headers: { "Content-Type": "application/json","Idempotency-Key": idempotencyKey },body: JSON.stringify(input),
    });
  } catch {
    throw new Error(inquiryFailureMessage);
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 429) throw new Error(inquiryRateLimitMessage);
    if (response.status === 400 || response.status === 422) throw new Error(inquiryValidationMessage);
    throw new Error(inquiryFailureMessage);
  }
  if (!isInquiryResult(body)) throw new Error(inquiryFailureMessage);
  return body;
}

export async function getChatStatus(signal?: AbortSignal): Promise<ChatStatus> {
  if (!operationsApiConfigured) return { state:"unavailable",label:"Messaging unavailable",destinationUrl:null,checkedAt:new Date().toISOString() };
  const response = await fetch(`${apiUrl}/v1/chat/status`,{ signal });
  if (!response.ok) throw new Error("Messaging status is temporarily unavailable.");
  const body: unknown = await response.json();
  if (!isChatStatus(body)) throw new Error("Messaging status returned an unexpected response.");
  return body;
}

/** Always resolves — never throws. A failed/unreachable/misconfigured check degrades to "unknown", never a raw error. */
export async function getAvailability(date: string, signal?: AbortSignal): Promise<AvailabilityResult> {
  if (!operationsApiConfigured) return { ok: true, date, status: "unknown" };
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/v1/availability?date=${encodeURIComponent(date)}`, { signal });
  } catch {
    return { ok: true, date, status: "unknown" };
  }
  if (!response.ok) return { ok: true, date, status: "unknown" };
  const body: unknown = await response.json().catch(() => null);
  return isAvailabilityResult(body) ? body : { ok: true, date, status: "unknown" };
}

function isInquiryResult(value: unknown): value is InquirySubmissionResult {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === true
    && "inquiryId" in value && typeof value.inquiryId === "string" && "eventId" in value && typeof value.eventId === "string"
    && "createdAt" in value && typeof value.createdAt === "string" && "status" in value && value.status === "received_for_review"
    && "message" in value && typeof value.message === "string";
}
function isChatStatus(value: unknown): value is ChatStatus {
  return typeof value === "object" && value !== null && "state" in value
    && (value.state === "live" || value.state === "async" || value.state === "unavailable")
    && "label" in value && typeof value.label === "string" && "destinationUrl" in value
    && (typeof value.destinationUrl === "string" || value.destinationUrl === null) && "checkedAt" in value && typeof value.checkedAt === "string";
}
function isAvailabilityStatus(value: unknown): value is AvailabilityStatus {
  return value === "available" || value === "unavailable" || value === "unknown";
}
function isAvailabilityResult(value: unknown): value is AvailabilityResult {
  if (typeof value !== "object" || value === null || !("ok" in value) || value.ok !== true) return false;
  if (!("date" in value) || typeof value.date !== "string") return false;
  if (!("status" in value) || !isAvailabilityStatus(value.status)) return false;
  if ("nearby" in value && value.nearby !== undefined) {
    if (!Array.isArray(value.nearby)) return false;
    return value.nearby.every((entry: unknown) =>
      typeof entry === "object" && entry !== null && "date" in entry && typeof entry.date === "string" && "status" in entry && isAvailabilityStatus(entry.status));
  }
  return true;
}
