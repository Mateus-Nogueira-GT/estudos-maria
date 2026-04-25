import type { Difficulty } from "./schema";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Média",
  hard: "Difícil",
};

export const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  easy: "border-ok/60 bg-ok/10 text-ok",
  medium: "border-warn/60 bg-warn/10 text-warn",
  hard: "border-err/60 bg-err/10 text-err",
};
