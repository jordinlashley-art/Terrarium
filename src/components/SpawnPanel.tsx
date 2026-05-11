"use client";

import { OrganismSpecies, PlantSpecies } from "@/types/ecosystem";

interface SpawnPanelProps {
  onAddPlant: (species: PlantSpecies) => void;
  onAddOrganism: (species: OrganismSpecies) => void;
  onSpawnPreset: (
    preset: "tropical" | "desert" | "temperate" | "decomposer"
  ) => void;
}

const PLANT_OPTIONS: { species: PlantSpecies; label: string; emoji: string; hint: string }[] = [
  { species: "fern", label: "Fern", emoji: "🌿", hint: "High humidity, moderate light" },
  { species: "moss", label: "Moss", emoji: "🪴", hint: "Low light, moist" },
  { species: "succulent", label: "Succulent", emoji: "🌱", hint: "Bright, dry" },
  { species: "vine", label: "Vine", emoji: "🍃", hint: "Moderate, adaptable" },
  { species: "mushroom", label: "Mushroom", emoji: "🍄", hint: "Dark, very humid" },
  { species: "cactus", label: "Cactus", emoji: "🌵", hint: "Full sun, arid" },
];

const ORGANISM_OPTIONS: { species: OrganismSpecies; label: string; emoji: string; hint: string }[] = [
  { species: "isopod", label: "Isopod", emoji: "🐛", hint: "Decomposer" },
  { species: "springtail", label: "Springtail", emoji: "🦗", hint: "Micro-cleaner" },
  { species: "snail", label: "Snail", emoji: "🐌", hint: "Grazer" },
  { species: "worm", label: "Worm", emoji: "🪱", hint: "Soil enricher" },
  { species: "beetle", label: "Beetle", emoji: "🪲", hint: "Heavy feeder" },
  { species: "mite", label: "Mite", emoji: "🔬", hint: "Micro predator" },
];

const PRESETS = [
  {
    id: "tropical" as const,
    label: "Tropical",
    emoji: "🌴",
    description: "Ferns, moss, vines with isopods",
    color: "border-emerald-700 hover:border-emerald-500 hover:bg-emerald-900/20",
  },
  {
    id: "desert" as const,
    label: "Desert",
    emoji: "🏜",
    description: "Succulents, cactus with beetles",
    color: "border-amber-700 hover:border-amber-500 hover:bg-amber-900/20",
  },
  {
    id: "temperate" as const,
    label: "Temperate",
    emoji: "🌲",
    description: "Vine, fern with worms and snails",
    color: "border-blue-700 hover:border-blue-500 hover:bg-blue-900/20",
  },
  {
    id: "decomposer" as const,
    label: "Decomposer",
    emoji: "🍂",
    description: "Mushroom, moss with isopods, worms",
    color: "border-purple-700 hover:border-purple-500 hover:bg-purple-900/20",
  },
];

export default function SpawnPanel({
  onAddPlant,
  onAddOrganism,
  onSpawnPreset,
}: SpawnPanelProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-5">
      <h2 className="text-gray-100 font-semibold text-base flex items-center gap-2">
        <span>🧬</span> Spawn Entities
      </h2>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Quick Presets
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSpawnPreset(preset.id)}
              className={`text-left rounded-xl border p-2.5 transition-colors cursor-pointer ${preset.color}`}
            >
              <div className="text-base mb-0.5">{preset.emoji}</div>
              <div className="text-gray-100 text-sm font-medium">{preset.label}</div>
              <div className="text-gray-400 text-xs leading-tight">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Plants
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {PLANT_OPTIONS.map((opt) => (
            <button
              key={opt.species}
              onClick={() => onAddPlant(opt.species)}
              title={opt.hint}
              className="flex flex-col items-center gap-0.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 rounded-lg py-2 px-1 text-xs font-medium text-gray-200 transition-colors cursor-pointer"
            >
              <span className="text-lg">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Organisms
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {ORGANISM_OPTIONS.map((opt) => (
            <button
              key={opt.species}
              onClick={() => onAddOrganism(opt.species)}
              title={opt.hint}
              className="flex flex-col items-center gap-0.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 rounded-lg py-2 px-1 text-xs font-medium text-gray-200 transition-colors cursor-pointer"
            >
              <span className="text-lg">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
