"use client";

import { OrganismSpecies, PlantSpecies } from "@/types/ecosystem";

interface SpawnPanelProps {
  onAddPlant: (species: PlantSpecies) => void;
  onAddOrganism: (species: OrganismSpecies) => void;
  onSpawnPreset: (
    preset: "tropical_reef" | "freshwater" | "cold_water" | "mini_reef"
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
        background: `linear-gradient(135deg, ${accentColor}14 0%, rgba(0,0,0,0.08) 100%)`,
        border: `1px solid ${borderColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`;
        (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor + "55";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        (e.currentTarget as HTMLButtonElement).style.borderColor = borderColor;
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}28`,
          }}
        >
          {emoji}
        </span>
        <div className="min-w-0">
          <div
            className="text-sm font-semibold leading-tight"
            style={{ color: "#c0dff8" }}
          >
            {label}
          </div>
          <div
            className="text-xs leading-tight mt-0.5"
            style={{ color: "rgba(80,160,220,0.55)" }}
          >
            {hint}
          </div>
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

interface PresetButtonProps {
  emoji: string;
  label: string;
  hint: string;
  onClick: () => void;
}

function PresetButton({ emoji, label, hint, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl p-2.5 transition-all duration-200 cursor-pointer"
      style={{
        background: "rgba(0, 80, 160, 0.12)",
        border: "1px solid rgba(80,180,255,0.12)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0, 100, 200, 0.2)";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(80,180,255,0.28)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0, 80, 160, 0.12)";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(80,180,255,0.12)";
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <div className="min-w-0">
          <div
            className="text-xs font-semibold leading-tight"
            style={{ color: "#93c5fd" }}
          >
            {label}
          </div>
          <div
            className="text-xs leading-tight"
            style={{ color: "rgba(80,140,200,0.5)" }}
          >
            {hint}
          </div>
        </div>
      </div>
    </button>
  );
}

const glassCard = {
  background: "rgba(4, 18, 38, 0.78)",
  backdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(100, 200, 255, 0.10)",
  boxShadow:
    "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
} as React.CSSProperties;

export default function SpawnPanel({
  onAddPlant,
  onAddOrganism,
  onSpawnPreset,
}: SpawnPanelProps) {
  return (
    <div className="rounded-2xl p-5 space-y-5" style={glassCard}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{
            background: "rgba(0,100,200,0.25)",
            border: "1px solid rgba(80,180,255,0.3)",
          }}
        >
          🛒
        </div>
        <h2
          className="text-sm font-semibold tracking-wide"
          style={{ color: "#b0d8f8" }}
        >
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
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(74,222,128,0.75)" }}
          >
            Plants
          </p>
        </div>
        <div className="space-y-2">
          <ShopItem
            emoji="🌿"
            label="Seagrass"
            hint="Hardy · all salinities"
            accentColor="#4ade80"
            glowColor="rgba(74,222,128,0.18)"
            borderColor="rgba(74,222,128,0.12)"
            onClick={() => onAddPlant("seagrass")}
          />
          <ShopItem
            emoji="🪸"
            label="Giant Kelp"
            hint="Cold water · high nutrient need"
            accentColor="#34d399"
            glowColor="rgba(52,211,153,0.18)"
            borderColor="rgba(52,211,153,0.12)"
            onClick={() => onAddPlant("kelp")}
          />
          <ShopItem
            emoji="🪸"
            label="Staghorn Coral"
            hint="Reef · high light · delicate"
            accentColor="#f9a8d4"
            glowColor="rgba(249,168,212,0.18)"
            borderColor="rgba(249,168,212,0.12)"
            onClick={() => onAddPlant("coral")}
          />
          <ShopItem
            emoji="🌺"
            label="Sea Anemone"
            hint="Reef · partners with clownfish"
            accentColor="#fb923c"
            glowColor="rgba(251,146,60,0.18)"
            borderColor="rgba(251,146,60,0.12)"
            onClick={() => onAddPlant("anemone")}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(100,200,255,0.06)" }} />

      {/* Animals */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-1.5 h-4 rounded-full"
            style={{ background: "#38bdf8" }}
          />
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(56,189,248,0.75)" }}
          >
            Fish & Invertebrates
          </p>
        </div>
        <div className="space-y-2">
          <ShopItem
            emoji="🐠"
            label="Clownfish"
            hint="Reef species · moderate appetite"
            accentColor="#f97316"
            glowColor="rgba(249,115,22,0.18)"
            borderColor="rgba(249,115,22,0.12)"
            onClick={() => onAddOrganism("clownfish")}
          />
          <ShopItem
            emoji="🐟"
            label="Angelfish"
            hint="Elegant · larger appetite"
            accentColor="#a78bfa"
            glowColor="rgba(167,139,250,0.18)"
            borderColor="rgba(167,139,250,0.12)"
            onClick={() => onAddOrganism("angelfish")}
          />
          <ShopItem
            emoji="🐡"
            label="Guppy"
            hint="Freshwater · small · easy"
            accentColor="#38bdf8"
            glowColor="rgba(56,189,248,0.18)"
            borderColor="rgba(56,189,248,0.12)"
            onClick={() => onAddOrganism("guppy")}
          />
          <ShopItem
            emoji="🦐"
            label="Cleaner Shrimp"
            hint="Bottom feeder · scavenger"
            accentColor="#fde68a"
            glowColor="rgba(253,230,138,0.18)"
            borderColor="rgba(253,230,138,0.12)"
            onClick={() => onAddOrganism("shrimp")}
          />
          <ShopItem
            emoji="🦀"
            label="Hermit Crab"
            hint="Cold water · debris cleaner"
            accentColor="#fb7185"
            glowColor="rgba(251,113,133,0.18)"
            borderColor="rgba(251,113,133,0.12)"
            onClick={() => onAddOrganism("crab")}
          />
          <ShopItem
            emoji="🐌"
            label="Nerite Snail"
            hint="Algae eater · slow · hardy"
            accentColor="#86efac"
            glowColor="rgba(134,239,172,0.18)"
            borderColor="rgba(134,239,172,0.12)"
            onClick={() => onAddOrganism("snail")}
          />
          <ShopItem
            emoji="🦎"
            label="Axolotl"
            hint="Freshwater · bottom walker · unique"
            accentColor="#c084fc"
            glowColor="rgba(192,132,252,0.18)"
            borderColor="rgba(192,132,252,0.12)"
            onClick={() => onAddOrganism("axolotl")}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(100,200,255,0.06)" }} />

      {/* Presets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-1.5 h-4 rounded-full"
            style={{ background: "#818cf8" }}
          />
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(129,140,248,0.75)" }}
          >
            Biome Presets
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <PresetButton
            emoji="🐠"
            label="Tropical Reef"
            hint="Warm · coral + clownfish"
            onClick={() => onSpawnPreset("tropical_reef")}
          />
          <PresetButton
            emoji="🐡"
            label="Freshwater"
            hint="Low salt · guppies + plants"
            onClick={() => onSpawnPreset("freshwater")}
          />
          <PresetButton
            emoji="🦀"
            label="Cold Water"
            hint="Cool · kelp + crabs"
            onClick={() => onSpawnPreset("cold_water")}
          />
          <PresetButton
            emoji="🪸"
            label="Mini Reef"
            hint="Reef diversity · shrimp"
            onClick={() => onSpawnPreset("mini_reef")}
          />
        </div>
      </div>
    </div>
  );
}
