import {describe,expect,it,vi} from "vitest";
import {submitInquiryWithConfig} from "../../lib/operations-api";

const submission={eventType:"Wedding",date:"2027-09-14",location:"Dallas, TX",services:["Photo"],guests:"80",budget:"",name:"Synthetic Browser Customer",email:"browser@example.test",phone:"",contact:"email",note:"",turnstileToken:"test-token",website:""};

describe("static website inquiry integration seam",()=>{
  it("fails truthfully while disabled",async()=>await expect(submitInquiryWithConfig(submission,"client-disabled-0001",{apiUrl:"",enabled:false})).rejects.toThrow("not configured"));
  it("sanitizes browser network exceptions",async()=>await expect(submitInquiryWithConfig(submission,"client-network-0001",{apiUrl:"https://api.example.test",enabled:true},async()=>{throw new TypeError("NetworkError");})).rejects.toThrow("We couldn't send your inquiry"));
  it("sends the stable Worker contract and returns its receipt",async()=>{
    const fetcher=vi.fn(async(...args:Parameters<typeof fetch>)=>{void args;return Response.json({ok:true,inquiryId:"inq_contract",contactId:"con_contract",eventId:"evt_contract",createdAt:"2026-08-17T00:00:00.000Z",status:"received_for_review",message:"Received",idempotentReplay:false},{status:201});});
    const result=await submitInquiryWithConfig(submission,"client-enabled-0001",{apiUrl:"https://operations.example.test",enabled:true},fetcher);
    expect(result).toMatchObject({inquiryId:"inq_contract",eventId:"evt_contract",status:"received_for_review"});
    const request=fetcher.mock.calls[0];expect(String(request?.[0])).toBe("https://operations.example.test/v1/inquiries");
    expect(request?.[1]?.headers).toMatchObject({"Idempotency-Key":"client-enabled-0001","Content-Type":"application/json"});
  });
});
