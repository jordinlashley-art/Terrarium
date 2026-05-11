"use client";

import { Organism, Plant } from "@/types/ecosystem";

interface EntityCardProps {
  entity: Plant | Organism;
  type: "plant" | "organism";
}

function HealthBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

const SPECIES_EMOJI: Record<string, string> = {
  fern: "🌿",
  moss: "🪴",
  succulent: "🪴",
  vine: "🍃",
  mushroom: "🍄",
  cactus: "🌵",
  isopod: "🐛",
  springtail: "🦗",
  snail: "🐌",
  worm: "🪱",
  beetle: "🪲",
  mite: "🔬",
};

function isPlant(entity: Plant | Organism): entity is Plant {
  return "lightRequirement" in entity;
}

export default function EntityCard({ entity, type }: EntityCardProps) {
  const emoji = SPECIES_EMOJI[entity.species] ?? (type === "plant" ? "🌱" : "🐾");
  const healthColor =
    entity.health > 60
      ? "bg-emerald-400"
      : entity.health > 30
      ? "bg-yellow-400"
      : "bg-red-400";
  const energyColor =
    entity.energy > 60
      ? "bg-sky-400"
      : entity.energy > 30
      ? "bg-orange-400"
      : "bg-red-400";

  const plant = isPlant(entity) ? entity : null;
  const organism = !isPlant(entity) ? entity : null;

  return (
    <div
      className={`rounded-xl border p-3 text-sm transition-all duration-200 ${
        entity.isAlive
          ? "bg-gray-800 border-gray-600 shadow-sm"
          : "bg-gray-900 border-gray-700 opacity-40"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-medium text-gray-100 truncate">
          <span className="text-base">{emoji}</span>
          <span className="truncate">{entity.name}</span>
        </div>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
            entity.isAlive
              ? "bg-emerald-900 text-emerald-300"
              : "bg-red-900 text-red-300"
          }`}
        >
          {entity.isAlive ? "alive" : "dead"}
        </span>
      </div>

      <div className="space-y-1.5">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-0.5">
            <span>Health</span>
            <span>{entity.health.toFixed(0)}%</span>
          </div>
          <HealthBar value={entity.health} color={healthColor} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-0.5">
            <span>Energy</span>
            <span>{entity.energy.toFixed(0)}%</span>
          </div>
          <HealthBar value={entity.energy} color={energyColor} />
        </div>
      </div>

      <div className="mt-2 flex gap-3 text-xs text-gray-400">
        <span>Age: {entity.age}</span>
        {plant && (
          <span>Biomass: {plant.biomassProduced.toFixed(1)}</span>
        )}
        {organism && (
          <span>Waste: {organism.wasteProduced.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
}
