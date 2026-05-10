"use client";

import { type Organism, type Plant } from "@/types/ecosystem";
import HealthBar from "./HealthBar";

const PLANT_EMOJI: Record<string, string> = {
  fern: "🌿",
  moss: "🍀",
  succulent: "🌵",
  tropical: "🌴",
  algae: "🫧",
};

const ORGANISM_EMOJI: Record<string, string> = {
  isopod: "🦠",
  springtail: "🦗",
  snail: "🐌",
  gecko: "🦎",
  millipede: "🐛",
};

interface PlantCardProps {
  entity: Plant;
  onRemove: (id: string) => void;
}

interface OrganismCardProps {
  entity: Organism;
  onRemove: (id: string) => void;
}

export function PlantCard({ entity, onRemove }: PlantCardProps) {
  const emoji = PLANT_EMOJI[entity.species] ?? "🌱";

  return (
    <div
      className={`bg-slate-700/60 rounded-lg p-3 space-y-2 border ${
        entity.isAlive ? "border-slate-600" : "border-red-800 opacity-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-base leading-none">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{entity.name}</p>
          <p className="text-xs text-slate-400 capitalize">
            {entity.species} · age {entity.age}
          </p>
        </div>
        <button
          onClick={() => onRemove(entity.id)}
          className="text-slate-500 hover:text-red-400 text-xs px-1 transition-colors"
          aria-label="Remove plant"
        >
          ✕
        </button>
      </div>

      <HealthBar value={entity.health} label="Health" height="h-1.5" />

      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-slate-400">
        <span>Size {entity.size.toFixed(1)}</span>
        <span>Growth ×{entity.growthRate}</span>
        <span>
          💧 {entity.requirements.lightingMin}–{entity.requirements.lightingMax}
          &nbsp;☀️
        </span>
        <span>
          {entity.requirements.humidityMin}–{entity.requirements.humidityMax}% 💦
        </span>
      </div>

      {!entity.isAlive && (
        <p className="text-xs text-red-400 font-semibold">Dead</p>
      )}
    </div>
  );
}

export function OrganismCard({ entity, onRemove }: OrganismCardProps) {
  const emoji = ORGANISM_EMOJI[entity.species] ?? "🐾";

  return (
    <div
      className={`bg-slate-700/60 rounded-lg p-3 space-y-2 border ${
        entity.isAlive ? "border-slate-600" : "border-red-800 opacity-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-base leading-none">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{entity.name}</p>
          <p className="text-xs text-slate-400 capitalize">
            {entity.species} · age {entity.age}
          </p>
        </div>
        <button
          onClick={() => onRemove(entity.id)}
          className="text-slate-500 hover:text-red-400 text-xs px-1 transition-colors"
          aria-label="Remove organism"
        >
          ✕
        </button>
      </div>

      <HealthBar value={entity.health} label="Health" height="h-1.5" />
      <HealthBar
        value={entity.energy}
        label="Energy"
        colorClass="bg-violet-400"
        height="h-1.5"
      />

      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-slate-400">
        <span>Size {entity.size.toFixed(1)}</span>
        <span>Growth ×{entity.growthRate}</span>
        <span>Food {entity.requirements.foodConsumptionPerTick}/tick</span>
        <span>Waste {entity.wasteProductionPerTick}/tick</span>
      </div>

      {!entity.isAlive && (
        <p className="text-xs text-red-400 font-semibold">Dead</p>
      )}
    </div>
  );
}
