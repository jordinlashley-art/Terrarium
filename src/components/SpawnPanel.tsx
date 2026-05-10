'use client';

import type { PlantSpecies, OrganismSpecies } from '../types/ecosystem';

interface SpawnPanelProps {
  onAddPlant: (species: PlantSpecies) => void;
  onAddOrganism: (species: OrganismSpecies) => void;
  onSpawnPreset: (name: string) => void;
}

const PLANTS: { species: PlantSpecies; label: string; emoji: string; tip: string }[] = [
  { species: 'fern', label: 'Fern', emoji: '🌿', tip: 'High humidity (65–90%), moderate light' },
  { species: 'moss', label: 'Moss', emoji: '🟢', tip: 'Very high humidity (70–100%), low light' },
  { species: 'cactus', label: 'Cactus', emoji: '🌵', tip: 'Low humidity (10–40%), high light' },
  { species: 'orchid', label: 'Orchid', emoji: '🌸', tip: 'Medium humidity (50–80%), bright light' },
  { species: 'succulent', label: 'Succulent', emoji: '🪴', tip: 'Low humidity (20–50%), bright light' },
];

const ORGANISMS: { species: OrganismSpecies; label: string; emoji: string; tip: string }[] = [
  { species: 'isopod', label: 'Isopod', emoji: '🐛', tip: 'Eats debris, aids decomposition' },
  { species: 'springtail', label: 'Springtail', emoji: '🦗', tip: 'Eats mold and debris' },
  { species: 'snail', label: 'Snail', emoji: '🐌', tip: 'Eats biomass, produces waste' },
  { species: 'beetle', label: 'Beetle', emoji: '🐞', tip: 'Eats debris and biomass' },
];

const PRESETS: { name: string; label: string; emoji: string; desc: string }[] = [
  { name: 'tropical', label: 'Tropical', emoji: '🌴', desc: 'Fern + Orchid + Isopod' },
  { name: 'desert', label: 'Desert', emoji: '🏜️', desc: 'Cactus + Succulent' },
  { name: 'forest', label: 'Forest Floor', emoji: '🌲', desc: 'Moss + Fern + Springtail + Isopod' },
];

export function SpawnPanel({ onAddPlant, onAddOrganism, onSpawnPreset }: SpawnPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Spawn</h2>

      <div>
        <p className="text-xs text-zinc-500 mb-2">Plants</p>
        <div className="flex flex-col gap-1.5">
          {PLANTS.map((p) => (
            <button
              key={p.species}
              onClick={() => onAddPlant(p.species)}
              title={p.tip}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-xs font-medium hover:bg-emerald-800/50 transition-colors text-left w-full"
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-500 mb-2">Organisms</p>
        <div className="flex flex-col gap-1.5">
          {ORGANISMS.map((o) => (
            <button
              key={o.species}
              onClick={() => onAddOrganism(o.species)}
              title={o.tip}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs font-medium hover:bg-amber-800/50 transition-colors text-left w-full"
            >
              <span>{o.emoji}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-zinc-700" />

      <div>
        <p className="text-xs text-zinc-500 mb-2">Presets</p>
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSpawnPreset(preset.name)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs hover:bg-zinc-700 transition-colors text-left w-full"
            >
              <span className="text-base">{preset.emoji}</span>
              <div>
                <div className="font-medium">{preset.label}</div>
                <div className="text-zinc-400">{preset.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
