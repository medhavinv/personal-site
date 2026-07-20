"use client";

import { useContent } from "@/components/LocaleProvider";

// A thin bridge band between Approach and Work: a one-line narrative plus a
// uniform row of company wordmarks. The uniform treatment is deliberate, so a
// less-known startup reads as a peer of the recognizable names. It carries no
// section number so it does not disturb the 01/02/03 kicker rhythm.
export function Logos() {
  const { logos } = useContent();
  return (
    <section aria-label={logos.overline} className="border-t border-hairline py-[46px]">
      <div className="mb-6 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {logos.overline}
      </div>
      <p className="mb-8 mt-0 max-w-[40ch] font-display text-[22px] font-medium leading-[1.28] tracking-[-0.01em] text-ink sm:text-[26px]">
        {logos.tagline}
      </p>
      <div className="flex flex-wrap items-center gap-x-9 gap-y-4">
        {logos.companies.map((c) => (
          <span
            key={c.id}
            className="font-display text-[20px] font-semibold tracking-[-0.01em] text-faint transition-colors duration-200 hover:text-ink sm:text-[24px]"
          >
            {c.label}
          </span>
        ))}
      </div>
    </section>
  );
}
