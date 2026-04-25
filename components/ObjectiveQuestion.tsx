"use client";
import { useState } from "react";
import { Check, X, ChevronRight } from "lucide-react";
import type { ObjectiveQuestion as ObjectiveQuestionType, Result } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { DIFFICULTY_BADGE, DIFFICULTY_LABEL } from "@/lib/difficulty";

type Props = {
  question: ObjectiveQuestionType;
  onNext: (result: Result) => void;
  questionNumber: number;
  totalQuestions: number;
};

export function ObjectiveQuestion({ question, onNext, questionNumber, totalQuestions }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;

  function handleSelect(id: string) {
    if (answered) return;
    setSelected(id);
  }

  function handleNext() {
    const correct = question.options.find((o) => o.id === selected)?.isCorrect ?? false;
    onNext(correct ? "correct" : "wrong");
    setSelected(null);
  }

  return (
    <div className="glass glass-edge flex flex-col gap-6 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between text-xs text-ink-300">
        <span className="font-mono tabular-nums">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono uppercase tracking-wide",
            DIFFICULTY_BADGE[question.difficulty]
          )}
        >
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </div>

      <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-ink-100 sm:text-2xl">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showFeedback = answered;
          const isCorrect = opt.isCorrect;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={answered}
              className={cn(
                "group rounded-2xl border p-4 text-left transition-all duration-300",
                !showFeedback &&
                  "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]",
                showFeedback && isCorrect && "border-ok/60 bg-ok/10 shadow-[0_0_50px_-12px_rgba(63,180,124,0.55)]",
                showFeedback && !isCorrect && isSelected && "border-err/60 bg-err/10 shadow-[0_0_50px_-12px_rgba(212,87,92,0.55)]",
                showFeedback && !isCorrect && !isSelected && "border-white/5 bg-white/[0.02] opacity-70"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs uppercase",
                    !showFeedback && "border-white/15 text-ink-200",
                    showFeedback && isCorrect && "border-ok bg-ok text-ink-950",
                    showFeedback && !isCorrect && isSelected && "border-err bg-err text-ink-950",
                    showFeedback && !isCorrect && !isSelected && "border-white/10 text-ink-400"
                  )}
                >
                  {showFeedback && isCorrect ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : showFeedback && isSelected ? (
                    <X className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    opt.id.toUpperCase()
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-ink-100">{opt.text}</p>
                  {showFeedback && (
                    <p
                      className={cn(
                        "mt-2 text-xs leading-relaxed",
                        isCorrect ? "text-ok" : "text-ink-300"
                      )}
                    >
                      <span className="font-semibold">
                        {isCorrect ? "Por que é a correta: " : "Por que está errada: "}
                      </span>
                      {opt.explanation}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {question.reference && answered && (
        <p className="text-xs italic text-ink-400">Referência: {question.reference}</p>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="ml-auto flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)] transition hover:scale-[1.02] hover:shadow-[0_8px_32px_-6px_rgba(255,255,255,0.7)] active:scale-[0.98]"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
