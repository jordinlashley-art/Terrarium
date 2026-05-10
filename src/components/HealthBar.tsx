"use client";

interface HealthBarProps {
  value: number;
  max?: number;
  label?: string;
  colorClass?: string;
  showValue?: boolean;
  height?: string;
}

function barColor(value: number, max: number): string {
  const pct = (value / max) * 100;
  if (pct > 60) return "bg-emerald-500";
  if (pct > 30) return "bg-amber-400";
  return "bg-red-500";
}

export default function HealthBar({
  value,
  max = 100,
  label,
  colorClass,
  showValue = true,
  height = "h-2",
}: HealthBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = colorClass ?? barColor(value, max);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-0.5 text-xs text-slate-400">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="tabular-nums">
              {Math.round(value)}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full bg-slate-700 ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
