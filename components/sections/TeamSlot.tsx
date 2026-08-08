import { MediaFrame } from "@/components/media/MediaFrame";
import { teamPortraitPlaceholder } from "@/lib/media";

export function TeamSlot({ role, fields }: { role: string; fields: readonly string[] }) {
  return (
    <div className="overflow-hidden rounded-sm border border-ink/10">
      <MediaFrame
        asset={{ ...teamPortraitPlaceholder, purpose: role }}
        aspectRatioOverride="4/5"
      />
      <div className="p-4">
        <p className="font-display text-base font-semibold text-ink">{role}</p>
        <dl className="mt-2 space-y-0.5">
          {fields.map((field) => (
            <div key={field} className="flex gap-1.5 font-body text-xs text-ink/40">
              <dt className="shrink-0">{field}:</dt>
              <dd className="italic">pending</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
