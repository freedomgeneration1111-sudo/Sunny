import { expect,test,type Page } from "@playwright/test";

async function openReadyForm(page:Page){
  await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",route=>route.fulfill({contentType:"application/javascript",body:`window.turnstile={render:(el,opts)=>{el.textContent='Security check';setTimeout(()=>opts.callback('browser-test-token'),0);return 'widget-1'},remove:()=>{},reset:()=>{}};` }));
  await page.goto("/check-availability/");
  await page.getByRole("button",{name:"Wedding",exact:true}).click();
  await page.getByLabel("Preferred date").fill("2027-04-17");
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByLabel("Name").fill("Synthetic Browser Customer");
  await page.getByLabel("Email",{exact:true}).fill("browser@example.test");
  await expect(page.getByRole("button",{name:"Send Inquiry"})).toBeEnabled();
}

test("configured inquiry UI reports success only after API success",async({page})=>{
  await page.route("https://api.example.test/v1/inquiries",async route=>{const request=route.request();expect(request.headers()["idempotency-key"]).toBeTruthy();const body=request.postDataJSON();expect(body.turnstileToken).toBe("browser-test-token");expect(body.website).toBe("");await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({ok:true,inquiryId:"inq_synthetic",eventId:"evt_synthetic",createdAt:"2026-08-11T00:00:00.000Z",status:"received_for_review",message:"Your inquiry was received for human review. This is not an availability confirmation."})});});
  await openReadyForm(page);await page.getByRole("button",{name:"Send Inquiry"}).click();await expect(page.getByText("Thanks — we have your inquiry.",{exact:true})).toBeVisible();
});

test("configured inquiry UI shows a safe failure and preserves entries",async({page})=>{
  await page.route("https://api.example.test/v1/inquiries",route=>route.fulfill({status:500,contentType:"application/json",body:JSON.stringify({ok:false,error:{code:"internal_error",message:"technical database detail"}})}));
  await openReadyForm(page);await page.getByRole("button",{name:"Send Inquiry"}).click();await expect(page.locator("form [role=alert]")).toContainText("Your inquiry was not sent");await expect(page.locator("form [role=alert]")).not.toContainText("technical database detail");await expect(page.getByLabel("Name")).toHaveValue("Synthetic Browser Customer");
});

test("honeypot is excluded from keyboard and accessibility navigation",async({page})=>{await openReadyForm(page);const trap=page.locator('input[name="website"]');await expect(trap).toHaveAttribute("tabindex","-1");await expect(trap.locator("xpath=../..")).toHaveAttribute("aria-hidden","true");});


test("browser network failures never expose raw exception text",async({page})=>{
  await page.route("https://api.example.test/v1/inquiries",route=>route.abort("failed"));
  await openReadyForm(page);await page.getByRole("button",{name:"Send Inquiry"}).click();const alert=page.locator("form [role=alert]");await expect(alert).toContainText("We couldn't send your inquiry. Please try again. Your information has been kept on this page.");await expect(alert).not.toContainText("NetworkError");await expect(page.getByLabel("Name")).toHaveValue("Synthetic Browser Customer");
});
