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
    const response = await handlePublicSite(new Request("https://public.example.test/check-availability/"), { OPERATIONS_API: operations, ASSETS: assets });
    expect(await response.text()).toBe("asset");expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");expect(operations.fetch).not.toHaveBeenCalled();
  });
  it("forwards availability checks through the operations service binding", async () => {
    const operations = { fetch: vi.fn().mockResolvedValue(Response.json({ ok: true, date: "2027-06-10", status: "available" })) };
    const assets = { fetch: vi.fn() };
    const response = await handlePublicSite(new Request("https://public.example.test/v1/availability?date=2027-06-10"), { OPERATIONS_API: operations, ASSETS: assets });
    expect(response.status).toBe(200);expect(operations.fetch).toHaveBeenCalledOnce();expect(assets.fetch).not.toHaveBeenCalled();
  });
  it("passes chat and secure resume responses through unchanged", async () => {
    const upstream=Response.json({ok:true});const operations={fetch:vi.fn().mockResolvedValue(upstream)};const assets={fetch:vi.fn()};
    expect(await handlePublicSite(new Request("https://public.example.test/v1/chat/resume",{headers:{"X-Chat-Resume-Token":"opaque"}}),{OPERATIONS_API:operations,ASSETS:assets})).toBe(upstream);
    expect(operations.fetch).toHaveBeenCalledOnce();expect(assets.fetch).not.toHaveBeenCalled();
  });
});
