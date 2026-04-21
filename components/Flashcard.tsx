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
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>
          Flashcard {questionNumber} de {totalCards}
          {isCloze && (
            <span className="ml-2 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-accent">
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
  return (
    <button
      onClick={onToggle}
      className="relative h-64 w-full [perspective:1200px]"
    >
      <div
        className={cn(
          "absolute inset-0 rounded-xl transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-ink-700 bg-ink-800/60 p-8 text-center [backface-visibility:hidden]">
          <p className="text-lg font-medium text-ink-100">{card.front}</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-auto rounded-xl border border-accent/40 bg-ink-800 p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-relaxed text-ink-100 whitespace-pre-line">{card.back}</p>
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
        "min-h-64 w-full rounded-xl border bg-ink-800/60 p-8 text-left transition",
        revealed ? "border-accent/40" : "border-ink-700 hover:border-ink-500"
      )}
    >
      <p className="text-base leading-relaxed text-ink-100 whitespace-pre-line">
        {segments.map((seg, i) =>
          seg.kind === "text" ? (
            <span key={i}>{seg.text}</span>
          ) : revealed ? (
            <span
              key={i}
              className="rounded bg-accent/20 px-1.5 py-0.5 font-medium text-accent"
            >
              {seg.answer}
            </span>
          ) : (
            <span
              key={i}
              className="inline-block min-w-[3ch] rounded border border-dashed border-ink-500 bg-ink-700/40 px-2 py-0.5 text-center font-mono text-ink-400"
              aria-label={seg.hint ? `lacuna: ${seg.hint}` : "lacuna"}
            >
              {seg.hint ? `[${seg.hint}]` : "[…]"}
            </span>
          )
        )}
      </p>
      {revealed && card.extra && (
        <div className="mt-4 border-t border-ink-700 pt-4 text-sm text-ink-300 whitespace-pre-line">
          {card.extra}
        </div>
      )}
    </button>
  );
}
