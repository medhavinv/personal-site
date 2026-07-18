import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
  Noto_Sans_Thai,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { DEFAULT_PALETTE, DEFAULT_LOCALE } from "@/content/site";
import "./globals.css";

// Display face: a distinctive humanist grotesque with real character,
// used for headings and other prominent type.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Body/UI face: a clean, readable humanist sans for prose and interface text.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Thai glyph fallback: Latin display fonts lack Thai coverage, so Thai
// characters fall through to this while Latin keeps the design fonts.
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vin Vadhanasindhu · Product Manager",
  description:
    "Technical and strategic product manager. Interactive profile covering my journey, work, teaching, and things I've built.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      data-palette={DEFAULT_PALETTE}
      className={`${bricolage.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${notoSansThai.variable}`}
    >
      <body>
        <LocaleProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
