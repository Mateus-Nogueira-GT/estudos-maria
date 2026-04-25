"use client";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { TopicCard } from "@/components/TopicCard";
import { SubjectTabs } from "@/components/SubjectTabs";
import {
  getSubjects,
  getTopicsBySubject,
  countQuestionsByTopic,
} from "@/lib/questions";
import { countFlashcardsByTopic } from "@/lib/flashcards";
import { loadState, resetState, EMPTY_STATE, type ProgressState } from "@/lib/storage";
import { topicMastery } from "@/lib/progress";

const ACTIVE_SUBJECT_KEY = "estudos-maria:activeSubject";

export default function HomePage() {
  const subjects = getSubjects();
  const defaultSubject = subjects[0]?.id ?? "";
  const [activeSubjectId, setActiveSubjectId] = useState<string>(defaultSubject);
  const [state, setState] = useState<ProgressState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(ACTIVE_SUBJECT_KEY);
      if (saved && subjects.some((s) => s.id === saved)) {
        setActiveSubjectId(saved);
      }
    }
    setReady(true);
  }, [subjects]);

  function handleChangeSubject(id: string) {
    setActiveSubjectId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACTIVE_SUBJECT_KEY, id);
    }
  }

  function handleReset() {
    if (!window.confirm("Tem certeza? Isso apaga todo o progresso salvo neste navegador.")) return;
    resetState();
    setState(EMPTY_STATE);
  }

  const activeSubject = subjects.find((s) => s.id === activeSubjectId);
  const topics = useMemo(
    () => getTopicsBySubject(activeSubjectId),
    [activeSubjectId]
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pastel-lilac/80">
            Estudos · Maria
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
            Quizzes &amp; Flashcards
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
            Escolha a matéria abaixo. Seu progresso fica salvo neste navegador — sem login, sem servidor.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="self-start flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-ink-200 backdrop-blur-md transition hover:border-white/25 hover:text-ink-100"
          title="Apaga seu progresso salvo"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Resetar progresso
        </button>
      </header>

      <div className="mb-10">
        <SubjectTabs
          subjects={subjects}
          activeId={activeSubjectId}
          onChange={handleChangeSubject}
        />
        {activeSubject && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-300">
            {activeSubject.description}
          </p>
        )}
      </div>

      {topics.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      ) : (
        <div className="glass glass-edge mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
          <div className="rounded-full border border-white/15 bg-white/5 p-4">
            <Sparkles className="h-6 w-6 text-pastel-lilac" />
          </div>
          <h2 className="font-display text-xl font-semibold text-ink-100">
            {activeSubject?.name ?? "Matéria"} — em breve
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ink-300">
            Esta matéria ainda não tem conteúdo. Quando os PDFs forem adicionados,
            os tópicos, questões e flashcards aparecerão aqui automaticamente.
          </p>
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-ink-500">
        Progresso salvo apenas neste navegador (localStorage). Sem login, sem servidor.
      </footer>
    </main>
  );
}
