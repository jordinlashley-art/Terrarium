"use client";

import { type OrganismSpecies, type PlantSpecies } from "@/types/ecosystem";

interface SpawnPanelProps {
  onSpawn: (
    type: "plant" | "organism",
    species: PlantSpecies | OrganismSpecies
  ) => void;
}

const PLANT_SPECIES: { species: PlantSpecies; label: string; emoji: string }[] =
  [
    { species: "fern", label: "Fern", emoji: "🌿" },
    { species: "moss", label: "Moss", emoji: "🍀" },
    { species: "succulent", label: "Succulent", emoji: "🌵" },
    { species: "tropical", label: "Tropical", emoji: "🌴" },
    { species: "algae", label: "Algae", emoji: "🫧" },
  ];

const ORGANISM_SPECIES: {
  species: OrganismSpecies;
  label: string;
  emoji: string;
}[] = [
  { species: "isopod", label: "Isopod", emoji: "🦠" },
  { species: "springtail", label: "Springtail", emoji: "🦗" },
  { species: "snail", label: "Snail", emoji: "🐌" },
  { species: "gecko", label: "Gecko", emoji: "🦎" },
  { species: "millipede", label: "Millipede", emoji: "🐛" },
];

export default function SpawnPanel({ onSpawn }: SpawnPanelProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
        Add Entity
      </h2>

      <div>
        <p className="text-xs text-slate-400 mb-2">Plants</p>
        <div className="flex flex-wrap gap-2">
          {PLANT_SPECIES.map(({ species, label, emoji }) => (
            <button
              key={species}
              onClick={() => onSpawn("plant", species)}
              className="flex items-center gap-1 text-xs bg-emerald-900/50 hover:bg-emerald-800/60 
                         text-emerald-300 border border-emerald-700/40 rounded-md px-2 py-1 
                         transition-colors"
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-2">Organisms</p>
        <div className="flex flex-wrap gap-2">
          {ORGANISM_SPECIES.map(({ species, label, emoji }) => (
            <button
              key={species}
              onClick={() => onSpawn("organism", species)}
              className="flex items-center gap-1 text-xs bg-violet-900/50 hover:bg-violet-800/60 
                         text-violet-300 border border-violet-700/40 rounded-md px-2 py-1 
                         transition-colors"
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
