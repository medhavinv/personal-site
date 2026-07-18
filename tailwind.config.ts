import type { Config } from "tailwindcss";

/**
 * Semantic color tokens map to CSS custom properties defined in globals.css.
 * The active palette (Indigo | Sage | Clay | Plum | Mono) swaps the values of
 * those variables, so every utility below re-themes automatically.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        ink: "var(--ink)",
        ink2: "var(--ink2)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        "accent-soft": "var(--accent-soft)",
        "accent-ring": "var(--accent-ring)",
        "accent-border": "var(--accent-border)",
        hairline: "var(--hairline)",
        "hairline-strong": "var(--hairline-strong)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1120px",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        blink: {
          "0%,100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.28s ease",
        blink: "blink 1s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
