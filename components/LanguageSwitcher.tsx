"use client";

import { LOCALES, LOCALE_LABELS } from "@/content/site";
import { useLocale } from "@/components/LocaleProvider";

/** Segmented EN / ไทย toggle for the nav. */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-hairline-strong p-[2px]"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`rounded-full px-[10px] py-[3px] font-mono text-[11px] font-medium transition-colors duration-150 ${
              active ? "bg-ink text-paper" : "bg-transparent text-faint"
            }`}
          >
            {LOCALE_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
