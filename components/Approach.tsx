"use client";

import { useState } from "react";
import { useContent } from "@/components/LocaleProvider";

export function Approach() {
  const { approach, facets } = useContent();
  const [activeFacet, setActiveFacet] = useState(approach.defaultFacet);
  const facet = facets.find((f) => f.id === activeFacet) ?? facets[0];

  return (
    <section id="role" className="border-t border-hairline py-[60px]">
      <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {approach.kicker}
      </div>
      <h2 className="mb-3 mt-0 max-w-[20ch] font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
        {approach.heading}
      </h2>
      <p className="mb-9 mt-0 max-w-[70ch] font-body text-[19px] leading-[1.6] text-ink2">
        {approach.intro}
      </p>

      <div className="overflow-hidden rounded-[14px] border border-hairline-strong bg-surface">
        {/* Capability chips */}
        <div className="flex flex-wrap gap-[10px] px-7 py-[26px]">
          {facets.map((f) => {
            const isActive = activeFacet === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFacet(f.id)}
                className={`rounded-[10px] px-4 py-[11px] font-display text-[14px] font-medium transition-all duration-150 ${
                  isActive
                    ? "border border-transparent bg-accent text-white"
                    : "border border-[rgba(30,27,22,0.18)] bg-surface text-ink hover:border-[rgba(30,27,22,0.45)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Dark strip: description on the left, proof on the right, so the
            full-width box fills with two readable columns instead of a narrow
            single column. Stacks on mobile with a top divider. */}
        <div className="grid gap-y-6 bg-ink px-[30px] py-7 text-paper md:grid-cols-2">
          <div className="md:pr-12">
            <div className="mb-[14px] font-display text-[24px] font-semibold leading-[1.1]">
              {facet.label}
            </div>
            <p className="m-0 font-body text-[18px] leading-[1.55] text-on-ink">
              {facet.blurb}
            </p>
          </div>
          <div className="border-t border-on-ink-border pt-[18px] md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <div className="mb-[10px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-accent2">
              {approach.inPractice}
            </div>
            <p className="m-0 text-[15px] leading-[1.6] text-paper">
              {facet.proof}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
