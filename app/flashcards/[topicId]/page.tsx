"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { Flashcard } from "@/components/Flashcard";
import { getTopic } from "@/lib/questions";
import { getFlashcardsByTopic } from "@/lib/flashcards";
import { shuffled } from "@/lib/questions";
import type { Flashcard as FlashcardType } from "@/lib/schema";

export default function FlashcardsPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const topic = getTopic(topicId);
  const allCards = useMemo(() => getFlashcardsByTopic(topicId), [topicId]);

  const [order, setOrder] = useState<FlashcardType[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setOrder(shuffled(allCards));
    setIndex(0);
  }, [allCards]);

  if (!topic) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-ink-300">Tópico não encontrado.</p>
        <Link href="/" className="mt-4 inline-block text-pastel-lilac underline">
          Voltar
        </Link>
      </main>
    );
  }

  if (allCards.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-ink-100"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-100">{topic.name}</h1>
        <p className="mt-4 text-sm text-ink-300">Sem flashcards para este tópico ainda.</p>
      </main>
    );
  }

  const card = order[index];
  const atEnd = index >= order.length - 1;
  const atStart = index <= 0;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-ink-200 backdrop-blur-md transition hover:border-white/25 hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar aos tópicos
      </Link>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pastel-lilac/80">
          Flashcards
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-100 sm:text-3xl">
          {topic.name}
        </h1>
      </div>

      {card && (
        <Flashcard card={card} questionNumber={index + 1} totalCards={order.length} />
      )}

      <div className="mt-8 flex items-center justify-between gap-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={atStart}
          className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-ink-100 transition hover:bg-white/10 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <button
          onClick={() => {
            if (atEnd) {
              setOrder(shuffled(allCards));
              setIndex(0);
            } else {
              setIndex((i) => i + 1);
            }
          }}
          className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)] transition hover:scale-[1.02] active:scale-[0.98]"
        >
          {atEnd ? "Recomeçar" : "Próximo"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
