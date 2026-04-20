import type { ProgressState } from "./storage";

export type MasteryBand = "low" | "mid" | "high";

export function topicMastery(
  state: ProgressState,
  topicId: string,
  totalQuestions: number
): number {
  if (totalQuestions <= 0) return 0;
  const topic = state.byTopic[topicId];
  if (!topic) return 0;
  const score = topic.correct + 0.5 * topic.partial;
  const raw = score / totalQuestions;
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(1, raw));
}

export function masteryBand(pct: number): MasteryBand {
  if (pct >= 0.67) return "high";
  if (pct >= 0.34) return "mid";
  return "low";
}

export function bandColorClass(band: MasteryBand): string {
  switch (band) {
    case "high":
      return "bg-ok";
    case "mid":
      return "bg-warn";
    case "low":
      return "bg-err";
  }
}

export function formatPct(pct: number): string {
  return `${Math.round(pct * 100)}%`;
}
