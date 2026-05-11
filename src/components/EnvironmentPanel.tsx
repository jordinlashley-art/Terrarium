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
          <span className="text-sm font-medium" style={{ color: "#b0d8f8" }}>
            {label}
          </span>
        </div>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-md"
          style={{
            background: warning
              ? "rgba(220,100,20,0.2)"
              : "rgba(100,200,255,0.07)",
            border: warning
              ? "1px solid rgba(220,120,30,0.4)"
              : "1px solid rgba(100,200,255,0.12)",
            color: warning ? "#fb923c" : "#93c5fd",
          }}
        >
          {value.toFixed(step === 0.5 ? 1 : 0)}
          {unit}
          {warning && " ⚠"}
        </span>
      </div>
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
            background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, rgba(100,200,255,0.1) ${pct}%, rgba(100,200,255,0.1) 100%)`,
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
  background: "rgba(4, 18, 38, 0.78)",
  backdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(100, 200, 255, 0.10)",
  boxShadow:
    "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
} as React.CSSProperties;

export default function EnvironmentPanel({
  environment,
  onUpdate,
}: EnvironmentPanelProps) {
  const ammoniaWarning = environment.ammonia > 2;
  const salinityWarning =
    environment.salinity < 30 || environment.salinity > 38;
  const tempWarning =
    environment.temperature > 30 || environment.temperature < 10;

  return (
    <div className="rounded-2xl p-5 space-y-5" style={glassCard}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "rgba(0,100,200,0.25)",
            border: "1px solid rgba(80,180,255,0.3)",
          }}
        >
          🎛
        </div>
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: "#b0d8f8" }}>
          Water Controls
        </h2>
      </div>

      <div
        className="border-t space-y-5 pt-4"
        style={{ borderColor: "rgba(100,200,255,0.07)" }}
      >
        <Slider
          label="Lighting"
          icon="💡"
          value={environment.lighting}
          min={0}
          max={100}
          unit="%"
          fillColor="#fde68a"
          glowColor="rgba(253,230,138,0.45)"
          onChange={(v) => onUpdate({ lighting: v })}
        />
        <Slider
          label="Salinity"
          icon="🧂"
          value={environment.salinity}
          min={0}
          max={40}
          step={0.5}
          unit=" ppt"
          fillColor="#38bdf8"
          glowColor="rgba(56,189,248,0.5)"
          onChange={(v) => onUpdate({ salinity: v })}
          warning={salinityWarning}
        />
        <Slider
          label="Temperature"
          icon="🌡"
          value={environment.temperature}
          min={5}
          max={35}
          step={0.5}
          unit="°C"
          fillColor="#fb923c"
          glowColor="rgba(251,146,60,0.5)"
          onChange={(v) => onUpdate({ temperature: v })}
          warning={tempWarning}
        />
        <Slider
          label="Water Flow"
          icon="💨"
          value={environment.waterFlow}
          min={0}
          max={100}
          unit="%"
          fillColor="#67e8f9"
          glowColor="rgba(103,232,249,0.45)"
          onChange={(v) => onUpdate({ waterFlow: v })}
        />
      </div>

      {/* Resource readout */}
      <div
        className="rounded-xl p-3 space-y-2"
        style={{
          background: "rgba(0,0,0,0.28)",
          border: "1px solid rgba(100,200,255,0.06)",
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "rgba(80,160,220,0.5)" }}
        >
          Water Chemistry
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(
            [
              { key: "oxygenLevel", label: "O₂", color: "#7dd3fc" },
              { key: "nutrients", label: "Nutrients", color: "#6ee7b7" },
              { key: "debris", label: "Debris", color: "#fcd34d" },
              { key: "ammonia", label: "NH₃ (ppm)", color: "#f87171" },
            ] as { key: keyof Environment; label: string; color: string }[]
          ).map(({ key, label, color }) => (
            <div
              key={key}
              className="flex justify-between items-center px-2 py-1.5 rounded-lg"
              style={{ background: "rgba(100,200,255,0.04)" }}
            >
              <span style={{ color: "rgba(80,160,210,0.55)" }}>{label}</span>
              <span className="font-mono font-semibold" style={{ color }}>
                {(environment[key] as number).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ammonia warning */}
      {ammoniaWarning && (
        <div
          className="rounded-xl px-3 py-2 text-xs"
          style={{
            background: "rgba(200, 60, 20, 0.15)",
            border: "1px solid rgba(240, 100, 50, 0.3)",
            color: "#fb923c",
          }}
        >
          ⚠ High ammonia ({environment.ammonia.toFixed(1)} ppm) — fish at risk
        </div>
      )}

      {/* Salinity warning */}
      {salinityWarning && (
        <div
          className="rounded-xl px-3 py-2 text-xs"
          style={{
            background: "rgba(160, 100, 0, 0.15)",
            border: "1px solid rgba(200, 140, 30, 0.3)",
            color: "#fbbf24",
          }}
        >
          ⚠ Salinity {environment.salinity.toFixed(1)} ppt — check species compatibility
        </div>
      )}
    </div>
  );
}
