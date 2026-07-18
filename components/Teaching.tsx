"use client";

import { Fragment, useState } from "react";
import { flashcards, teaching, teachingPhotos } from "@/content/site";

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
              className={`font-serif text-[19px] leading-[1.65] text-ink2 ${
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
            Card {card + 1} of {flashcards.length}
          </div>
          <div
            className="mb-[18px] h-[200px] cursor-pointer [perspective:1200px]"
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="flip3d relative h-full w-full"
              style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
            >
              {/* Front */}
              <div className="absolute inset-0 flex flex-col justify-center rounded-[12px] border border-[rgba(244,241,234,0.14)] bg-[#2a2620] p-[26px]">
                <div className="mb-[14px] font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent2">
                  Prompt
                </div>
                <div className="font-serif text-[24px] leading-[1.3] text-paper">
                  {cur.front}
                </div>
                <div className="mt-auto font-mono text-[11px] text-[#7d766a]">
                  tap to reveal →
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 flex flex-col justify-center rounded-[12px] bg-accent2 p-[26px] text-ink [transform:rotateY(180deg)]">
                <div className="mb-[14px] font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#7a2f13]">
                  Answer
                </div>
                <div className="font-serif text-[19px] leading-[1.45]">
                  {cur.back}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <button
              onClick={prev}
              className="flex-1 rounded-full border border-[rgba(244,241,234,0.28)] bg-transparent p-[11px] font-display text-[13px] font-medium text-paper"
            >
              ← Prev
            </button>
            <button
              onClick={next}
              className="flex-1 rounded-full border-none bg-paper p-[11px] font-display text-[13px] font-medium text-ink"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="mt-8">
        <div className="mb-4 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-faint">
          {teaching.galleryLabel}
        </div>
        <div className="grid h-[280px] grid-cols-[2fr_1fr_1fr] gap-[14px]">
          <PhotoTile
            src={teachingPhotos[0].src}
            alt={teachingPhotos[0].alt}
            className="h-full"
          />
          <div className="grid grid-rows-2 gap-[14px]">
            <PhotoTile src={teachingPhotos[1].src} alt={teachingPhotos[1].alt} />
            <PhotoTile src={teachingPhotos[2].src} alt={teachingPhotos[2].alt} />
          </div>
          <PhotoTile
            src={teachingPhotos[3].src}
            alt={teachingPhotos[3].alt}
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
}
