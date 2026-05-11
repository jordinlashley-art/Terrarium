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
      style={{ height: "3px", background: "rgba(100,200,255,0.08)" }}
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
  seagrass: "🌿",
  kelp: "🪸",
  coral: "🪸",
  anemone: "🌺",
  coralline_algae: "🌊",
  hornwort: "🌿",
  clownfish: "🐠",
  angelfish: "🐟",
  guppy: "🐡",
  shrimp: "🦐",
  crab: "🦀",
  snail: "🐌",
};

function isPlant(entity: Plant | Organism): entity is Plant {
  return "lightRequirement" in entity;
}

export default function EntityCard({ entity, type }: EntityCardProps) {
  const emoji =
    SPECIES_EMOJI[entity.species] ?? (type === "plant" ? "🌿" : "🐟");

  const healthColor =
    entity.health > 60
      ? "#34d399"
      : entity.health > 30
      ? "#fbbf24"
      : "#f87171";

  const energyColor =
    entity.energy > 60
      ? "#38bdf8"
      : entity.energy > 30
      ? "#fb923c"
      : "#f87171";

  const plant = isPlant(entity) ? entity : null;
  const organism = !isPlant(entity) ? entity : null;

  const bgAlive =
    type === "plant"
      ? "rgba(0, 55, 35, 0.5)"
      : "rgba(0, 40, 80, 0.5)";
  const bgDead = "rgba(10, 10, 20, 0.4)";
  const borderAlive =
    type === "plant"
      ? "rgba(52, 211, 153, 0.18)"
      : "rgba(56, 189, 248, 0.18)";
  const borderDead = "rgba(255,255,255,0.05)";

  return (
    <div
      className="rounded-xl p-3 transition-all duration-300"
      style={{
        background: entity.isAlive ? bgAlive : bgDead,
        border: `1px solid ${entity.isAlive ? borderAlive : borderDead}`,
        backdropFilter: "blur(8px)",
        opacity: entity.isAlive ? 1 : 0.4,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{
              background: entity.isAlive
                ? type === "plant"
                  ? "rgba(0, 160, 90, 0.25)"
                  : "rgba(0, 110, 200, 0.25)"
                : "rgba(255,255,255,0.04)",
            }}
          >
            {emoji}
          </span>
          <span
            className="text-sm font-semibold truncate leading-tight"
            style={{ color: entity.isAlive ? "#c0dff8" : "rgba(150,170,190,0.5)" }}
          >
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
                      ? "rgba(0,180,100,0.18)"
                      : "rgba(0,130,220,0.18)",
                  color: type === "plant" ? "#4ade80" : "#38bdf8",
                  border:
                    type === "plant"
                      ? "1px solid rgba(74,222,128,0.22)"
                      : "1px solid rgba(56,189,248,0.22)",
                }
              : {
                  background: "rgba(200,50,50,0.14)",
                  color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.18)",
                }
          }
        >
          {entity.isAlive ? "alive" : "dead"}
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-1.5">
        <div>
          <div
            className="flex justify-between text-xs mb-1"
            style={{ color: "rgba(150,200,240,0.45)" }}
          >
            <span>Health</span>
            <span style={{ color: healthColor }}>
              {entity.health.toFixed(0)}%
            </span>
          </div>
          <Bar value={entity.health} fillColor={healthColor} />
        </div>
        <div>
          <div
            className="flex justify-between text-xs mb-1"
            style={{ color: "rgba(150,200,240,0.45)" }}
          >
            <span>Energy</span>
            <span style={{ color: energyColor }}>
              {entity.energy.toFixed(0)}%
            </span>
          </div>
          <Bar value={entity.energy} fillColor={energyColor} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-3 pt-2 flex gap-3 text-xs"
        style={{
          borderTop: "1px solid rgba(100,200,255,0.06)",
          color: "rgba(100,160,210,0.45)",
        }}
      >
        <span>Age {entity.age}</span>
        {plant && (
          <span>+{plant.biomassProduced.toFixed(1)} biomass</span>
        )}
        {organism && (
          <span>{organism.wasteProduced.toFixed(1)} NH₃</span>
        )}
      </div>
    </div>
  );
}
