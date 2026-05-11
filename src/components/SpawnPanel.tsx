"use client";

import { OrganismSpecies, PlantSpecies } from "@/types/ecosystem";

interface SpawnPanelProps {
  onAddPlant: (species: PlantSpecies) => void;
  onAddOrganism: (species: OrganismSpecies) => void;
  onSpawnPreset: (
    preset: "tropical" | "desert" | "temperate" | "decomposer"
  ) => void;
}

interface ShopItemProps {
  emoji: string;
  label: string;
  hint: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  onClick: () => void;
}

function ShopItem({
  emoji,
  label,
  hint,
  accentColor,
  glowColor,
  borderColor,
  onClick,
}: ShopItemProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl p-3 transition-all duration-200 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${accentColor}18 0%, rgba(0,0,0,0.1) 100%)`,
        border: `1px solid ${borderColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`;
        (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor + "60";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        (e.currentTarget as HTMLButtonElement).style.borderColor = borderColor;
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
        >
          {emoji}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-200 leading-tight">
            {label}
          </div>
          <div className="text-xs text-gray-500 leading-tight mt-0.5">{hint}</div>
        </div>
        <span
          className="ml-auto text-xs font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: accentColor }}
        >
          + Add
        </span>
      </div>
    </button>
  );
}

const glassCard = {
  background: "rgba(10, 28, 18, 0.72)",
  backdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
} as React.CSSProperties;

export default function SpawnPanel({
  onAddPlant,
  onAddOrganism,
}: SpawnPanelProps) {
  return (
    <div className="rounded-2xl p-5 space-y-5" style={glassCard}>
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "rgba(100,60,200,0.2)",
            border: "1px solid rgba(140,90,230,0.25)",
          }}
        >
          🛒
        </div>
        <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
          Shop
        </h2>
      </div>

      {/* Plants */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-1.5 h-4 rounded-full"
            style={{ background: "#4ade80" }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
            Plants
          </p>
        </div>
        <div className="space-y-2">
          <ShopItem
            emoji="🪴"
            label="Moss"
            hint="Low light · moist · humid"
            accentColor="#4ade80"
            glowColor="rgba(74,222,128,0.2)"
            borderColor="rgba(74,222,128,0.12)"
            onClick={() => onAddPlant("moss")}
          />
          <ShopItem
            emoji="🌿"
            label="Fern"
            hint="High humidity · moderate light"
            accentColor="#34d399"
            glowColor="rgba(52,211,153,0.2)"
            borderColor="rgba(52,211,153,0.12)"
            onClick={() => onAddPlant("fern")}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

      {/* Organisms */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-1.5 h-4 rounded-full"
            style={{ background: "#67e8f9" }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
            Organisms
          </p>
        </div>
        <div className="space-y-2">
          <ShopItem
            emoji="🐛"
            label="Isopod"
            hint="Decomposer · high biomass need"
            accentColor="#67e8f9"
            glowColor="rgba(103,232,249,0.2)"
            borderColor="rgba(103,232,249,0.12)"
            onClick={() => onAddOrganism("isopod")}
          />
          <ShopItem
            emoji="🦗"
            label="Springtail"
            hint="Micro-cleaner · low consumption"
            accentColor="#818cf8"
            glowColor="rgba(129,140,248,0.2)"
            borderColor="rgba(129,140,248,0.12)"
            onClick={() => onAddOrganism("springtail")}
          />
        </div>
      </div>
    </div>
  );
}
