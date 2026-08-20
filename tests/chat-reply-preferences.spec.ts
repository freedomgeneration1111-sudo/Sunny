import { expect,test,type Page } from "@playwright/test";

const storageKey="focuslab.nativeChat.session.v1";
async function mockStatus(page:Page,state:"live"|"async"){await page.route("**/v1/chat/status",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({state,label:state==="live"?"Live Chat":"Send us a Message",destinationUrl:null,checkedAt:new Date().toISOString()})}));}
async function openAsyncDrawer(page:Page){await mockStatus(page,"async");await page.goto("/");await page.getByRole("button",{name:"Message Us (No Bots)"}).click();}
async function fillRequiredFields(page:Page,message:string){await page.getByLabel("Name").fill("Synthetic Visitor");await page.getByLabel("Email",{exact:true}).fill("visitor@example.test");await page.getByLabel("How can we help?").fill(message);}

test("default submission replies by email only",async({page})=>{
  let captured:Record<string,unknown>|null=null;
  await page.route("**/v1/chat/conversations",async route=>{captured=route.request().postDataJSON();await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({ok:true,conversation:{id:"conversation_default",resumeToken:"resume_default",mode:"async"},message:{id:"message_default",client_message_id:captured!.clientMessageId,sequence:1,sender_kind:"customer",body:captured!.message,created_at:new Date().toISOString()}})});});
  await openAsyncDrawer(page);
  await fillRequiredFields(page,"Default preference message");
  await page.getByRole("button",{name:"Send Message"}).click();
  await expect(page.getByRole("status")).toContainText("your message has been sent");
  expect(captured).toMatchObject({replyEmail:true,replySms:false,replyCall:false});
});

test("blocks submission when no reply method is selected",async({page})=>{
  let called=false;
  await page.route("**/v1/chat/conversations",route=>{called=true;return route.fulfill({status:500,body:"should not be called"});});
  await openAsyncDrawer(page);
  await fillRequiredFields(page,"No preference selected");
  await page.getByLabel("Reply by email").uncheck();
  await page.getByRole("button",{name:"Send Message"}).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Choose at least one way for us to reply.");
  expect(called).toBe(false);
});

test("blocks text/call preference without a phone number, then succeeds once phone is filled",async({page})=>{
  let captured:Record<string,unknown>|null=null;
  await page.route("**/v1/chat/conversations",async route=>{captured=route.request().postDataJSON();await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({ok:true,conversation:{id:"conversation_sms",resumeToken:"resume_sms",mode:"async"},message:{id:"message_sms",client_message_id:captured!.clientMessageId,sequence:1,sender_kind:"customer",body:captured!.message,created_at:new Date().toISOString()}})});});
  await openAsyncDrawer(page);
  await fillRequiredFields(page,"Text me back please");
  await page.getByLabel("Reply by text message").check();
  await page.getByRole("button",{name:"Send Message"}).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Phone is required to reply by text or call.");
  expect(captured).toBeNull();
  await page.getByLabel("Phone (optional)").fill("555-0100");
  await page.getByRole("button",{name:"Send Message"}).click();
  await expect(page.getByRole("status")).toContainText("your message has been sent");
  expect(captured).toMatchObject({replyEmail:true,replySms:true,replyCall:false,phone:"555-0100"});
});

test("reopening the site with a stored conversation resumes it instead of starting fresh",async({page})=>{
  let startCalled=false;
  await page.addInitScript(({key,value})=>window.localStorage.setItem(key,value),{key:storageKey,value:JSON.stringify({id:"conversation_resumed",resumeToken:"resume_token_persisted"})});
  await page.route("**/v1/chat/resume",async route=>{
    expect(route.request().headers()["x-chat-resume-token"]).toBe("resume_token_persisted");
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:true,conversation:{id:"conversation_resumed"},messages:[{id:"message_prior",client_message_id:"prior_1",sequence:1,sender_kind:"customer",body:"Message from a previous visit",created_at:"2026-08-12T10:00:00Z"}]})});
  });
  await page.route("**/v1/chat/conversations",route=>{startCalled=true;return route.fulfill({status:500,body:"should not start a fresh conversation"});});
  await mockStatus(page,"async");
  await page.goto("/");
  await page.getByRole("button",{name:"Message Us (No Bots)"}).click();
  await expect(page.getByText("Message from a previous visit")).toBeVisible();
  await expect(page.getByRole("textbox",{name:"Message"})).toBeVisible();
  expect(startCalled).toBe(false);
});

test("an invalid or revoked stored token falls back silently to a fresh form",async({page})=>{
  await page.addInitScript(({key,value})=>window.localStorage.setItem(key,value),{key:storageKey,value:JSON.stringify({id:"conversation_gone",resumeToken:"revoked_token"})});
  await page.route("**/v1/chat/resume",route=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({ok:false,error:{code:"conversation_access_denied",message:"Denied"}})}));
  await mockStatus(page,"async");
  await page.goto("/");
  await page.getByRole("button",{name:"Message Us (No Bots)"}).click();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("alert")).toHaveCount(0);
  expect(await page.evaluate((key)=>window.localStorage.getItem(key),storageKey)).toBeNull();
});
