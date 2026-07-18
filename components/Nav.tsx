"use client";

import { useEffect, useRef, useState } from "react";
import { brand, navItems, sectionIds } from "@/content/site";

export function Nav() {
  const [active, setActive] = useState("top");
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Active-section highlighting: mirror the prototype's IntersectionObserver
  // band so a link lights up while its section owns the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Keep the active link visible in the scrollable row (mobile site index).
  useEffect(() => {
    linkRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-surface/[0.86] backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-[10px] md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-[14px]">
        <a
          href="#top"
          className="shrink-0 whitespace-nowrap font-display text-[15px] font-semibold leading-none tracking-[-0.01em] text-ink"
        >
          {brand.name}
          <span className="text-accent">.</span>
        </a>
        <div className="no-scrollbar -mx-5 flex items-center gap-1 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                ref={(el) => {
                  linkRefs.current[item.id] = el;
                }}
                className={`shrink-0 whitespace-nowrap rounded-lg px-[11px] py-2 font-display text-[13px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-accent-soft text-ink"
                    : "bg-transparent text-faint"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
