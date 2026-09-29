import { describe, expect, it, vi } from "vitest";
import { handlePublicSite } from "../src/public-site";

describe("public staging same-origin facade", () => {
  it("forwards inquiry requests through the operations service binding", async () => {
    const operations = { fetch: vi.fn().mockResolvedValue(new Response("api", { status: 201 })) };
    const assets = { fetch: vi.fn().mockResolvedValue(new Response("asset")) };
    const response = await handlePublicSite(new Request("https://public.example.test/v1/inquiries", { method: "POST" }), { OPERATIONS_API: operations, ASSETS: assets });
    expect(response.status).toBe(201);expect(operations.fetch).toHaveBeenCalledOnce();expect(assets.fetch).not.toHaveBeenCalled();
  });
  it("serves static paths with review-only robots protection", async () => {
    const operations = { fetch: vi.fn() };
    const assets = { fetch: vi.fn().mockResolvedValue(new Response("asset", { headers: { "Content-Type": "text/html" } })) };
    const response = await handlePublicSite(new Request("https://review.example.test/check-availability/"), { OPERATIONS_API: operations, ASSETS: assets,PUBLIC_SITE_PRODUCTION_HOSTNAMES:"focuslabproductions.com",PUBLIC_SITE_REVIEW_HOSTNAMES:"review.example.test" });
    expect(await response.text()).toBe("asset");expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");expect(operations.fetch).not.toHaveBeenCalled();
  });
  it("allows indexing only for an explicitly configured production hostname",async()=>{
    const operations={fetch:vi.fn()};const assets={fetch:vi.fn().mockResolvedValue(new Response("asset",{headers:{"X-Robots-Tag":"noindex, nofollow"}}))};const env={OPERATIONS_API:operations,ASSETS:assets,PUBLIC_SITE_PRODUCTION_HOSTNAMES:"focuslabproductions.com",PUBLIC_SITE_REVIEW_HOSTNAMES:"focus-lab-public-staging.example.workers.dev"};
    const production=await handlePublicSite(new Request("https://focuslabproductions.com/"),env);expect(production.headers.get("X-Robots-Tag")).toBeNull();
    const review=await handlePublicSite(new Request("https://focus-lab-public-staging.example.workers.dev/"),env);expect(review.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const unknown=await handlePublicSite(new Request("https://unknown.example.test/"),env);expect(unknown.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
  it("passes chat and secure resume responses through unchanged", async () => {
    const upstream=Response.json({ok:true});const operations={fetch:vi.fn().mockResolvedValue(upstream)};const assets={fetch:vi.fn()};
    expect(await handlePublicSite(new Request("https://public.example.test/v1/chat/resume",{headers:{"X-Chat-Resume-Token":"opaque"}}),{OPERATIONS_API:operations,ASSETS:assets})).toBe(upstream);
    expect(operations.fetch).toHaveBeenCalledOnce();expect(assets.fetch).not.toHaveBeenCalled();
  });
});
