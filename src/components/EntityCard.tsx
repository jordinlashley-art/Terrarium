'use client';

import type { Plant, Organism } from '../types/ecosystem';

interface PlantCardProps {
  entity: Plant;
  type: 'plant';
}

interface OrganismCardProps {
  entity: Organism;
  type: 'organism';
}

type EntityCardProps = PlantCardProps | OrganismCardProps;

function HealthBar({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

const SPECIES_EMOJI: Record<string, string> = {
  fern: '🌿',
  moss: '🟢',
  cactus: '🌵',
  orchid: '🌸',
  succulent: '🪴',
  isopod: '🐛',
  springtail: '🦗',
  snail: '🐌',
  beetle: '🐞',
};

function healthColor(health: number) {
  if (health > 60) return 'bg-emerald-500';
  if (health > 30) return 'bg-amber-500';
  return 'bg-red-500';
}

function healthTextColor(health: number) {
  if (health > 60) return 'text-emerald-400';
  if (health > 30) return 'text-amber-400';
  return 'text-red-400';
}

export function EntityCard({ entity, type }: EntityCardProps) {
  const emoji = SPECIES_EMOJI[entity.species] ?? '?';

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium text-zinc-100 text-sm">
          <span>{emoji}</span>
          <span>{entity.name}</span>
        </span>
        <span className="text-xs text-zinc-500">age {entity.age}</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Health</span>
          <span className={healthTextColor(entity.health)}>
            {Math.round(entity.health)}%
          </span>
        </div>
        <HealthBar value={entity.health} colorClass={healthColor(entity.health)} />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Energy</span>
          <span className="text-blue-400">{Math.round(entity.energy)}%</span>
        </div>
        <HealthBar value={entity.energy} colorClass="bg-blue-500" />
      </div>

      <div className="text-xs text-zinc-500 capitalize">{type} · {entity.species}</div>
    </div>
  );
}
