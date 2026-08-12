"use client";

import { useEffect, useState } from "react";
import { usePlan } from "@/components/planning/PlanProvider";
import { PublicChatTrigger } from "@/components/operations/NativeChatPanel";

export function ChatTeaser() {
  const [visible, setVisible] = useState(false);
  const { selected } = usePlan();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 20_000);
    const reveal = () => setVisible(true);
    window.addEventListener("focuslab:plan-item-added", reveal);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focuslab:plan-item-added", reveal);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed right-4 z-30 max-w-[15rem] md:right-6 ${selected.length ? "bottom-24 md:bottom-28" : "bottom-5 md:bottom-6"}`}>
      <PublicChatTrigger className="chat-teaser-trigger min-h-12 rounded-[16px] rounded-br-[4px] border border-border bg-surface px-4 py-3 text-left text-xs font-extrabold text-ink shadow-[0_10px_32px_rgba(17,18,20,.18)] hover:border-brand-primary" />
    </div>
  );
}
