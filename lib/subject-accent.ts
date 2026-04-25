export type SubjectAccent = {
  hex: string;
  rgb: string;
  text: string;
  bg: string;
  border: string;
  glow: string;
  hoverGlow: string;
  gradient: string;
};

const NEONATOLOGIA: SubjectAccent = {
  hex: "#bae6fd",
  rgb: "186, 230, 253",
  text: "text-pastel-sky",
  bg: "bg-pastel-sky/10",
  border: "border-pastel-sky/40",
  glow: "shadow-[0_0_70px_-12px_rgba(186,230,253,0.55)]",
  hoverGlow: "hover:shadow-[0_0_70px_-12px_rgba(186,230,253,0.55)]",
  gradient: "from-pastel-sky/40 via-pastel-mint/20 to-transparent",
};

const RADIOLOGIA: SubjectAccent = {
  hex: "#c4b5fd",
  rgb: "196, 181, 253",
  text: "text-pastel-lilac",
  bg: "bg-pastel-lilac/10",
  border: "border-pastel-lilac/40",
  glow: "shadow-[0_0_70px_-12px_rgba(196,181,253,0.55)]",
  hoverGlow: "hover:shadow-[0_0_70px_-12px_rgba(196,181,253,0.55)]",
  gradient: "from-pastel-lilac/40 via-pastel-rose/20 to-transparent",
};

const GASTRO: SubjectAccent = {
  hex: "#fed7aa",
  rgb: "254, 215, 170",
  text: "text-pastel-peach",
  bg: "bg-pastel-peach/10",
  border: "border-pastel-peach/40",
  glow: "shadow-[0_0_70px_-12px_rgba(254,215,170,0.55)]",
  hoverGlow: "hover:shadow-[0_0_70px_-12px_rgba(254,215,170,0.55)]",
  gradient: "from-pastel-peach/40 via-pastel-rose/20 to-transparent",
};

const OBSTETRICIA: SubjectAccent = {
  hex: "#fda4af",
  rgb: "253, 164, 175",
  text: "text-pastel-rose",
  bg: "bg-pastel-rose/10",
  border: "border-pastel-rose/40",
  glow: "shadow-[0_0_70px_-12px_rgba(253,164,175,0.55)]",
  hoverGlow: "hover:shadow-[0_0_70px_-12px_rgba(253,164,175,0.55)]",
  gradient: "from-pastel-rose/40 via-pastel-lilac/20 to-transparent",
};

const FALLBACK: SubjectAccent = {
  hex: "#7c9cff",
  rgb: "124, 156, 255",
  text: "text-accent",
  bg: "bg-accent/10",
  border: "border-accent/40",
  glow: "shadow-[0_0_70px_-12px_rgba(124,156,255,0.55)]",
  hoverGlow: "hover:shadow-[0_0_70px_-12px_rgba(124,156,255,0.55)]",
  gradient: "from-accent/40 via-accent-soft/20 to-transparent",
};

const BY_SUBJECT: Record<string, SubjectAccent> = {
  neonatologia: NEONATOLOGIA,
  radiologia: RADIOLOGIA,
  gastroenterologia: GASTRO,
  obstetricia: OBSTETRICIA,
};

export function getSubjectAccent(subjectId: string | undefined | null): SubjectAccent {
  if (!subjectId) return FALLBACK;
  return BY_SUBJECT[subjectId] ?? FALLBACK;
}
