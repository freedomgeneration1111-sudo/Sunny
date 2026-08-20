import { Reveal } from "@/components/motion/Reveal";
import type { FAQ } from "@/lib/content/commercial";

export function FAQList({ items, stagger = false }: { items: readonly FAQ[]; stagger?: boolean }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((faq, index) => {
        const row = (
          <details className="group" open={index === 0}>
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-lg font-extrabold marker:content-none">
              <span>{faq.question}</span>
              <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="max-w-[65ch] pb-7 pr-12 leading-7 text-ink-muted">{faq.answer}</p>
          </details>
        );
        return stagger ? (
          <Reveal as="div" index={index} key={faq.question}>
            {row}
          </Reveal>
        ) : (
          <div key={faq.question}>{row}</div>
        );
      })}
    </div>
  );
}
