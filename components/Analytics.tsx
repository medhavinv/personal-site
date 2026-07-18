"use client";

import { useEffect } from "react";
import { sectionIds } from "@/content/site";
import { track, trackPageview } from "@/lib/analytics";

/**
 * Page instrumentation. Fires one pageview per load and measures how long each
 * section stays in view, so you can see which areas people actually look at.
 *
 * A section is "in view" while it owns the middle of the viewport. When it
 * scrolls away (or the page is hidden/unloaded) we send a section_view event
 * with the accumulated dwell time in milliseconds.
 */
export function Analytics() {
  useEffect(() => {
    trackPageview();

    const enteredAt: Record<string, number> = {};
    const totalDwell: Record<string, number> = {};

    const flush = (id: string) => {
      if (enteredAt[id] == null) return;
      const dwell = Date.now() - enteredAt[id];
      delete enteredAt[id];
      totalDwell[id] = (totalDwell[id] ?? 0) + dwell;
      // Only report meaningful looks (longer than a quick scroll-past).
      if (dwell >= 800) {
        track("section_view", { section: id, dwell_ms: dwell });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            if (enteredAt[id] == null) enteredAt[id] = Date.now();
          } else {
            flush(id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const flushAll = () => sectionIds.forEach(flush);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushAll();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flushAll);

    return () => {
      flushAll();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flushAll);
    };
  }, []);

  return null;
}
