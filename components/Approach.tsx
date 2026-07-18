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
      <p className="mb-9 mt-0 max-w-[64ch] font-body text-[19px] leading-[1.6] text-ink2">
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
                    : "border border-[rgba(30,27,22,0.18)] bg-surface text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Dark strip */}
        <div className="bg-ink px-[30px] py-7 text-paper">
          <div className="mb-[14px] font-display text-[24px] font-semibold leading-[1.1]">
            {facet.label}
          </div>
          <p className="m-0 mb-5 max-w-[70ch] font-body text-[18px] leading-[1.55] text-[#d8d1c4]">
            {facet.blurb}
          </p>
          <div className="border-t border-[rgba(244,241,234,0.16)] pt-[18px]">
            <div className="mb-[10px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-accent2">
              {approach.inPractice}
            </div>
            <p className="m-0 max-w-[70ch] text-[15px] leading-[1.6] text-paper">
              {facet.proof}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
