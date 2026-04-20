"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import type { Flashcard as FlashcardType } from "@/lib/schema";

type Props = {
  card: FlashcardType;
  questionNumber: number;
  totalCards: number;
};

export function Flashcard({ card, questionNumber, totalCards }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>
          Flashcard {questionNumber} de {totalCards}
        </span>
        <span className="text-ink-500">Clique no cartão para virar</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
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
    </div>
  );
}
