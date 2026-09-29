export type PublicSiteEnv = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  OPERATIONS_API: { fetch(request: Request): Promise<Response> };
  PUBLIC_SITE_PRODUCTION_HOSTNAMES?: string;
  PUBLIC_SITE_REVIEW_HOSTNAMES?: string;
};

export async function handlePublicSite(request: Request, env: PublicSiteEnv): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (path === "/v1/inquiries" || path === "/v1/chat/status" || path === "/v1/chat/resume" || path.startsWith("/v1/chat/conversations") || path === "/health") {
    return env.OPERATIONS_API.fetch(request);
  }
  const asset = await env.ASSETS.fetch(request);
  const response = new Response(asset.body, asset);
  const hostname=new URL(request.url).hostname.toLowerCase();const production=hostnames(env.PUBLIC_SITE_PRODUCTION_HOSTNAMES);const review=hostnames(env.PUBLIC_SITE_REVIEW_HOSTNAMES);
  if(production.has(hostname)&&!review.has(hostname))response.headers.delete("X-Robots-Tag");
  else response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function hostnames(value:string|undefined){return new Set((value??"").split(",").map((hostname)=>hostname.trim().toLowerCase()).filter(Boolean));}

const publicSiteWorker={fetch:handlePublicSite};
export default publicSiteWorker;
