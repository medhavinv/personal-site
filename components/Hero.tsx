"use client";

import { useContent } from "@/components/LocaleProvider";

export function Hero() {
  const { hero } = useContent();
  return (
    <section id="top" className="pb-10 pt-[76px]">
      <h1 className="m-0 max-w-[16ch] font-display text-[clamp(42px,6.6vw,84px)] font-bold leading-[0.98] tracking-[-0.03em]">
        {hero.headingBefore}
        <span className="text-accent">{hero.headingAccent}</span>
        {hero.headingAfter}
      </h1>
      <p className="mt-[30px] max-w-[56ch] font-body text-[clamp(18px,2.1vw,24px)] font-light leading-[1.5] text-ink2">
        {hero.lead}
      </p>
      <p className="mt-5 max-w-[56ch] font-body text-[clamp(18px,2.1vw,24px)] font-light leading-[1.5] text-ink2">
        {hero.arc}
      </p>
      {/* Company wordmarks: a uniform, muted credibility row, so a less-known
          startup reads as a peer of the recognizable names. */}
      <div className="mt-[26px] flex flex-wrap items-center gap-x-6 gap-y-[10px]">
        {hero.companies.map((c) => (
          <span
            key={c.id}
            className="font-display text-[16px] font-semibold tracking-[-0.01em] text-faint transition-colors duration-200 hover:text-ink sm:text-[18px]"
          >
            {c.label}
          </span>
        ))}
      </div>
      <div className="mt-[34px] flex flex-wrap gap-[14px]">
        <a
          href={hero.primaryCta.href}
          className="rounded-full bg-ink px-[26px] py-[13px] font-display text-[14px] font-medium text-paper transition-opacity hover:opacity-85"
        >
          {hero.primaryCta.label}
        </a>
        <a
          href={hero.secondaryCta.href}
          className="rounded-full border border-[rgba(30,27,22,0.3)] px-[26px] py-[13px] font-display text-[14px] font-medium text-ink transition-colors hover:border-ink hover:bg-surface"
        >
          {hero.secondaryCta.label}
        </a>
      </div>
    </section>
  );
}
