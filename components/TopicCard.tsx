"use client";
import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import type { Topic } from "@/lib/schema";

type Props = {
  topic: Topic;
  mastery: number;
  questionCount: number;
  flashcardCount: number;
};

export function TopicCard({ topic, mastery, questionCount, flashcardCount }: Props) {
  const hasQuiz = questionCount > 0;
  const hasFlashcards = flashcardCount > 0;
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-ink-700 bg-ink-800/60 p-5 transition hover:border-accent/50 hover:bg-ink-800">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-ink-100">{topic.name}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-ink-300">{topic.description}</p>
      </div>
      {hasQuiz && <ProgressBar value={mastery} />}
      <div className="flex items-center gap-2 text-xs text-ink-400">
        {hasQuiz && <span>{questionCount} questões</span>}
        {hasQuiz && hasFlashcards && <span className="text-ink-600">·</span>}
        {hasFlashcards && <span>{flashcardCount} flashcards</span>}
      </div>
      <div className="flex gap-2">
        {hasQuiz && (
          <Link
            href={`/quiz/${topic.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent/15 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/25"
          >
            <BookOpen className="h-4 w-4" />
            Quiz
          </Link>
        )}
        {hasFlashcards && (
          <Link
            href={`/flashcards/${topic.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-ink-600 px-3 py-2 text-sm font-medium text-ink-200 transition hover:border-ink-500 hover:text-ink-100"
          >
            <Layers className="h-4 w-4" />
            Flashcards
          </Link>
        )}
      </div>
    </div>
  );
}
