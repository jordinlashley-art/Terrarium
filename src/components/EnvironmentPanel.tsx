"use client";

import { type Environment } from "@/types/ecosystem";
import HealthBar from "./HealthBar";

interface EnvironmentPanelProps {
  environment: Environment;
  onUpdate: (patch: Partial<Environment>) => void;
}

const sliders: Array<{
  key: keyof Environment;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}> = [
  {
    key: "lighting",
    label: "Lighting",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    min: 5,
    max: 45,
    step: 0.5,
  },
  {
    key: "water",
    label: "Substrate Water",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
  },
];

export default function EnvironmentPanel({
  environment,
  onUpdate,
}: EnvironmentPanelProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
        Environment
      </h2>

      {sliders.map(({ key, label, unit, min, max, step }) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">{label}</span>
            <span className="tabular-nums text-white font-medium">
              {typeof environment[key] === "number"
                ? Number(environment[key]).toFixed(
                    step < 1 ? 1 : 0
                  )
                : environment[key]}
              {unit}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={environment[key] as number}
            onChange={(e) =>
              onUpdate({ [key]: parseFloat(e.target.value) } as Partial<Environment>)
            }
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
      ))}

      {/* Read-only: Oxygen (produced by plants) */}
      <div className="space-y-1 pt-1 border-t border-slate-700">
        <HealthBar
          value={environment.oxygen}
          label="Oxygen (auto)"
          colorClass="bg-teal-400"
          height="h-2"
        />
      </div>
    </div>
  );
}
