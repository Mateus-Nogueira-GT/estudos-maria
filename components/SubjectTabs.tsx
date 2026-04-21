"use client";
import { Stethoscope, Scan, type LucideIcon, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Subject } from "@/lib/schema";

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  scan: Scan,
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
      className="inline-flex items-center gap-1 rounded-xl border border-ink-700 bg-ink-800/40 p-1"
    >
      {subjects.map((s) => {
        const Icon = ICONS[s.icon] ?? BookOpen;
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-ink-700 text-ink-100 shadow-inner"
                : "text-ink-300 hover:text-ink-100 hover:bg-ink-700/40"
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-ink-400")} />
            {s.shortName}
          </button>
        );
      })}
    </div>
  );
}
