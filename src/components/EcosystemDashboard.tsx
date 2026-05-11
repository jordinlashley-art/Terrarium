"use client";

import { useEcosystemLogic } from "@/hooks/useEcosystemLogic";
import EntityCard from "@/components/EntityCard";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import SpawnPanel from "@/components/SpawnPanel";
import { AlgaeBloomSeverity, Organism, Plant } from "@/types/ecosystem";

/* ── Species visuals ─────────────────────────────────────── */

const PLANT_EMOJIS: Record<string, string> = {
  seagrass: "🌿",
  kelp: "🎋",
  coral: "🌸",
  anemone: "🌺",
  coralline_algae: "🌊",
  hornwort: "🌿",
};

const FISH_EMOJIS: Record<string, string> = {
  clownfish: "🐠",
  angelfish: "🐟",
  guppy: "🐡",
  shrimp: "🦐",
  crab: "🦀",
  snail: "🐌",
  axolotl: "🦎",
};

const BOTTOM_DWELLERS = new Set(["crab", "snail", "shrimp", "axolotl"]);

const ALGAE_BADGE: Record<AlgaeBloomSeverity, { label: string; style: string }> = {
  none: {
    label: "Water Clear",
    style: "bg-cyan-900/60 text-cyan-300 border-cyan-700/50",
  },
  mild: {
    label: "Mild Algae",
    style: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  },
  moderate: {
    label: "Algae Bloom",
    style: "bg-orange-900/60 text-orange-300 border-orange-700/50",
  },
  severe: {
    label: "Severe Bloom!",
    style: "bg-red-900/60 text-red-300 border-red-700/50",
  },
};

/* ── Glass styles ────────────────────────────────────────── */

const glassPanel = {
  background: "rgba(4, 18, 38, 0.78)",
  backdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(100, 200, 255, 0.10)",
  boxShadow:
    "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
} as React.CSSProperties;

/* ── Deterministic positioning helpers ───────────────────── */

function hashId(id: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) % 1000;
  }
  return h;
}

/* ── AquariumTank ────────────────────────────────────────── */

const BUBBLE_CONFIG = [
  { left: 7, size: 5, dur: 3.6, delay: 0 },
  { left: 18, size: 4, dur: 4.4, delay: 1.3 },
  { left: 30, size: 6, dur: 3.9, delay: 0.6 },
  { left: 45, size: 4, dur: 5.1, delay: 2.0 },
  { left: 58, size: 5, dur: 4.0, delay: 0.3 },
  { left: 70, size: 4, dur: 3.4, delay: 1.8 },
  { left: 82, size: 6, dur: 4.8, delay: 0.9 },
  { left: 92, size: 4, dur: 5.5, delay: 0.1 },
];

const DRIFT_NAMES = ["drift-1", "drift-2", "drift-3", "drift-4"];

function AquariumTank({
  plants,
  organisms,
}: {
  plants: Plant[];
  organisms: Organism[];
}) {
  const alivePlants = plants.filter((p) => p.isAlive);
  const aliveOrgs = organisms.filter((o) => o.isAlive);
  const deadOrgs = organisms.filter((o) => !o.isAlive);

  return (
    <div
      className="aquarium-tank"
      style={{
        position: "relative",
        height: "480px",
        borderRadius: "20px",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #093565 0%, #062448 22%, #041830 52%, #030f20 80%, #020a16 100%)",
        border: "2px solid rgba(80, 180, 255, 0.18)",
        animation: "water-glow-pulse 6s ease-in-out infinite",
      }}
    >
      {/* Caustic top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "140px",
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(60,190,255,0.22) 0%, transparent 75%)",
          animation: "caustic-shimmer 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Light rays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          width: "80px",
          height: "260px",
          background:
            "linear-gradient(180deg, rgba(100,220,255,0.14) 0%, transparent 100%)",
          filter: "blur(10px)",
          animation: "light-ray 3.5s ease-in-out 0s infinite alternate",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "38%",
          width: "60px",
          height: "200px",
          background:
            "linear-gradient(180deg, rgba(80,200,255,0.10) 0%, transparent 100%)",
          filter: "blur(12px)",
          animation: "light-ray-2 4.2s ease-in-out 1s infinite alternate",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "65%",
          width: "70px",
          height: "220px",
          background:
            "linear-gradient(180deg, rgba(100,210,255,0.12) 0%, transparent 100%)",
          filter: "blur(8px)",
          animation: "light-ray-3 5s ease-in-out 0.5s infinite alternate",
          pointerEvents: "none",
        }}
      />

      {/* Water surface shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "18px",
          background:
            "linear-gradient(180deg, rgba(120,220,255,0.18) 0%, transparent 100%)",
          animation: "surface-ripple 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Bubbles */}
      {BUBBLE_CONFIG.map((b, i) => (
        <div
          key={`bubble-${i}`}
          style={{
            position: "absolute",
            left: `${b.left}%`,
            bottom: "55px",
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: "50%",
            background: "rgba(190, 235, 255, 0.45)",
            border: "1px solid rgba(200, 245, 255, 0.65)",
            animation: `bubble-float ${b.dur}s linear ${b.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      ))}

      {/* Swimming fish (alive organisms, non-bottom-dwellers) */}
      {aliveOrgs
        .filter((o) => !BOTTOM_DWELLERS.has(o.species))
        .map((org, i) => {
          const total = Math.max(
            aliveOrgs.filter((o) => !BOTTOM_DWELLERS.has(o.species)).length,
            1
          );
          const xPct = 8 + ((hashId(org.id, 7) / 1000) * 60);
          const yPct = 8 + (i % 5) * 10;
          const driftName = DRIFT_NAMES[hashId(org.id, 13) % DRIFT_NAMES.length];
          const dur = 7 + (hashId(org.id, 3) % 6);
          const delay = (hashId(org.id, 17) % 40) / 10;
          const emoji = FISH_EMOJIS[org.species] ?? "🐟";
          const healthFactor = 0.5 + org.health * 0.005;
          void total;

          return (
            <div
              key={org.id}
              title={`${org.name} — HP: ${org.health.toFixed(0)}%`}
              style={{
                position: "absolute",
                left: `${xPct}%`,
                top: `${yPct}%`,
                fontSize: "28px",
                lineHeight: 1,
                cursor: "default",
                userSelect: "none",
                animation: `${driftName} ${dur}s ease-in-out ${delay}s infinite`,
                filter: `drop-shadow(0 3px 6px rgba(0,0,0,0.5)) brightness(${healthFactor})`,
                zIndex: 12,
                transition: "filter 1s",
              }}
            >
              {emoji}
            </div>
          );
        })}

      {/* Bottom dwellers */}
      {aliveOrgs
        .filter((o) => BOTTOM_DWELLERS.has(o.species))
        .map((org, i) => {
          const xPct = 15 + (i * 22) % 65;
          const emoji = FISH_EMOJIS[org.species] ?? "🦐";
          const dur = 4 + i * 1.2;
          const delay = i * 0.8;
          const healthFactor = 0.5 + org.health * 0.005;

          return (
            <div
              key={org.id}
              title={`${org.name} — HP: ${org.health.toFixed(0)}%`}
              style={{
                position: "absolute",
                left: `${xPct}%`,
                bottom: "52px",
                fontSize: "26px",
                lineHeight: 1,
                cursor: "default",
                userSelect: "none",
                animation: `bob ${dur}s ease-in-out ${delay}s infinite`,
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6)) brightness(${healthFactor})`,
                zIndex: 12,
              }}
            >
              {emoji}
            </div>
          );
        })}

      {/* Dead fish (greyed out, sinking) */}
      {deadOrgs.slice(0, 6).map((org, i) => {
        const emoji = FISH_EMOJIS[org.species] ?? "🐟";
        const xPct = 10 + (i * 16) % 75;
        return (
          <div
            key={org.id}
            style={{
              position: "absolute",
              left: `${xPct}%`,
              top: "58%",
              fontSize: "20px",
              opacity: 0.25,
              transform: "rotate(90deg)",
              filter: "grayscale(100%)",
              zIndex: 8,
              userSelect: "none",
            }}
          >
            {emoji}
          </div>
        );
      })}

      {/* Plants (swaying at bottom) */}
      {alivePlants.map((plant, i) => {
        const total = Math.max(alivePlants.length, 1);
        const xPct = 4 + (i / total) * 85;
        const delay = (hashId(plant.id, 5) % 30) / 10;
        const duration = 2.0 + (hashId(plant.id, 11) % 20) / 10;
        const emoji = PLANT_EMOJIS[plant.species] ?? "🌿";
        const isLarge =
          plant.species === "kelp" || plant.species === "coral";
        const fontSize = isLarge ? "38px" : "28px";
        const healthBrightness = 0.4 + plant.health * 0.006;
        const swayAnim =
          i % 2 === 0 ? "plant-sway" : "plant-sway-slow";

        return (
          <div
            key={plant.id}
            title={`${plant.name} — HP: ${plant.health.toFixed(0)}%`}
            style={{
              position: "absolute",
              left: `${xPct}%`,
              bottom: "48px",
              fontSize,
              lineHeight: 1,
              cursor: "default",
              userSelect: "none",
              animation: `${swayAnim} ${duration}s ease-in-out ${delay}s infinite`,
              transformOrigin: "bottom center",
              filter: `drop-shadow(0 4px 8px rgba(0, 200, 140, 0.3)) brightness(${healthBrightness})`,
              zIndex: 10,
            }}
          >
            {emoji}
          </div>
        );
      })}

      {/* Sandy / rocky substrate */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "52px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(90,70,35,0.55) 35%, rgba(70,55,28,0.85) 100%)",
          pointerEvents: "none",
          zIndex: 9,
        }}
      />
      {/* Pebble layer */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          left: 0,
          right: 0,
          height: "14px",
          display: "flex",
          alignItems: "flex-end",
          paddingLeft: "6px",
          gap: "2px",
          fontSize: "12px",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              opacity: 0.5 + (i % 3) * 0.15,
              fontSize: i % 3 === 0 ? "13px" : "9px",
            }}
          >
            🪨
          </span>
        ))}
      </div>

      {/* Glass left edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "5px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.02) 100%)",
          borderRadius: "20px 0 0 20px",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
      {/* Glass right edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "3px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          borderRadius: "0 20px 20px 0",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
      {/* Glass top edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, transparent 2%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.18) 80%, transparent 98%)",
          borderRadius: "20px 20px 0 0",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* Empty state */}
      {alivePlants.length === 0 && aliveOrgs.length === 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "rgba(100, 190, 255, 0.45)",
            zIndex: 15,
          }}
        >
          <span style={{ fontSize: "52px", opacity: 0.4 }}>🐠</span>
          <p style={{ fontSize: "13px", fontWeight: 500 }}>
            Add plants and fish to populate your aquarium
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────── */

export default function EcosystemDashboard() {
  const {
    state,
    advanceTick,
    addPlant,
    addOrganism,
    updateEnvironment,
    spawnPreset,
    toggleRunning,
    resetEcosystem,
  } = useEcosystemLogic();

  const { plants, organisms, environment, algae, stats, tick, isRunning, log } =
    state;

  const alivePlants = plants.filter((p) => p.isAlive);
  const aliveOrganisms = organisms.filter((o) => o.isAlive);
  const algaeBadge = ALGAE_BADGE[algae.severity];

  return (
    <div
      className="min-h-screen text-gray-100"
      style={{
        background:
          "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(0,60,140,0.45) 0%, transparent 65%), linear-gradient(175deg, #020d1a 0%, #031525 50%, #020d1a 100%)",
      }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: "rgba(2, 10, 22, 0.88)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(80, 180, 255, 0.10)",
        }}
      >
        <div className="max-w-[1520px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,120,220,0.85) 0%, rgba(0,70,160,0.85) 100%)",
                border: "1px solid rgba(80,190,255,0.35)",
              }}
            >
              🐠
            </div>
            <div>
              <span className="text-sm font-semibold text-sky-100 tracking-tight">
                Aquarium
              </span>
              <span className="text-xs text-sky-600 ml-2 font-mono">
                Tick {tick}
              </span>
            </div>
          </div>

          {/* Algae/water status */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${algaeBadge.style}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {algaeBadge.label}
          </span>

          {/* Simulation controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={advanceTick}
              disabled={isRunning}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(100,200,255,0.15)",
              }}
            >
              Step →
            </button>
            <button
              onClick={toggleRunning}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={
                isRunning
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(180,40,40,0.85), rgba(140,20,20,0.85))",
                      border: "1px solid rgba(220,80,80,0.35)",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, rgba(0,100,220,0.9), rgba(0,70,170,0.9))",
                      border: "1px solid rgba(80,180,255,0.4)",
                    }
              }
            >
              {isRunning ? "⏸ Pause" : "▶ Run"}
            </button>
            <button
              onClick={resetEcosystem}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(100,200,255,0.15)",
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1520px] mx-auto px-6 py-6">
        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Plants Alive",
              value: `${alivePlants.length} / ${plants.length}`,
              sub: "active",
              color: "text-emerald-400",
              glow: "rgba(52,211,153,0.08)",
            },
            {
              label: "Animals Alive",
              value: `${aliveOrganisms.length} / ${organisms.length}`,
              sub: "swimming",
              color: "text-sky-400",
              glow: "rgba(56,189,248,0.08)",
            },
            {
              label: "Total Deaths",
              value: stats.totalDeaths,
              sub: "all time",
              color: "text-red-400",
              glow: "rgba(248,113,113,0.06)",
            },
            {
              label: "Algae Events",
              value: stats.algaeBloomEvents,
              sub: "recorded",
              color: "text-yellow-400",
              glow: "rgba(251,191,36,0.06)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl px-4 py-3"
              style={{
                ...glassPanel,
                boxShadow: `0 4px 20px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
            >
              <p className="text-xs mb-1" style={{ color: "rgba(100,180,255,0.5)" }}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold font-mono leading-none ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(80,140,200,0.5)" }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_310px] gap-6 items-start">

          {/* ─── Aquarium View ─── */}
          <div className="space-y-6">
            {/* Tank header */}
            <div
              className="rounded-2xl overflow-hidden"
              style={glassPanel}
            >
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{
                  borderBottom: "1px solid rgba(100,200,255,0.08)",
                  background: "rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🐟</span>
                  <h2 className="text-sm font-semibold tracking-wide" style={{ color: "#a8d8f8" }}>
                    Live Aquarium
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(100,180,255,0.5)" }}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
                    {alivePlants.length} plants
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400/70" />
                    {aliveOrganisms.length} animals
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-300/50" />
                    O₂ {environment.oxygenLevel.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="p-4">
                <AquariumTank plants={plants} organisms={organisms} />
              </div>
            </div>

            {/* Entity cards */}
            <div
              className="rounded-2xl overflow-hidden"
              style={glassPanel}
            >
              <div
                className="px-5 py-3"
                style={{
                  borderBottom: "1px solid rgba(100,200,255,0.08)",
                  background: "rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📊</span>
                  <h2 className="text-sm font-semibold tracking-wide" style={{ color: "#a8d8f8" }}>
                    Inhabitants
                  </h2>
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* Plants */}
                <section>
                  <h3
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "rgba(52,211,153,0.75)" }}
                  >
                    <span>🌿</span> Aquatic Plants
                  </h3>
                  {plants.length === 0 ? (
                    <div
                      className="rounded-2xl py-10 text-center text-sm"
                      style={{
                        border: "1px dashed rgba(100,200,255,0.1)",
                        background: "rgba(0,0,0,0.15)",
                        color: "rgba(80,160,220,0.4)",
                      }}
                    >
                      <span className="block text-3xl mb-2 opacity-30">🌿</span>
                      Add plants from the shop →
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {plants.map((plant) => (
                        <EntityCard key={plant.id} entity={plant} type="plant" />
                      ))}
                    </div>
                  )}
                </section>

                {/* Animals */}
                <section>
                  <h3
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "rgba(56,189,248,0.75)" }}
                  >
                    <span>🐠</span> Fish & Invertebrates
                  </h3>
                  {organisms.length === 0 ? (
                    <div
                      className="rounded-2xl py-10 text-center text-sm"
                      style={{
                        border: "1px dashed rgba(100,200,255,0.1)",
                        background: "rgba(0,0,0,0.15)",
                        color: "rgba(80,160,220,0.4)",
                      }}
                    >
                      <span className="block text-3xl mb-2 opacity-30">🐟</span>
                      Add fish from the shop →
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {organisms.map((org) => (
                        <EntityCard key={org.id} entity={org} type="organism" />
                      ))}
                    </div>
                  )}
                </section>

                {/* Activity log */}
                <section>
                  <h3
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "rgba(100,180,255,0.5)" }}
                  >
                    <span>📋</span> Activity Log
                  </h3>
                  <div
                    className="log-scroll rounded-xl p-4 h-36 overflow-y-auto space-y-1 font-mono text-xs"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(100,180,255,0.07)",
                    }}
                  >
                    {log.map((entry, i) => (
                      <div
                        key={i}
                        className="leading-relaxed"
                        style={{
                          color: i === 0 ? "rgba(180,220,255,0.85)" : "rgba(80,140,200,0.45)",
                        }}
                      >
                        {entry}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* ─── Control Sidebar ─── */}
          <div
            className="space-y-4 sticky top-14 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 3.5rem)" }}
          >
            <EnvironmentPanel
              environment={environment}
              onUpdate={updateEnvironment}
            />
            <SpawnPanel
              onAddPlant={addPlant}
              onAddOrganism={addOrganism}
              onSpawnPreset={spawnPreset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
