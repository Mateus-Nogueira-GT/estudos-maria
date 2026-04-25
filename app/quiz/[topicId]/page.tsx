"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultSummary } from "@/components/ResultSummary";
import { ProgressBar } from "@/components/ProgressBar";
import { getQuestionsByTopic, getTopic, shuffled } from "@/lib/questions";
import {
  loadState,
  saveState,
  recordAnswer,
  EMPTY_STATE,
  type ProgressState,
} from "@/lib/storage";
import { topicMastery } from "@/lib/progress";
import type { Result } from "@/lib/schema";

export default function QuizPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const topic = getTopic(topicId);
  const allQuestions = useMemo(() => getQuestionsByTopic(topicId), [topicId]);

  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<ProgressState>(EMPTY_STATE);
  const [sessionStats, setSessionStats] = useState({ correct: 0, partial: 0, wrong: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setOrder(shuffled(allQuestions).map((q) => q.id));
    setIndex(0);
    setSessionStats({ correct: 0, partial: 0, wrong: 0 });
    setReady(true);
  }, [allQuestions]);

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

  if (allQuestions.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 hover:text-ink-100">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-100">{topic.name}</h1>
        <p className="mt-4 text-sm text-ink-300">Sem questões para este tópico ainda.</p>
      </main>
    );
  }

  if (!ready) return null;

  const finished = index >= order.length;
  const currentQuestion = !finished
    ? allQuestions.find((q) => q.id === order[index])
    : null;

  function handleNext(result: Result) {
    if (!currentQuestion) return;
    const nextState = recordAnswer(state, currentQuestion.id, topic!.id, result);
    setState(nextState);
    saveState(nextState);
    setSessionStats((s) => ({
      correct: s.correct + (result === "correct" ? 1 : 0),
      partial: s.partial + (result === "partial" ? 1 : 0),
      wrong: s.wrong + (result === "wrong" ? 1 : 0),
    }));
    setIndex((i) => i + 1);
  }

  function handleRestart() {
    setOrder(shuffled(allQuestions).map((q) => q.id));
    setIndex(0);
    setSessionStats({ correct: 0, partial: 0, wrong: 0 });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-ink-200 backdrop-blur-md transition hover:border-white/25 hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar aos tópicos
      </Link>

      {!finished && (
        <>
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-pastel-lilac/80">
              Quiz
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-100 sm:text-3xl">
              {topic.name}
            </h1>
            <div className="mt-4">
              <ProgressBar value={index / order.length} showLabel={false} />
            </div>
          </div>
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              onNext={handleNext}
              questionNumber={index + 1}
              totalQuestions={order.length}
            />
          )}
        </>
      )}

      {finished && (
        <ResultSummary
          topicName={topic.name}
          correct={sessionStats.correct}
          partial={sessionStats.partial}
          wrong={sessionStats.wrong}
          total={order.length}
          topicMasteryAfter={topicMastery(state, topic.id, allQuestions.length)}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
