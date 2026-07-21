"use client";

import { Fragment, useState } from "react";
import { useContent } from "@/components/LocaleProvider";

// Render a paragraph string that may contain {strong}...{/strong} markup.
function renderRich(text: string) {
  const parts = text.split(/(\{strong\}.*?\{\/strong\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{strong\}(.*)\{\/strong\}$/);
    if (match) {
      return (
        <strong key={i} className="font-medium">
          {match[1]}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function PhotoTile({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] ${className ?? ""}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-hairline-strong bg-surface-alt">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
            Photo
          </span>
        </div>
      )}
    </div>
  );
}

export function Teaching() {
  const { flashcards, teaching, teachingPhotos } = useContent();
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cur = flashcards[card] ?? flashcards[0];

  const next = () => {
    setCard((c) => (c + 1) % flashcards.length);
    setFlipped(false);
  };
  const prev = () => {
    setCard((c) => (c - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  };

  return (
    <section id="teaching" className="border-t border-hairline py-[60px]">
      <div className="mb-5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-faint">
        {teaching.kicker}
      </div>
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-[18px] mt-0 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em]">
            {teaching.heading}
          </h2>
          {teaching.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`font-body text-[19px] leading-[1.65] text-ink2 ${
                i === 0 ? "mb-4 mt-0" : "m-0"
              }`}
            >
              {renderRich(p)}
            </p>
          ))}
        </div>

        {/* Q&A flip-card widget */}
        <div className="rounded-[16px] bg-ink p-[26px] text-paper">
          <div className="mb-[6px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-[#9a9285]">
            {teaching.widgetTitle}
          </div>
          <div className="mb-5 font-mono text-[12px] text-[#7d766a]">
            {teaching.cardCounter(card + 1, flashcards.length)}
          </div>
          <div
            className="mb-[18px] cursor-pointer [perspective:1200px]"
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="flip3d relative grid h-[360px] w-full"
              style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
            >
              {/* Front */}
              <div className="flex flex-col overflow-hidden rounded-[12px] border border-[rgba(244,241,234,0.14)] bg-[#2a2620] p-[22px] [grid-area:1/1] sm:p-[26px]">
                <div className="mb-[14px] shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent2">
                  {teaching.prompt}
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  <div className="my-auto font-body text-[20px] leading-[1.3] text-paper sm:text-[24px]">
                    {cur.front}
                  </div>
                </div>
                <div className="mt-[18px] shrink-0 font-mono text-[11px] text-[#7d766a]">
                  {teaching.tapToReveal}
                </div>
              </div>
              {/* Back */}
              <div className="flex flex-col overflow-hidden rounded-[12px] bg-accent2 p-[22px] text-ink [grid-area:1/1] [transform:rotateY(180deg)] sm:p-[26px]">
                <div className="mb-[14px] shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#7a2f13]">
                  {teaching.answer}
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  <div className="my-auto font-body text-[17px] leading-[1.45] sm:text-[19px]">
                    {cur.back}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <button
              onClick={prev}
              className="flex-1 rounded-full border border-[rgba(244,241,234,0.28)] bg-transparent p-[11px] font-display text-[13px] font-medium text-paper"
            >
              {teaching.prev}
            </button>
            <button
              onClick={next}
              className="flex-1 rounded-full border-none bg-paper p-[11px] font-display text-[13px] font-medium text-ink"
            >
              {teaching.next}
            </button>
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="mt-8">
        <div className="mb-4 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-faint">
          {teaching.galleryLabel}
        </div>
        {/* 2x2 grid of aspect tiles on mobile; the wide 2fr·1fr·1fr collage on
            larger screens. Flat children so the layout can reflow cleanly. */}
        <div className="grid grid-cols-2 gap-[14px] sm:h-[280px] sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-2">
          <PhotoTile
            src={teachingPhotos[0].src}
            alt={teachingPhotos[0].alt}
            className="aspect-[4/3] sm:aspect-auto sm:row-span-2 sm:h-full"
          />
          <PhotoTile
            src={teachingPhotos[1].src}
            alt={teachingPhotos[1].alt}
            className="aspect-[4/3] sm:aspect-auto sm:h-full"
          />
          <PhotoTile
            src={teachingPhotos[2].src}
            alt={teachingPhotos[2].alt}
            className="aspect-[4/3] sm:aspect-auto sm:h-full"
          />
          <PhotoTile
            src={teachingPhotos[3].src}
            alt={teachingPhotos[3].alt}
            className="aspect-[4/3] sm:aspect-auto sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:h-full"
          />
        </div>
      </div>
    </section>
  );
}
