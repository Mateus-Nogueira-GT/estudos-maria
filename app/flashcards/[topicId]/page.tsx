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
        <Link href="/" className="mt-4 inline-block text-accent underline">
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
        <h1 className="text-xl font-semibold text-ink-100">{topic.name}</h1>
        <p className="mt-4 text-sm text-ink-300">Sem flashcards para este tópico ainda.</p>
      </main>
    );
  }

  const card = order[index];
  const atEnd = index >= order.length - 1;
  const atStart = index <= 0;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar aos tópicos
      </Link>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-ink-400">Flashcards</p>
        <h1 className="mt-1 text-lg font-semibold text-ink-100">{topic.name}</h1>
      </div>

      {card && (
        <Flashcard card={card} questionNumber={index + 1} totalCards={order.length} />
      )}

      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={atStart}
          className="flex items-center gap-2 rounded-md border border-ink-700 px-4 py-2 text-sm text-ink-100 transition hover:border-ink-500 disabled:opacity-40"
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
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-accent/90"
        >
          {atEnd ? "Recomeçar" : "Próximo"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
