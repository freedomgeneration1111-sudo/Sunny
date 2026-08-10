"use client";

import { useEffect,useState } from "react";
import { track } from "@/lib/analytics";
import { getChatStatus,operationsApiConfigured,type ChatStatus } from "@/lib/operations-api";

/** Integration seam only. Intentionally not inserted into the visual header in this branch. */
export function LiveChatAction({ className = "" }: { className?: string }) {
  const [status,setStatus] = useState<ChatStatus | null>(null);
  useEffect(() => {
    if (!operationsApiConfigured) return;
    const controller = new AbortController();
    getChatStatus(controller.signal).then((value) => {
      setStatus(value);
      track(value.state === "live" ? "chat_status_live" : "chat_status_async");
      track("chat_action_viewed",{ state: value.state });
    }).catch(() => setStatus(null));
    return () => controller.abort();
  },[]);
  if (!status?.destinationUrl || status.state === "unavailable") return null;
  return <a href={status.destinationUrl} className={className} onClick={() => track("chat_action_clicked",{ state: status.state })} rel="noopener noreferrer">{status.state === "live" ? <span aria-hidden="true">● </span> : null}{status.label}</a>;
}
