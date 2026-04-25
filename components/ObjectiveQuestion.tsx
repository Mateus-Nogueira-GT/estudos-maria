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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 font-mono uppercase tracking-wide",
            DIFFICULTY_BADGE[question.difficulty]
          )}
        >
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </div>

      <h2 className="text-lg font-medium leading-relaxed text-ink-100">{question.prompt}</h2>

      <div className="flex flex-col gap-2">
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
                "group rounded-lg border p-4 text-left transition",
                !showFeedback &&
                  "border-ink-700 bg-ink-800/50 hover:border-accent/40 hover:bg-ink-800",
                showFeedback && isCorrect && "border-ok/60 bg-ok/10",
                showFeedback && !isCorrect && isSelected && "border-err/60 bg-err/10",
                showFeedback && !isCorrect && !isSelected && "border-ink-700 bg-ink-800/30 opacity-80"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs uppercase",
                    !showFeedback && "border-ink-600 text-ink-300",
                    showFeedback && isCorrect && "border-ok bg-ok text-ink-950",
                    showFeedback && !isCorrect && isSelected && "border-err bg-err text-ink-950",
                    showFeedback && !isCorrect && !isSelected && "border-ink-600 text-ink-400"
                  )}
                >
                  {showFeedback && isCorrect ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : showFeedback && isSelected ? (
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    opt.id.toUpperCase()
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-ink-100">{opt.text}</p>
                  {showFeedback && (
                    <p
                      className={cn(
                        "mt-2 text-xs leading-relaxed",
                        isCorrect ? "text-ok/90" : "text-ink-300"
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
          className="ml-auto flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-accent/90"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
