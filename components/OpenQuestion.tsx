"use client";
import { useState } from "react";
import { ChevronRight, Eye } from "lucide-react";
import type { OpenQuestion as OpenQuestionType, Result } from "@/lib/schema";
import { cn } from "@/lib/cn";

type Props = {
  question: OpenQuestionType;
  onNext: (result: Result) => void;
  questionNumber: number;
  totalQuestions: number;
};

export function OpenQuestion({ question, onNext, questionNumber, totalQuestions }: Props) {
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [selfGrade, setSelfGrade] = useState<Result | null>(null);

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    if (selfGrade) {
      onNext(selfGrade);
      setDraft("");
      setRevealed(false);
      setSelfGrade(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className="rounded-full border border-ink-700 px-2 py-0.5 font-mono uppercase tracking-wide">
          aberta · {question.difficulty}
        </span>
      </div>

      <h2 className="text-lg font-medium leading-relaxed text-ink-100">{question.prompt}</h2>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={revealed}
        placeholder="Escreva sua resposta aqui..."
        className="min-h-[160px] w-full rounded-lg border border-ink-700 bg-ink-800/50 p-4 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-70"
      />

      {!revealed && (
        <button
          onClick={handleReveal}
          className="ml-auto flex items-center gap-2 rounded-md border border-ink-600 px-4 py-2 text-sm font-medium text-ink-100 transition hover:border-ink-500"
        >
          <Eye className="h-4 w-4" />
          Revelar gabarito
        </button>
      )}

      {revealed && (
        <div className="flex flex-col gap-4 rounded-lg border border-ink-700 bg-ink-800/30 p-5">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Gabarito modelo
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-200">
              {question.modelAnswer}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Pontos-chave esperados
            </h3>
            <ul className="flex flex-col gap-1.5">
              {question.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-200">
                  <span className="mt-0.5 text-accent">·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {question.reference && (
            <p className="text-xs italic text-ink-400">Referência: {question.reference}</p>
          )}

          <div className="mt-2 flex flex-col gap-2 border-t border-ink-700 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">
              Como foi sua resposta?
            </p>
            <div className="flex gap-2">
              {(
                [
                  { key: "correct", label: "Acertei", className: "border-ok/60 text-ok hover:bg-ok/10" },
                  { key: "partial", label: "Parcial", className: "border-warn/60 text-warn hover:bg-warn/10" },
                  { key: "wrong", label: "Errei", className: "border-err/60 text-err hover:bg-err/10" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelfGrade(opt.key)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition",
                    opt.className,
                    selfGrade === opt.key && "bg-ink-700/60"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {revealed && selfGrade && (
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
