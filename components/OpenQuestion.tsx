"use client";
import { useState } from "react";
import { ChevronRight, Eye } from "lucide-react";
import type { OpenQuestion as OpenQuestionType, Result } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { DIFFICULTY_BADGE, DIFFICULTY_LABEL } from "@/lib/difficulty";

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
          aberta · {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </div>

      <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-ink-100 sm:text-2xl">
        {question.prompt}
      </h2>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={revealed}
        placeholder="Escreva sua resposta aqui..."
        className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-ink-100 placeholder:text-ink-500 focus:border-pastel-lilac/50 focus:outline-none focus:ring-2 focus:ring-pastel-lilac/30 disabled:opacity-70"
      />

      {!revealed && (
        <button
          onClick={handleReveal}
          className="ml-auto flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-ink-100 transition hover:bg-white/10"
        >
          <Eye className="h-4 w-4" />
          Revelar gabarito
        </button>
      )}

      {revealed && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-5">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-pastel-lilac">
              Gabarito modelo
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-100">
              {question.modelAnswer}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-pastel-lilac">
              Pontos-chave esperados
            </h3>
            <ul className="flex flex-col gap-1.5">
              {question.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-100">
                  <span className="mt-0.5 text-pastel-lilac">·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {question.reference && (
            <p className="text-xs italic text-ink-400">Referência: {question.reference}</p>
          )}

          <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
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
                    "flex-1 rounded-xl border bg-white/[0.03] px-3 py-2 text-sm font-medium transition",
                    opt.className,
                    selfGrade === opt.key && "bg-white/10"
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
          className="ml-auto flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)] transition hover:scale-[1.02] hover:shadow-[0_8px_32px_-6px_rgba(255,255,255,0.7)] active:scale-[0.98]"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
