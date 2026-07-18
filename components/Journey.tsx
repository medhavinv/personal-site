"use client";

import { useMemo, useState } from "react";
import { cities, journey } from "@/content/site";
import {
  MAP_W,
  MAP_H,
  landPath,
  gratPath,
  mapReady,
  project,
} from "@/lib/worldMap";

export function Journey() {
  const [activeCity, setActiveCity] = useState(journey.defaultCity);

  // Project each city to viewBox coordinates once.
  const cityXY = useMemo(() => {
    const xy: Record<string, { x: number; y: number }> = {};
    cities.forEach((c) => {
      xy[c.id] = project(c.lng, c.lat);
    });
    return xy;
  }, []);

  const routePts = useMemo(
    () =>
      journey.routeOrder
        .map((id) => (cityXY[id] ? `${cityXY[id].x},${cityXY[id].y}` : ""))
        .filter(Boolean)
        .join(" "),
    [cityXY],
  );

  const active = cities.find((c) => c.id === activeCity) ?? cities[0];

  return (
    <section
      id="journey"
      className="border-t border-hairline py-[60px]"
    >
      <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {journey.kicker}
      </div>
      <h2 className="mb-[34px] mt-0 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
        {journey.heading}
      </h2>
      <div className="grid grid-cols-1 items-stretch gap-7 md:grid-cols-[1.5fr_1fr]">
        {/* Map */}
        <div className="relative h-[440px] overflow-hidden rounded-[12px] border border-hairline-strong bg-surface">
          {mapReady && (
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d={gratPath}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={0.4}
                opacity={0.08}
              />
              <path
                d={landPath}
                fill="var(--surface-alt)"
                stroke="var(--ink)"
                strokeWidth={0.5}
                strokeOpacity={0.25}
                strokeLinejoin="round"
              />
              <polyline
                points={routePts}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.4}
                strokeDasharray="5 5"
                opacity={0.7}
                strokeLinecap="round"
              />
              {cities.map((c) => {
                const isActive = activeCity === c.id;
                const p = cityXY[c.id] ?? { x: 0, y: 0 };
                const top = c.labelPos === "top";
                return (
                  <g
                    key={c.id}
                    onClick={() => setActiveCity(c.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 15 : 0}
                      fill="var(--accent)"
                      opacity={isActive ? 0.9 : 0}
                      style={{ transition: "all .2s" }}
                    />
                    <circle cx={p.x} cy={p.y} r={18} fill="transparent" />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 7 : 4.5}
                      fill={isActive ? "var(--accent)" : "var(--ink)"}
                      stroke="var(--surface)"
                      strokeWidth={1.5}
                      style={{ transition: "all .2s" }}
                    />
                    <text
                      x={p.x}
                      y={top ? p.y - 14 : p.y + 22}
                      textAnchor="middle"
                      fontFamily="var(--font-jetbrains-mono), monospace"
                      fontSize={14}
                      fontWeight={isActive ? 700 : 500}
                      fill={isActive ? "var(--accent)" : "var(--muted)"}
                      style={{ transition: "all .2s" }}
                    >
                      {c.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Detail card */}
        <div className="flex flex-col rounded-[12px] bg-ink px-[30px] py-8 text-paper">
          <div className="mb-4 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-accent2">
            {active.kicker} · {active.years}
          </div>
          <div className="mb-1 font-display text-[28px] font-semibold leading-[1.1]">
            {active.name}
          </div>
          <div className="mb-5 font-mono text-[13px] font-normal text-[#9a9285]">
            {active.country}
          </div>
          <p className="m-0 flex-1 font-serif text-[18px] leading-[1.6] text-[#d8d1c4]">
            {active.text}
          </p>
          <a
            href={active.link}
            className="mt-6 font-display text-[13px] font-medium text-accent2"
          >
            {active.linkLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
