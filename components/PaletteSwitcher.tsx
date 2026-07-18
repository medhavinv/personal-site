"use client";

import { PALETTES } from "@/content/site";
import { useTheme } from "@/components/ThemeProvider";
import { useContent } from "@/components/LocaleProvider";

/**
 * Compact palette switcher. The palette is the one theming prop from the
 * prototype; this exposes it as a small control so the swappable CSS-variable
 * sets are demonstrable. Selecting a palette swaps data-palette on the root.
 */
export function PaletteSwitcher() {
  const { palette, setPalette } = useTheme();
  const { themeLabel } = useContent();

  return (
    <label className="flex items-center gap-2">
      <span className="uppercase tracking-[0.08em] text-faint">{themeLabel}</span>
      <select
        value={palette}
        onChange={(e) => setPalette(e.target.value as (typeof PALETTES)[number])}
        aria-label="Color palette"
        className="cursor-pointer rounded-md border border-hairline-strong bg-surface px-2 py-1 font-mono text-[11px] text-ink"
      >
        {PALETTES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </label>
  );
}
