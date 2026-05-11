"use client";

import { useEcosystemLogic } from "@/hooks/useEcosystemLogic";
import EntityCard from "@/components/EntityCard";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import SpawnPanel from "@/components/SpawnPanel";
import { MoldSeverity } from "@/types/ecosystem";

const MOLD_BADGE: Record<MoldSeverity, { label: string; style: string }> = {
  none: { label: "No Mold", style: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50" },
  mild: { label: "Mild Mold", style: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50" },
  moderate: { label: "Moderate Mold", style: "bg-orange-900/60 text-orange-300 border-orange-700/50" },
  severe: { label: "Severe Mold!", style: "bg-red-900/60 text-red-300 border-red-700/50" },
};

const glassPanel = {
  background: "rgba(10, 28, 18, 0.72)",
  backdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
} as React.CSSProperties;

const glassTerrarium = {
  background:
    "linear-gradient(160deg, rgba(18, 52, 32, 0.55) 0%, rgba(6, 20, 12, 0.82) 100%)",
  backdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(100, 220, 140, 0.18)",
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 64px rgba(0,0,0,0.6), 0 0 120px rgba(0,80,30,0.08)",
} as React.CSSProperties;

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

  const { plants, organisms, environment, mold, stats, tick, isRunning, log } =
    state;

  const alivePlants = plants.filter((p) => p.isAlive);
  const aliveOrganisms = organisms.filter((o) => o.isAlive);
  const moldBadge = MOLD_BADGE[mold.severity];

  return (
    <div
      className="min-h-screen text-gray-100"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(10,50,25,0.55) 0%, transparent 70%), linear-gradient(170deg, #020a05 0%, #03100a 50%, #020a05 100%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: "rgba(4, 14, 8, 0.85)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1500px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{
                background:
                  "linear-gradient(135deg, rgba(40,140,70,0.8) 0%, rgba(20,80,40,0.8) 100%)",
                border: "1px solid rgba(80,200,110,0.3)",
              }}
            >
              🌿
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-100 tracking-tight">
                Terrarium
              </span>
              <span className="text-xs text-gray-500 ml-2 font-mono">
                Tick {tick}
              </span>
            </div>
          </div>

          {/* Mold status */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${moldBadge.style}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {moldBadge.label}
          </span>

          {/* Simulation controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={advanceTick}
              disabled={isRunning}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
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
                        "linear-gradient(135deg, rgba(180,40,40,0.8), rgba(140,20,20,0.8))",
                      border: "1px solid rgba(220,80,80,0.35)",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, rgba(30,140,70,0.9), rgba(20,100,50,0.9))",
                      border: "1px solid rgba(70,200,110,0.35)",
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
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto px-6 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Plants Alive",
              value: `${alivePlants.length} / ${plants.length}`,
              sub: "active",
              color: "text-emerald-400",
              glow: "rgba(50,200,100,0.08)",
            },
            {
              label: "Organisms Alive",
              value: `${aliveOrganisms.length} / ${organisms.length}`,
              sub: "active",
              color: "text-cyan-400",
              glow: "rgba(50,150,220,0.08)",
            },
            {
              label: "Total Deaths",
              value: stats.totalDeaths,
              sub: "all time",
              color: "text-red-400",
              glow: "rgba(200,50,50,0.06)",
            },
            {
              label: "Mold Events",
              value: stats.moldGrowthEvents,
              sub: "recorded",
              color: "text-yellow-400",
              glow: "rgba(200,160,50,0.06)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl px-4 py-3"
              style={{
                ...glassPanel,
                boxShadow: `0 4px 20px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold font-mono leading-none ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main layout: Terrarium View (center) + Control Sidebar (right) */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_310px] gap-6 items-start">

          {/* ─── Terrarium View ─── */}
          <div className="rounded-3xl overflow-hidden" style={glassTerrarium}>
            {/* Terrarium header bar */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔬</span>
                <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
                  Terrarium View
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
                  {alivePlants.length} plants
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/70" />
                  {aliveOrganisms.length} organisms
                </span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Plants section */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400/80 mb-4">
                  <span>🌿</span> Plants
                </h3>
                {plants.length === 0 ? (
                  <div
                    className="rounded-2xl py-12 text-center text-sm text-gray-600"
                    style={{
                      border: "1px dashed rgba(255,255,255,0.07)",
                      background: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <span className="block text-3xl mb-2 opacity-30">🌱</span>
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

              {/* Organisms section */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400/80 mb-4">
                  <span>🐛</span> Organisms
                </h3>
                {organisms.length === 0 ? (
                  <div
                    className="rounded-2xl py-12 text-center text-sm text-gray-600"
                    style={{
                      border: "1px dashed rgba(255,255,255,0.07)",
                      background: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <span className="block text-3xl mb-2 opacity-30">🐾</span>
                    Add organisms from the shop →
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {organisms.map((org) => (
                      <EntityCard key={org.id} entity={org} type="organism" />
                    ))}
                  </div>
                )}
              </section>

              {/* Activity Log */}
              <section>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  <span>📋</span> Activity Log
                </h3>
                <div
                  className="log-scroll rounded-xl p-4 h-36 overflow-y-auto space-y-1 font-mono text-xs"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {log.map((entry, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed ${
                        i === 0 ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ─── Control Sidebar ─── */}
          <div className="space-y-4">
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
