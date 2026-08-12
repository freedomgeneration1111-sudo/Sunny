"use client";
import { useEffect,useRef,useState } from "react";
import Link from "next/link";

type Message={id:string;client_message_id:string;sequence:number;sender_kind:"customer"|"responder"|"system";body:string;created_at:string};
type Session={id:string;resumeToken:string};
const storageKey="focuslab.conversationResume.v1";

export function ConversationResume(){
  const [session,setSession]=useState<Session|null>(null);const [messages,setMessages]=useState<Message[]>([]);
  const [state,setState]=useState<"loading"|"ready"|"error">("loading");const [error,setError]=useState("");
  const [reply,setReply]=useState("");const [sending,setSending]=useState(false);const [connection,setConnection]=useState("Connecting…");
  const socket=useRef<WebSocket|null>(null);
  useEffect(()=>{
    let active=true;let retry:number|undefined;
    const queryToken=new URLSearchParams(window.location.search).get("resume");
    const saved=readSavedSession();const token=queryToken??saved?.resumeToken;
    if(!token){setState("error");setError("This conversation link is missing or no longer available.");return;}
    fetch("/v1/chat/resume",{headers:{"X-Chat-Resume-Token":token},cache:"no-store"}).then(async(response)=>{
      const body=await response.json() as {conversation?:{id:string};messages?:Message[];error?:{message?:string}};
      if(!response.ok||!body.conversation)throw new Error("This conversation link is invalid or no longer available.");
      return{conversation:body.conversation,messages:body.messages??[]};
    }).then(({conversation,messages:history})=>{
      if(!active)return;const next={id:conversation.id,resumeToken:token};sessionStorage.setItem(storageKey,JSON.stringify(next));
      setSession(next);setMessages(history);setState("ready");window.history.replaceState(null,"","/conversation/");
      const connect=()=>{if(!active)return;const url=new URL(window.location.origin);url.protocol=url.protocol==="https:"?"wss:":"ws:";url.pathname=`/v1/chat/conversations/${encodeURIComponent(next.id)}/socket`;url.searchParams.set("resume",next.resumeToken);const current=new WebSocket(url);socket.current=current;current.onopen=()=>setConnection("Connected");current.onmessage=(event)=>{try{const payload=JSON.parse(String(event.data)) as {type?:string;message?:Message};if(payload.type==="message"&&payload.message)setMessages((value)=>reconcile(value,[payload.message!]));}catch{/* Ignore malformed frames. */}};current.onclose=()=>{setConnection("Reconnecting…");if(active)retry=window.setTimeout(connect,3000);};current.onerror=()=>setConnection("Connection interrupted");};connect();
    }).catch((reason)=>{if(active){sessionStorage.removeItem(storageKey);setState("error");setError(reason instanceof Error?reason.message:"This conversation could not be opened.");}});
    return()=>{active=false;if(retry)window.clearTimeout(retry);socket.current?.close();};
  },[]);
  async function send(event:React.FormEvent<HTMLFormElement>){event.preventDefault();if(!session||sending)return;const body=reply.trim();if(!body)return;setSending(true);setError("");const clientMessageId=crypto.randomUUID();try{const response=await fetch(`/v1/chat/conversations/${encodeURIComponent(session.id)}/messages`,{method:"POST",headers:{"Content-Type":"application/json","X-Chat-Resume-Token":session.resumeToken},body:JSON.stringify({body,clientMessageId})});const result=await response.json() as {message?:Message};if(!response.ok||!result.message)throw new Error();setMessages((value)=>reconcile(value,[result.message!]));setReply("");}catch{setError("Your message wasn’t sent. Please try again.");}finally{setSending(false);}}
  return <section className="conversation-resume-shell" aria-labelledby="conversation-title">
    <div className="conversation-resume-card">
      <header><p>Focus Lab Productions</p><h1 id="conversation-title">This is your conversation with Focus Lab.</h1>{state==="ready"?<small aria-live="polite">{connection}</small>:null}</header>
      {state==="loading"?<div className="conversation-resume-state" role="status">Opening your conversation…</div>:state==="error"?<div className="conversation-resume-state error" role="alert"><h2>Conversation unavailable</h2><p>{error}</p><Link href="/">Return to Focus Lab</Link></div>:<>
        <ol className="conversation-resume-messages" aria-live="polite">{messages.map((message)=><li key={message.id} data-sender={message.sender_kind}><span>{message.sender_kind==="customer"?"You":"Focus Lab"}</span><p>{message.body}</p></li>)}</ol>
        <form onSubmit={send}><label htmlFor="conversation-reply">Reply</label><textarea id="conversation-reply" name="message" autoComplete="off" maxLength={2000} value={reply} onChange={(event)=>setReply(event.target.value)} required/><button disabled={sending}>{sending?"Sending…":"Send reply"}</button></form>
        {error?<p className="conversation-resume-error" role="alert">{error}</p>:null}
      </>}
    </div>
  </section>;
}
function readSavedSession(){try{const value=sessionStorage.getItem(storageKey);return value?JSON.parse(value) as Session:null;}catch{return null;}}
function reconcile(current:Message[],incoming:Message[]){const values=new Map(current.map((message)=>[message.client_message_id,message]));for(const message of incoming)values.set(message.client_message_id,message);return [...values.values()].sort((a,b)=>a.sequence-b.sequence);}
