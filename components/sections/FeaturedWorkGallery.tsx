"use client";

import { useState } from "react";
import { MediaFrame } from "@/components/media/MediaFrame";
import { media } from "@/lib/media";
import { featuredWork } from "@/lib/content/home";

type Filter = (typeof featuredWork.filters)[number];

export function FeaturedWorkGallery() {
  const [active, setActive] = useState<Filter>("All");

  const visible =
    active === "All" ? featuredWork.items : featuredWork.items.filter((item) => item.category === active);

  return (
    <div>
      <div role="tablist" aria-label="Filter work by category" className="flex flex-wrap gap-2">
        {featuredWork.filters.map((filter) => {
          const isActive = filter === active;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(filter)}
              className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
                isActive
                  ? "border-pomegranate bg-pomegranate text-ivory"
                  : "border-ink/15 text-ink/70 hover:border-ink/30"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {visible.map((item, i) => (
          <MediaFrame
            key={item.mediaKey}
            asset={media[item.mediaKey]}
            className={`rounded-sm ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        ))}
      </div>
    </div>
  );
}
