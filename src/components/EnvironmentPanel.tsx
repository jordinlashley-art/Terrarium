"use client";

import { Environment } from "@/types/ecosystem";

interface EnvironmentPanelProps {
  environment: Environment;
  onUpdate: (updates: Partial<Environment>) => void;
}

interface SliderProps {
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  fillColor: string;
  glowColor: string;
  onChange: (value: number) => void;
  warning?: boolean;
}

function Slider({
  label,
  icon,
  value,
  min,
  max,
  step = 1,
  unit,
  fillColor,
  glowColor,
  onChange,
  warning,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-md"
          style={{
            background: warning
              ? "rgba(200,140,30,0.2)"
              : "rgba(255,255,255,0.06)",
            border: warning
              ? "1px solid rgba(200,160,40,0.35)"
              : "1px solid rgba(255,255,255,0.08)",
            color: warning ? "#fbbf24" : "#d1d5db",
          }}
        >
          {value.toFixed(0)}
          {unit}
          {warning && " ⚠"}
        </span>
      </div>

      {/* Track + thumb */}
      <div className="relative py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
            borderRadius: "4px",
            height: "4px",
            filter: pct > 5 ? `drop-shadow(0 0 4px ${glowColor})` : "none",
          }}
        />
      </div>
    </div>
  );
}

const glassCard = {
  background: "rgba(10, 28, 18, 0.72)",
  backdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
} as React.CSSProperties;

export default function EnvironmentPanel({
  environment,
  onUpdate,
}: EnvironmentPanelProps) {
  return (
    <div className="rounded-2xl p-5 space-y-5" style={glassCard}>
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "rgba(60,160,100,0.2)",
            border: "1px solid rgba(80,200,120,0.25)",
          }}
        >
          🎛
        </div>
        <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
          Controls
        </h2>
      </div>

      <div
        className="border-t space-y-5 pt-4"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Slider
          label="Lighting"
          icon="💡"
          value={environment.lighting}
          min={0}
          max={100}
          unit="%"
          fillColor="#facc15"
          glowColor="rgba(250,204,21,0.5)"
          onChange={(v) => onUpdate({ lighting: v })}
        />
        <Slider
          label="Humidity"
          icon="💧"
          value={environment.humidity}
          min={0}
          max={100}
          unit="%"
          fillColor="#38bdf8"
          glowColor="rgba(56,189,248,0.5)"
          onChange={(v) => onUpdate({ humidity: v })}
          warning={environment.humidity > 65}
        />
        <Slider
          label="Temperature"
          icon="🌡"
          value={environment.temperature}
          min={5}
          max={45}
          step={0.5}
          unit="°C"
          fillColor="#fb923c"
          glowColor="rgba(251,146,60,0.5)"
          onChange={(v) => onUpdate({ temperature: v })}
          warning={environment.temperature > 38 || environment.temperature < 8}
        />
      </div>

      {/* Resource readout */}
      <div
        className="rounded-xl p-3 space-y-2"
        style={{
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          Resources
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(
            [
              { key: "oxygenLevel", label: "O₂", color: "#7dd3fc" },
              { key: "biomass", label: "Biomass", color: "#4ade80" },
              { key: "debris", label: "Debris", color: "#fbbf24" },
              { key: "waste", label: "Waste", color: "#f87171" },
            ] as { key: keyof Environment; label: string; color: string }[]
          ).map(({ key, label, color }) => (
            <div
              key={key}
              className="flex justify-between items-center px-2 py-1.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-gray-500">{label}</span>
              <span
                className="font-mono font-semibold"
                style={{ color }}
              >
                {(environment[key] as number).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mold warning */}
      {environment.humidity > 65 && (
        <div
          className="rounded-xl px-3 py-2 text-xs"
          style={{
            background: "rgba(160, 100, 0, 0.15)",
            border: "1px solid rgba(200, 140, 30, 0.3)",
            color: "#fbbf24",
          }}
        >
          ⚠ Humidity above 65% — mold risk active
        </div>
      )}
    </div>
  );
}
