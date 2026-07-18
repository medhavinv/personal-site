import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="pb-10 pt-[76px]">
      <h1 className="m-0 max-w-[16ch] font-display text-[clamp(42px,6.6vw,84px)] font-bold leading-[0.98] tracking-[-0.03em]">
        {hero.headingBefore}
        <span className="text-accent">{hero.headingAccent}</span>
        {hero.headingAfter}
      </h1>
      <p className="mt-[30px] max-w-[56ch] font-serif text-[clamp(18px,2.1vw,24px)] font-light leading-[1.5] text-ink2">
        {hero.lead}
      </p>
      <div className="mt-[38px] flex flex-wrap gap-[14px]">
        <a
          href={hero.primaryCta.href}
          className="rounded-full bg-ink px-[26px] py-[13px] font-display text-[14px] font-medium text-paper"
        >
          {hero.primaryCta.label}
        </a>
        <a
          href={hero.secondaryCta.href}
          className="rounded-full border border-[rgba(30,27,22,0.3)] px-[26px] py-[13px] font-display text-[14px] font-medium text-ink"
        >
          {hero.secondaryCta.label}
        </a>
      </div>
      <div className="mt-[52px] grid grid-cols-3 overflow-hidden rounded-[10px] border border-hairline-strong bg-surface">
        {hero.facts.map((fact, i) => (
          <div
            key={fact.label}
            className={
              i < hero.facts.length - 1
                ? "border-r border-[rgba(30,27,22,0.14)] px-[22px] py-5"
                : "px-[22px] py-5"
            }
          >
            <div className="mb-[9px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-faint">
              {fact.label}
            </div>
            <div className="text-[16px] font-medium">{fact.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
