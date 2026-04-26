import type { Difficulty } from "./schema";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Média",
  hard: "Difícil",
  bonus: "Bônus",
};

export const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  easy: "border-ok/60 bg-ok/10 text-ok",
  medium: "border-warn/60 bg-warn/10 text-warn",
  hard: "border-err/60 bg-err/10 text-err",
  bonus:
    "border-pastel-lilac/40 bg-gradient-to-r from-pastel-lilac/20 to-pastel-rose/20 text-pastel-lilac",
};
