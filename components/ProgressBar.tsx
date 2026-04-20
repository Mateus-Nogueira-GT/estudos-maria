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
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${clamped * 100}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 text-right font-mono text-xs tabular-nums text-ink-300">
          {formatPct(clamped)}
        </span>
      )}
    </div>
  );
}
