"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  event: AnalyticsEvent;
  details?: Record<string, string | number | boolean>;
};

export function TrackedLink({
  children,
  event,
  details,
  onClick,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        track(event, details);
        onClick?.(clickEvent);
      }}
    >
      {children}
    </Link>
  );
}
