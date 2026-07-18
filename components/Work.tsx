"use client";

import { useState } from "react";
import { useContent } from "@/components/LocaleProvider";

export function Work() {
  const { roles, work } = useContent();
  const [filter, setFilter] = useState("All");
  const [openRole, setOpenRole] = useState<string | null>(work.defaultOpenRole);

  const visible = roles.filter(
    (r) => filter === "All" || r.tags.includes(filter),
  );

  return (
    <section id="work" className="border-t border-hairline py-[60px]">
      <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {work.kicker}
      </div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-5">
        <h2 className="m-0 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
          {work.heading}
        </h2>
        <div className="flex flex-wrap gap-2">
          {work.filters.map((k) => {
            const isActive = filter === k;
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-full px-[13px] py-2 font-mono text-[12px] font-medium transition-all duration-150 ${
                  isActive
                    ? "border border-ink bg-ink text-paper"
                    : "border border-[rgba(30,27,22,0.24)] bg-transparent text-ink"
                }`}
              >
                {work.filterLabels[k] ?? k}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-[rgba(30,27,22,0.18)]" />
        <div className="flex flex-col gap-[14px]">
          {visible.map((r) => {
            const open = openRole === r.id;
            return (
              <div key={r.id} className="relative pl-[34px]">
                <span
                  className="absolute left-0 top-[26px] h-[15px] w-[15px] rounded-full bg-paper transition-colors duration-200"
                  style={{
                    border: `3px solid ${open ? "var(--accent)" : "var(--ink)"}`,
                  }}
                />
                <div className="overflow-hidden rounded-[12px] border border-hairline-strong bg-surface">
                  <div
                    onClick={() =>
                      setOpenRole((cur) => (cur === r.id ? null : r.id))
                    }
                    className="flex cursor-pointer items-start justify-between gap-5 px-[26px] py-[22px]"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span className="font-display text-[19px] font-semibold">
                          {r.co}
                        </span>
                        <span className="font-mono text-[11px] text-faint">
                          {r.years} · {r.loc}
                        </span>
                      </div>
                      <div className="mb-2 font-display text-[14px] font-medium text-ink2">
                        {r.title}
                      </div>
                      <div className="max-w-[64ch] font-body text-[16px] leading-[1.5] text-[#5c554a]">
                        {r.summary}
                      </div>
                    </div>
                    <div className="w-6 flex-none text-center font-display text-[30px] font-light leading-[0.7] text-accent">
                      {open ? "–" : "+"}
                    </div>
                  </div>
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: open ? "620px" : "0",
                      opacity: open ? 1 : 0,
                      transition: "max-height .5s ease, opacity .35s ease",
                    }}
                  >
                    <div className="px-[26px] pb-6">
                      <ul className="mb-0 mt-[6px] list-disc border-t border-hairline pl-[18px] pt-[18px]">
                        {r.bullets.map((b, i) => (
                          <li
                            key={i}
                            className="mb-[9px] text-[14px] leading-[1.6] text-ink2"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-[10px]">
                        {r.metrics.map((m, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-surface-alt px-[13px] py-[7px] font-mono text-[12px] font-medium text-ink"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
