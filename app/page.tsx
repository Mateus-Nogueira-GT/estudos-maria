"use client";
import { useEffect, useMemo, useState } from "react";
import { Stethoscope, RefreshCw, Sparkles } from "lucide-react";
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
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg border border-ink-700 bg-ink-800 p-3">
            <Stethoscope className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink-100">
              Estudos Maria <span className="text-ink-400">— Quizzes &amp; Flashcards</span>
            </h1>
            <p className="mt-1 max-w-xl text-sm text-ink-300">
              Escolha a matéria abaixo. Seu progresso fica salvo neste navegador.
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

      <div className="mb-8">
        <SubjectTabs
          subjects={subjects}
          activeId={activeSubjectId}
          onChange={handleChangeSubject}
        />
        {activeSubject && (
          <p className="mt-3 text-sm text-ink-400">{activeSubject.description}</p>
        )}
      </div>

      {topics.length > 0 ? (
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
      ) : (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-xl border border-dashed border-ink-700 bg-ink-800/30 px-6 py-16 text-center">
          <div className="rounded-full border border-ink-700 bg-ink-800 p-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-ink-100">
            {activeSubject?.name ?? "Matéria"} — em breve
          </h2>
          <p className="max-w-sm text-sm text-ink-300">
            Esta matéria ainda não tem conteúdo. Quando os PDFs forem adicionados,
            os tópicos, questões e flashcards aparecerão aqui automaticamente.
          </p>
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-ink-500">
        Progresso salvo apenas neste navegador (localStorage). Sem login, sem servidor.
      </footer>
    </main>
  );
}
