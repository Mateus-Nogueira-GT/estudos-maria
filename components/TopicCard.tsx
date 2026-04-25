"use client";
import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/cn";
import { getSubjectAccent } from "@/lib/subject-accent";
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
  const accent = getSubjectAccent(topic.subjectId);

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5",
        "glass glass-edge",
        "transition-transform duration-300 hover:-translate-y-0.5",
        accent.hoverGlow
      )}
    >
      {/* Pastel halo at top — gives the card its "subject identity" */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-b blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100",
          accent.gradient
        )}
      />

      <div className="relative flex-1">
        <h3 className="font-display text-base font-semibold text-ink-100 tracking-tight">
          {topic.name}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-300">
          {topic.description}
        </p>
      </div>

      {hasQuiz && (
        <div className="relative">
          <ProgressBar value={mastery} />
        </div>
      )}

      <div className="relative flex items-center gap-2 text-xs text-ink-400">
        {hasQuiz && <span>{questionCount} questões</span>}
        {hasQuiz && hasFlashcards && <span className="text-ink-600">·</span>}
        {hasFlashcards && <span>{flashcardCount} flashcards</span>}
      </div>

      <div className="relative flex gap-2">
        {hasQuiz && (
          <Link
            href={`/quiz/${topic.id}`}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
              accent.bg,
              accent.text,
              "ring-1",
              accent.border,
              "hover:bg-white/15 hover:ring-white/30"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Quiz
          </Link>
        )}
        {hasFlashcards && (
          <Link
            href={`/flashcards/${topic.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-ink-100 transition hover:border-white/25 hover:bg-white/10"
          >
            <Layers className="h-4 w-4" />
            Flashcards
          </Link>
        )}
      </div>
    </div>
  );
}
