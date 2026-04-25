import { bandColorClass, formatPct, masteryBand } from "@/lib/progress";
import { cn } from "@/lib/cn";

type Props = {
  value: number; // 0-1
  showLabel?: boolean;
  className?: string;
};

export function ProgressBar({ value, showLabel = true, className }: Props) {
  const clamped = Math.max(0, Math.min(1, value));
  const band = masteryBand(clamped);
  const colorClass = bandColorClass(band);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/10">
        <div
          className={cn(
            "relative h-full rounded-full transition-all duration-700 ease-out",
            colorClass
          )}
          style={{ width: `${clamped * 100}%` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] animate-shine"
          />
        </div>
      </div>
      {showLabel && (
        <span className="w-10 text-right font-mono text-xs tabular-nums text-ink-300">
          {formatPct(clamped)}
        </span>
      )}
    </div>
  );
}
