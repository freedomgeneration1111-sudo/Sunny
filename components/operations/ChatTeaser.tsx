"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlan } from "@/components/planning/PlanProvider";
import { PublicChatTrigger } from "@/components/operations/NativeChatPanel";

export function ChatTeaser() {
  const pathname = usePathname();
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
  const teaser = pathname.startsWith("/asian-weddings") || pathname.startsWith("/guides/asian-wedding") || pathname.startsWith("/guides/mehndi")
    ? "Need help shaping your Asian wedding plan?"
    : "Need help shaping your plan?";

  return (
    <div data-testid="chat-teaser" className={`fixed right-4 z-30 max-w-[15rem] rounded-[16px] rounded-br-[4px] border border-border bg-surface px-4 py-3 text-ink shadow-[0_10px_32px_rgba(17,18,20,.18)] md:right-6 ${selected.length ? "bottom-24 md:bottom-28" : "bottom-5 md:bottom-6"}`}>
      <p className="mb-1 text-[.68rem] font-bold leading-tight text-ink-muted">{teaser}</p>
      <PublicChatTrigger className="min-h-11 text-left text-xs font-extrabold text-ink hover:text-brand-primary" />
    </div>
  );
}
