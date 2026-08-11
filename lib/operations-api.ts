export type InquirySubmission = {
  eventType: string; date: string; location: string; services: string[]; guests: string;
  budget: string; name: string; email: string; phone: string; contact: string; note: string;
  turnstileToken: string; website: string;
};
export type InquirySubmissionResult = {
  ok: true; inquiryId: string; eventId: string; createdAt: string;
  status: "received_for_review"; message: string;
};
export type ChatStatus = {
  state: "live" | "async" | "unavailable"; label: "Live Chat" | "Send us a DM" | "Messaging unavailable";
  destinationUrl: string | null; checkedAt: string;
};
export type InquiryClientConfig = { apiUrl:string;enabled:boolean };

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

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
  const response = await fetcher(`${baseUrl}/v1/inquiries`,{
    method: "POST",headers: { "Content-Type": "application/json","Idempotency-Key": idempotencyKey },body: JSON.stringify(input),
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 429) throw new Error("Too many attempts. Please wait a minute and try again.");
    if (response.status === 400 || response.status === 422) throw new Error("Please review your details and complete the security check, then try again.");
    throw new Error("The inquiry could not be sent. Please try again.");
  }
  if (!isInquiryResult(body)) throw new Error("The inquiry service returned an unexpected response.");
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
