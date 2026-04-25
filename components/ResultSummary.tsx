"use client";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { formatPct } from "@/lib/progress";

type Props = {
  topicName: string;
  correct: number;
  partial: number;
  wrong: number;
  total: number;
  topicMasteryAfter: number;
  onRestart: () => void;
};

export function ResultSummary({
  topicName,
  correct,
  partial,
  wrong,
  total,
  topicMasteryAfter,
  onRestart,
}: Props) {
  const sessionPct = total > 0 ? (correct + 0.5 * partial) / total : 0;
  return (
    <div className="glass glass-edge mx-auto flex max-w-lg flex-col gap-6 rounded-3xl p-8 text-center shadow-[0_0_80px_-20px_rgba(196,181,253,0.5)]">
      <div>
        <p className="text-xs uppercase tracking-wider text-ink-300">Sessão concluída</p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-100">
          {topicName}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-2xl border border-ok/40 bg-ok/10 p-3 shadow-[0_0_40px_-12px_rgba(63,180,124,0.45)]">
          <p className="font-display font-mono text-3xl text-ok">{correct}</p>
          <p className="text-xs text-ink-200">acertos</p>
        </div>
        <div className="rounded-2xl border border-warn/40 bg-warn/10 p-3 shadow-[0_0_40px_-12px_rgba(224,163,65,0.45)]">
          <p className="font-display font-mono text-3xl text-warn">{partial}</p>
          <p className="text-xs text-ink-200">parciais</p>
        </div>
        <div className="rounded-2xl border border-err/40 bg-err/10 p-3 shadow-[0_0_40px_-12px_rgba(212,87,92,0.45)]">
          <p className="font-display font-mono text-3xl text-err">{wrong}</p>
          <p className="text-xs text-ink-200">erros</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-ink-300">Esta sessão</p>
        <ProgressBar value={sessionPct} />
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-ink-300">Domínio do tópico agora</p>
        <ProgressBar value={topicMasteryAfter} />
        <p className="mt-1 font-mono text-xs text-ink-400">{formatPct(topicMasteryAfter)}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-ink-100 transition hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer
        </button>
        <Link
          href="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)] transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="h-4 w-4" />
          Início
        </Link>
      </div>
    </div>
  );
}
