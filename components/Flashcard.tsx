"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { parseCloze } from "@/lib/cloze";
import type { Flashcard as FlashcardType } from "@/lib/schema";

type Props = {
  card: FlashcardType;
  questionNumber: number;
  totalCards: number;
};

export function Flashcard({ card, questionNumber, totalCards }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [card.id]);

  const isCloze = card.type === "cloze";
  const hint = isCloze ? "Clique para revelar as lacunas" : "Clique no cartão para virar";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-ink-300">
        <span className="font-mono tabular-nums">
          Flashcard {questionNumber} de {totalCards}
          {isCloze && (
            <span className="ml-2 rounded-full border border-pastel-lilac/40 bg-pastel-lilac/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-pastel-lilac">
              cloze
            </span>
          )}
        </span>
        <span className="text-ink-500">{hint}</span>
      </div>

      {isCloze ? (
        <ClozeCard card={card} revealed={revealed} onToggle={() => setRevealed((r) => !r)} />
      ) : (
        <BasicCard card={card} flipped={revealed} onToggle={() => setRevealed((f) => !f)} />
      )}
    </div>
  );
}

function BasicCard({
  card,
  flipped,
  onToggle,
}: {
  card: Extract<FlashcardType, { type?: "basic" }>;
  flipped: boolean;
  onToggle: () => void;
}) {
  const hasImages = !!card.frontImages && card.frontImages.length > 0;
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-full [perspective:1200px]",
        hasImages ? "h-96" : "h-72"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-3xl transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div
          className={cn(
            "glass glass-edge absolute inset-0 rounded-3xl [backface-visibility:hidden]",
            hasImages
              ? "flex items-stretch justify-center gap-3 p-4"
              : "flex items-center justify-center p-8 text-center"
          )}
        >
          {hasImages ? (
            card.frontImages!.map((src, i) => (
              <div
                key={i}
                className="flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white/5 p-2"
              >
                <img
                  src={src}
                  alt={card.front}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <p className="font-display text-xl font-medium leading-snug text-ink-100">
              {card.front}
            </p>
          )}
        </div>
        <div className="glass-strong glass-edge absolute inset-0 flex items-center justify-center overflow-auto rounded-3xl p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_70px_-12px_rgba(196,181,253,0.45)]">
          <p className="text-sm leading-relaxed text-ink-100 whitespace-pre-line">
            {card.back}
          </p>
        </div>
      </div>
    </button>
  );
}

function ClozeCard({
  card,
  revealed,
  onToggle,
}: {
  card: Extract<FlashcardType, { type: "cloze" }>;
  revealed: boolean;
  onToggle: () => void;
}) {
  const segments = parseCloze(card.text);
  return (
    <button
      onClick={onToggle}
      className={cn(
        "glass glass-edge min-h-72 w-full rounded-3xl p-8 text-left transition",
        revealed && "shadow-[0_0_70px_-12px_rgba(196,181,253,0.45)]"
      )}
    >
      <p className="text-base leading-relaxed text-ink-100 whitespace-pre-line">
        {segments.map((seg, i) =>
          seg.kind === "text" ? (
            <span key={i}>{seg.text}</span>
          ) : revealed ? (
            <span
              key={i}
              className="rounded bg-pastel-lilac/20 px-1.5 py-0.5 font-medium text-pastel-lilac"
            >
              {seg.answer}
            </span>
          ) : (
            <span
              key={i}
              className="inline-block min-w-[3ch] rounded border border-dashed border-white/30 bg-white/[0.04] px-2 py-0.5 text-center font-mono text-ink-300"
              aria-label={seg.hint ? `lacuna: ${seg.hint}` : "lacuna"}
            >
              {seg.hint ? `[${seg.hint}]` : "[…]"}
            </span>
          )
        )}
      </p>
      {revealed && card.extra && (
        <div className="mt-4 border-t border-white/10 pt-4 text-sm text-ink-200 whitespace-pre-line">
          {card.extra}
        </div>
      )}
    </button>
  );
}
