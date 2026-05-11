"use client";

import { Organism, Plant } from "@/types/ecosystem";

interface EntityCardProps {
  entity: Plant | Organism;
  type: "plant" | "organism";
}

function Bar({ value, fillColor }: { value: number; fillColor: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: fillColor,
          boxShadow: pct > 20 ? `0 0 4px ${fillColor}80` : "none",
        }}
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
      ? "#4ade80"
      : entity.health > 30
      ? "#facc15"
      : "#f87171";

  const energyColor =
    entity.energy > 60
      ? "#38bdf8"
      : entity.energy > 30
      ? "#fb923c"
      : "#f87171";

  const plant = isPlant(entity) ? entity : null;
  const organism = !isPlant(entity) ? entity : null;

  const accentAlive =
    type === "plant"
      ? "rgba(20, 70, 38, 0.55)"
      : "rgba(18, 48, 72, 0.55)";
  const accentDead = "rgba(15, 15, 15, 0.4)";
  const borderAlive =
    type === "plant"
      ? "rgba(80, 200, 120, 0.18)"
      : "rgba(80, 160, 220, 0.18)";
  const borderDead = "rgba(255,255,255,0.05)";

  return (
    <div
      className="rounded-xl p-3 transition-all duration-300"
      style={{
        background: entity.isAlive ? accentAlive : accentDead,
        border: `1px solid ${entity.isAlive ? borderAlive : borderDead}`,
        backdropFilter: "blur(8px)",
        opacity: entity.isAlive ? 1 : 0.45,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{
              background: entity.isAlive
                ? type === "plant"
                  ? "rgba(50,150,80,0.3)"
                  : "rgba(40,100,180,0.3)"
                : "rgba(255,255,255,0.05)",
            }}
          >
            {emoji}
          </span>
          <span className="text-sm font-semibold text-gray-200 truncate leading-tight">
            {entity.name}
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-1"
          style={
            entity.isAlive
              ? {
                  background:
                    type === "plant"
                      ? "rgba(40,180,90,0.2)"
                      : "rgba(40,120,200,0.2)",
                  color:
                    type === "plant" ? "#4ade80" : "#38bdf8",
                  border:
                    type === "plant"
                      ? "1px solid rgba(74,222,128,0.25)"
                      : "1px solid rgba(56,189,248,0.25)",
                }
              : {
                  background: "rgba(200,50,50,0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.2)",
                }
          }
        >
          {entity.isAlive ? "alive" : "dead"}
        </span>
      </div>

      {/* Health / Energy bars */}
      <div className="space-y-1.5">
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(200,200,200,0.5)" }}>
            <span>Health</span>
            <span style={{ color: healthColor }}>{entity.health.toFixed(0)}%</span>
          </div>
          <Bar value={entity.health} fillColor={healthColor} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(200,200,200,0.5)" }}>
            <span>Energy</span>
            <span style={{ color: energyColor }}>{entity.energy.toFixed(0)}%</span>
          </div>
          <Bar value={entity.energy} fillColor={energyColor} />
        </div>
      </div>

      {/* Footer meta */}
      <div
        className="mt-3 pt-2 flex gap-3 text-xs"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(160,160,160,0.6)",
        }}
      >
        <span>Age {entity.age}</span>
        {plant && <span>+{plant.biomassProduced.toFixed(1)} biomass</span>}
        {organism && <span>{organism.wasteProduced.toFixed(1)} waste</span>}
      </div>
    </div>
  );
}
