import type { Result } from "./schema";

const STORAGE_KEY = "estudos-maria:v1";

export type QuestionProgress = {
  attempts: number;
  lastResult: Result;
  lastAnsweredAt: number;
};

export type TopicProgress = {
  answered: number;
  correct: number;
  partial: number;
};

export type ProgressState = {
  byQuestion: Record<string, QuestionProgress>;
  byTopic: Record<string, TopicProgress>;
};

export const EMPTY_STATE: ProgressState = { byQuestion: {}, byTopic: {} };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadState(): ProgressState {
  if (!isBrowser()) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed || typeof parsed !== "object") return EMPTY_STATE;
    return {
      byQuestion: parsed.byQuestion ?? {},
      byTopic: parsed.byTopic ?? {},
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: ProgressState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota/serialization errors
  }
}

export function resetState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function recordAnswer(
  state: ProgressState,
  questionId: string,
  topicId: string,
  result: Result
): ProgressState {
  const previous = state.byQuestion[questionId];
  const wasAnswered = Boolean(previous);

  const nextQuestion: QuestionProgress = {
    attempts: (previous?.attempts ?? 0) + 1,
    lastResult: result,
    lastAnsweredAt: Date.now(),
  };

  const topic: TopicProgress = state.byTopic[topicId] ?? {
    answered: 0,
    correct: 0,
    partial: 0,
  };

  let answered = topic.answered + (wasAnswered ? 0 : 1);
  let correct = topic.correct;
  let partial = topic.partial;

  if (wasAnswered) {
    if (previous.lastResult === "correct") correct -= 1;
    if (previous.lastResult === "partial") partial -= 1;
  }
  if (result === "correct") correct += 1;
  if (result === "partial") partial += 1;

  correct = Math.max(0, correct);
  partial = Math.max(0, partial);

  return {
    byQuestion: { ...state.byQuestion, [questionId]: nextQuestion },
    byTopic: { ...state.byTopic, [topicId]: { answered, correct, partial } },
  };
}

export const __STORAGE_KEY = STORAGE_KEY;
