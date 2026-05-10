import React from 'react';
import { EnvironmentState } from '../types/ecosystem';

interface SliderProps {
  label: string;
  icon: string;
  value: number;
  min?: number;
  max?: number;
  color: string;
  onChange: (v: number) => void;
  hint?: string;
}

function EnvSlider({ label, icon, value, min = 0, max = 100, color, onChange, hint }: SliderProps) {
  return (
    <div className="env-slider-row">
      <div className="env-slider-header">
        <span className="env-slider-label">
          {icon} {label}
        </span>
        <span className="env-slider-value" style={{ color }}>
          {Math.round(value)}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="env-slider"
        style={{ '--slider-color': color } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className="env-slider-hint">{hint}</div>}
    </div>
  );
}

interface Props {
  environment: EnvironmentState;
  onSetLighting: (v: number) => void;
  onSetHumidity: (v: number) => void;
  onSetTemperature: (v: number) => void;
}

export function EnvironmentControls({
  environment,
  onSetLighting,
  onSetHumidity,
  onSetTemperature,
}: Props) {
  const getLightingHint = (l: number) => {
    if (l < 20) return 'Very dim — only springtails thrive';
    if (l <= 50) return 'Low light — ideal for moss';
    if (l <= 70) return 'Moderate light — ferns flourish';
    return 'Bright — most plants may struggle';
  };

  const getHumidityHint = (h: number) => {
    if (h < 60) return 'Too dry — plants will wilt';
    if (h <= 80) return 'Good moisture — balanced ecosystem';
    if (h <= 90) return 'High humidity — moss loves this';
    return 'Saturated — mold risk without springtails!';
  };

  return (
    <div className="panel">
      <h3 className="panel-title">🌡 Environment</h3>

      <EnvSlider
        label="Lighting"
        icon="☀️"
        value={environment.lighting}
        color="#fbbf24"
        onChange={onSetLighting}
        hint={getLightingHint(environment.lighting)}
      />
      <EnvSlider
        label="Humidity"
        icon="💧"
        value={environment.humidity}
        color="#38bdf8"
        onChange={onSetHumidity}
        hint={getHumidityHint(environment.humidity)}
      />
      <EnvSlider
        label="Temperature"
        icon="🌡"
        value={environment.temperature}
        color="#f87171"
        onChange={onSetTemperature}
      />

      <div className="env-stats-grid">
        <StatBadge
          label="Oxygen"
          value={environment.oxygen}
          icon="O₂"
          color={environment.oxygen < 25 ? '#f87171' : '#4ade80'}
        />
        <StatBadge
          label="Soil"
          value={environment.soil}
          icon="🪱"
          color={environment.soil < 25 ? '#f87171' : '#fb923c'}
        />
        <StatBadge
          label="Mold"
          value={environment.mold}
          icon="🍄"
          color={environment.mold > 50 ? '#f87171' : '#a3e635'}
          invert
        />
      </div>
    </div>
  );
}

function StatBadge({
  label,
  value,
  icon,
  color,
  invert = false,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  invert?: boolean;
}) {
  const fillPct = invert ? value : value;
  const barColor = invert
    ? value > 60 ? '#f87171' : value > 30 ? '#fbbf24' : color
    : value < 30 ? '#f87171' : value < 50 ? '#fbbf24' : color;

  return (
    <div className="stat-badge">
      <div className="stat-badge-header">
        <span className="stat-badge-icon">{icon}</span>
        <span className="stat-badge-label">{label}</span>
        <span className="stat-badge-value" style={{ color: barColor }}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="stat-badge-bar-bg">
        <div
          className="stat-badge-bar-fill"
          style={{ width: `${fillPct}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
