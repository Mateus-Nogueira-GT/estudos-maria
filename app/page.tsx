"use client";
import { useEffect, useState } from "react";
import { Stethoscope, RefreshCw } from "lucide-react";
import { TopicCard } from "@/components/TopicCard";
import { getTopics, countQuestionsByTopic } from "@/lib/questions";
import { countFlashcardsByTopic } from "@/lib/flashcards";
import { loadState, resetState, EMPTY_STATE, type ProgressState } from "@/lib/storage";
import { topicMastery } from "@/lib/progress";

export default function HomePage() {
  const topics = getTopics();
  const [state, setState] = useState<ProgressState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  function handleReset() {
    if (!window.confirm("Tem certeza? Isso apaga todo o progresso salvo neste navegador.")) return;
    resetState();
    setState(EMPTY_STATE);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg border border-ink-700 bg-ink-800 p-3">
            <Stethoscope className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink-100">
              Estudos Maria <span className="text-ink-400">— Neonatologia</span>
            </h1>
            <p className="mt-1 max-w-xl text-sm text-ink-300">
              Quiz e flashcards sobre perinatologia, reanimação neonatal, asfixia, triagem e
              cuidados do RN. Escolha um tópico para começar.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="shrink-0 flex items-center gap-2 rounded-md border border-ink-700 px-3 py-2 text-xs text-ink-300 transition hover:border-ink-500 hover:text-ink-100"
          title="Apaga seu progresso salvo"
        >
          <RefreshCw className="h-3 w-3" />
          Resetar progresso
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const qCount = countQuestionsByTopic(topic.id);
          const fCount = countFlashcardsByTopic(topic.id);
          const mastery = ready ? topicMastery(state, topic.id, qCount) : 0;
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              mastery={mastery}
              questionCount={qCount}
              flashcardCount={fCount}
            />
          );
        })}
      </div>

      <footer className="mt-12 text-center text-xs text-ink-500">
        Progresso salvo apenas neste navegador (localStorage). Sem login, sem servidor.
      </footer>
    </main>
  );
}
