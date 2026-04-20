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
    <div className="mx-auto flex max-w-lg flex-col gap-6 rounded-xl border border-ink-700 bg-ink-800/50 p-8 text-center">
      <div>
        <p className="text-xs uppercase tracking-wider text-ink-400">Sessão concluída</p>
        <h2 className="mt-1 text-xl font-semibold text-ink-100">{topicName}</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg border border-ok/40 bg-ok/10 p-3">
          <p className="font-mono text-2xl text-ok">{correct}</p>
          <p className="text-xs text-ink-300">acertos</p>
        </div>
        <div className="rounded-lg border border-warn/40 bg-warn/10 p-3">
          <p className="font-mono text-2xl text-warn">{partial}</p>
          <p className="text-xs text-ink-300">parciais</p>
        </div>
        <div className="rounded-lg border border-err/40 bg-err/10 p-3">
          <p className="font-mono text-2xl text-err">{wrong}</p>
          <p className="text-xs text-ink-300">erros</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-ink-400">Esta sessão</p>
        <ProgressBar value={sessionPct} />
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-ink-400">Domínio do tópico agora</p>
        <ProgressBar value={topicMasteryAfter} />
        <p className="mt-1 font-mono text-xs text-ink-400">{formatPct(topicMasteryAfter)}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-ink-600 px-4 py-2 text-sm font-medium text-ink-100 transition hover:border-ink-500"
        >
          <RotateCcw className="h-4 w-4" />
          Refazer
        </button>
        <Link
          href="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-accent/90"
        >
          <Home className="h-4 w-4" />
          Início
        </Link>
      </div>
    </div>
  );
}
