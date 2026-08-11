"use client";

import Script from "next/script";
import { useEffect,useId,useRef,useState } from "react";

type TurnstileApi = { render(container:HTMLElement,options:Record<string,unknown>):string;remove(widgetId:string):void;reset(widgetId:string):void };
declare global { interface Window { turnstile?:TurnstileApi } }
type Props={siteKey:string;onToken:(token:string)=>void;resetSignal:number};

export function TurnstileWidget({siteKey,onToken,resetSignal}:Props){
  const container=useRef<HTMLDivElement>(null);const widget=useRef<string|null>(null);const [ready,setReady]=useState(false);const [message,setMessage]=useState("Security verification is loading.");const descriptionId=useId();
  useEffect(()=>{if(!ready||!container.current||!window.turnstile||widget.current)return;widget.current=window.turnstile.render(container.current,{sitekey:siteKey,action:"inquiry_submit",size:"flexible",appearance:"interaction-only",callback:(token:string)=>{onToken(token);setMessage("Security verification complete.");},"expired-callback":()=>{onToken("");setMessage("Security verification expired. Please complete it again.");},"error-callback":()=>{onToken("");setMessage("Security verification could not load. Please try again.");return true;}});return()=>{if(widget.current&&window.turnstile)window.turnstile.remove(widget.current);widget.current=null;};},[onToken,ready,siteKey]);
  useEffect(()=>{if(resetSignal>0&&widget.current&&window.turnstile){window.turnstile.reset(widget.current);onToken("");setMessage("Please complete security verification again.");}},[onToken,resetSignal]);
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={()=>setReady(true)}/><div ref={container} aria-describedby={descriptionId} className="min-h-[65px] w-full max-w-md"/><p id={descriptionId} role="status" aria-live="polite" className="sr-only">{message}</p></>;
}
