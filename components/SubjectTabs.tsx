"use client";
import { Stethoscope, Scan, Pill, Baby, type LucideIcon, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { getSubjectAccent } from "@/lib/subject-accent";
import type { Subject } from "@/lib/schema";

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  scan: Scan,
  pill: Pill,
  baby: Baby,
};

type Props = {
  subjects: Subject[];
  activeId: string;
  onChange: (id: string) => void;
};

export function SubjectTabs({ subjects, activeId, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Matérias"
      className="glass glass-edge inline-flex flex-wrap items-center gap-1 rounded-2xl p-1.5"
    >
      {subjects.map((s) => {
        const Icon = ICONS[s.icon] ?? BookOpen;
        const accent = getSubjectAccent(s.id);
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.id)}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300",
              active
                ? cn("text-ink-100", accent.bg, "ring-1", accent.border, accent.glow)
                : "text-ink-300 hover:text-ink-100 hover:bg-white/5"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors",
                active ? accent.text : "text-ink-400"
              )}
            />
            {s.shortName}
          </button>
        );
      })}
    </div>
  );
}
