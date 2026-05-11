"use client";

import { Environment } from "@/types/ecosystem";

interface EnvironmentPanelProps {
  environment: Environment;
  onUpdate: (updates: Partial<Environment>) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  color: string;
  onChange: (value: number) => void;
  warningThreshold?: { above?: number; below?: number };
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  color,
  onChange,
  warningThreshold,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const isWarning =
    (warningThreshold?.above !== undefined && value > warningThreshold.above) ||
    (warningThreshold?.below !== undefined && value < warningThreshold.below);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <label className="text-gray-300 font-medium">{label}</label>
        <span
          className={`font-mono text-xs px-2 py-0.5 rounded ${
            isWarning
              ? "bg-yellow-900 text-yellow-300"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          {value.toFixed(0)}
          {unit}
          {isWarning && " ⚠"}
        </span>
      </div>
      <div className="relative h-4 flex items-center">
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default function EnvironmentPanel({
  environment,
  onUpdate,
}: EnvironmentPanelProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
      <h2 className="text-gray-100 font-semibold text-base flex items-center gap-2">
        <span>🌡</span> Environment Controls
      </h2>

      <div className="space-y-3">
        <Slider
          label="Lighting"
          value={environment.lighting}
          min={0}
          max={100}
          unit="%"
          color="bg-yellow-400"
          onChange={(v) => onUpdate({ lighting: v })}
        />
        <Slider
          label="Humidity"
          value={environment.humidity}
          min={0}
          max={100}
          unit="%"
          color="bg-blue-400"
          onChange={(v) => onUpdate({ humidity: v })}
          warningThreshold={{ above: 65 }}
        />
        <Slider
          label="Temperature"
          value={environment.temperature}
          min={5}
          max={45}
          unit="°C"
          color="bg-orange-400"
          onChange={(v) => onUpdate({ temperature: v })}
          warningThreshold={{ above: 38, below: 8 }}
        />
        <Slider
          label="Water Level"
          value={environment.waterLevel}
          min={0}
          max={100}
          unit="%"
          color="bg-cyan-400"
          onChange={(v) => onUpdate({ waterLevel: v })}
          warningThreshold={{ below: 15 }}
        />
      </div>

      <div className="border-t border-gray-700 pt-3 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          Resource Levels
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(
            [
              { key: "oxygenLevel", label: "O₂", color: "text-sky-400" },
              { key: "biomass", label: "Biomass", color: "text-green-400" },
              { key: "debris", label: "Debris", color: "text-amber-400" },
              { key: "waste", label: "Waste", color: "text-red-400" },
            ] as { key: keyof Environment; label: string; color: string }[]
          ).map(({ key, label, color }) => (
            <div
              key={key}
              className="flex justify-between bg-gray-700 rounded-lg px-2 py-1"
            >
              <span className="text-gray-400">{label}</span>
              <span className={`font-mono font-medium ${color}`}>
                {(environment[key] as number).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {environment.humidity > 65 && (
        <div className="rounded-lg bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-xs px-3 py-2">
          ⚠ Humidity above 65% — mold risk active
        </div>
      )}
    </div>
  );
}
