"use client";

import { useEffect, useState } from "react";
import { brand, navItems, sectionIds } from "@/content/site";

export function Nav() {
  const [active, setActive] = useState("top");

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

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-surface/[0.86] backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-content items-center justify-between px-8 py-[14px]">
        <a
          href="#top"
          className="font-display text-[15px] font-semibold leading-none tracking-[-0.01em] text-ink"
        >
          {brand.name}
          <span className="text-accent">.</span>
        </a>
        <div className="flex flex-wrap items-center justify-end gap-1">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-lg px-[11px] py-2 font-display text-[13px] font-medium transition-colors duration-200 ${
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
