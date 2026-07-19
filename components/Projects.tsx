"use client";

import { useContent } from "@/components/LocaleProvider";

export function Projects() {
  const { projects, builds } = useContent();
  return (
    <section id="projects" className="border-t border-hairline py-[60px]">
      <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {projects.kicker}
      </div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
        <h2 className="m-0 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
          {projects.heading}
        </h2>
      </div>
      <p className="mb-[30px] mt-0 max-w-[60ch] font-body text-[19px] leading-[1.6] text-ink2">
        {projects.intro}
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {builds.map((b) => (
          <div
            key={b.id}
            className="flex flex-col rounded-[12px] border border-hairline-strong bg-surface px-[26px] py-6"
          >
            <div className="mb-[14px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-accent">
              {b.meta}
            </div>
            <div className="mb-[10px] font-display text-[20px] font-semibold">
              {b.name}
            </div>
            <div className="font-body text-[16px] leading-[1.5] text-ink2">
              {b.desc}
            </div>
            {b.link && (
              <a
                href={b.link}
                target="_blank"
                rel="noopener"
                className="mt-[14px] font-mono text-[13px] font-medium text-accent transition-opacity hover:opacity-75"
              >
                {b.linkLabel ?? projects.visitSite}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
