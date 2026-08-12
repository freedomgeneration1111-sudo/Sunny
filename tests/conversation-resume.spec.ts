import { expect,test } from "@playwright/test";

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{
    const NativeWebSocket=window.WebSocket;
    class TestWebSocket{
      static instances:TestWebSocket[]=[];static readonly OPEN=1;readonly OPEN=1;readyState=1;
      onopen:((event:Event)=>void)|null=null;onmessage:((event:MessageEvent)=>void)|null=null;onclose:((event:CloseEvent)=>void)|null=null;onerror:((event:Event)=>void)|null=null;
      constructor(readonly url:string|URL){
        if(!String(url).includes("/v1/chat/conversations/"))return new NativeWebSocket(url) as unknown as TestWebSocket;
        TestWebSocket.instances.push(this);window.setTimeout(()=>this.onopen?.(new Event("open")),0);
      }
      close(){this.onclose?.(new CloseEvent("close"));}
      send(){}
    }
    Object.defineProperty(window,"WebSocket",{configurable:true,value:TestWebSocket});
    Object.defineProperty(window,"__testSockets",{configurable:true,value:TestWebSocket.instances});
  });
  await page.route("**/v1/chat/status",async(route)=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({state:"async"})}));
});

test("secure resume opens the same conversation, reconnects realtime, and sends a customer reply",async({page})=>{
  const requests:Array<{url:string;headers:Record<string,string>;body:unknown}>=[];
  await page.route("**/v1/chat/resume",async(route)=>{
    expect(route.request().headers()["x-chat-resume-token"]).toBe("opaque-email-token");
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:true,conversation:{id:"conversation_resume_test"},messages:[
      {id:"message_customer",client_message_id:"customer_1",sequence:1,sender_kind:"customer",body:"Original customer message",created_at:"2026-08-12T10:00:00Z"},
      {id:"message_staff",client_message_id:"staff_1",sequence:2,sender_kind:"responder",body:"Staff continuity reply",created_at:"2026-08-12T10:05:00Z"},
    ]})});
  });
  await page.route("**/v1/chat/conversations/conversation_resume_test/messages",async(route)=>{requests.push({url:route.request().url(),headers:route.request().headers(),body:route.request().postDataJSON()});await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({ok:true,message:{id:"message_customer_reply",client_message_id:route.request().postDataJSON().clientMessageId,sequence:3,sender_kind:"customer",body:"Customer resumed reply",created_at:"2026-08-12T10:06:00Z"}})});});
  await page.goto("/conversation/?resume=opaque-email-token");
  await expect(page.getByRole("heading",{name:"This is your conversation with Focus Lab."})).toBeVisible();
  await expect(page.getByText("Original customer message")).toBeVisible();await expect(page.getByText("Staff continuity reply")).toBeVisible();
  await expect.poll(()=>page.url()).toMatch(/\/conversation\/$/);
  const sockets=await page.evaluate(()=>((window as typeof window&{__testSockets:Array<{url:string}>}).__testSockets).map((socket)=>String(socket.url)));
  expect(sockets.some((url)=>url.includes("/v1/chat/conversations/conversation_resume_test/socket")&&url.includes("resume=opaque-email-token"))).toBe(true);
  await page.getByLabel("Reply").fill("Customer resumed reply");await page.getByRole("button",{name:"Send reply"}).click();
  await expect(page.getByText("Customer resumed reply")).toBeVisible();expect(requests).toHaveLength(1);expect(requests[0]!.headers["x-chat-resume-token"]).toBe("opaque-email-token");
});

test("altered or invalid token fails safely without exposing CRM data",async({page})=>{
  await page.route("**/v1/chat/resume",async(route)=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({ok:false,error:{code:"conversation_access_denied",message:"Denied"}})}));
  await page.goto("/conversation/?resume=altered-token");await expect(page.getByRole("heading",{name:"Conversation unavailable"})).toBeVisible();await expect(page.getByText("This conversation link is invalid or no longer available.")).toBeVisible();await expect(page.locator("body")).not.toContainText("Denied");
});
