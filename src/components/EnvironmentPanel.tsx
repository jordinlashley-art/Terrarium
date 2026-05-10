'use client';

import type { Environment } from '../types/ecosystem';

interface EnvironmentPanelProps {
  environment: Environment;
  onUpdate: (key: keyof Environment, value: number) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon: string;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit = '', icon, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="text-zinc-100 font-mono text-xs">
          {Number.isInteger(step) ? Math.round(value) : value.toFixed(1)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-zinc-700 cursor-pointer"
      />
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  icon: string;
  warn?: boolean;
}

function StatRow({ label, value, max, unit = '', icon, warn = false }: StatRowProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-zinc-400">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className={warn ? 'text-red-400 font-medium' : 'text-zinc-300'}>
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <div className="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            warn ? 'bg-red-500' : 'bg-teal-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function EnvironmentPanel({ environment, onUpdate }: EnvironmentPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Environment
      </h2>

      <div className="flex flex-col gap-4">
        <Slider
          label="Light"
          value={environment.light}
          min={0}
          max={100}
          unit="%"
          icon="☀️"
          onChange={(v) => onUpdate('light', v)}
        />
        <Slider
          label="Humidity"
          value={environment.humidity}
          min={0}
          max={100}
          unit="%"
          icon="💧"
          onChange={(v) => onUpdate('humidity', v)}
        />
        <Slider
          label="Temperature"
          value={environment.temperature}
          min={0}
          max={40}
          step={0.5}
          unit="°C"
          icon="🌡️"
          onChange={(v) => onUpdate('temperature', v)}
        />
        <Slider
          label="Water"
          value={environment.water}
          min={0}
          max={100}
          unit="%"
          icon="🪣"
          onChange={(v) => onUpdate('water', v)}
        />
      </div>

      <hr className="border-zinc-700" />

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Readings
        </h3>
        <StatRow label="Oxygen" value={environment.oxygen} max={100} unit="%" icon="🫧" />
        <StatRow label="Biomass" value={environment.biomass} max={300} unit=" g" icon="🌱" />
        <StatRow label="Debris" value={environment.debris} max={300} unit=" g" icon="🍂" />
        <StatRow
          label="Mold"
          value={environment.mold}
          max={100}
          unit="%"
          icon="🟤"
          warn={environment.mold > 50}
        />
      </div>
    </div>
  );
}
