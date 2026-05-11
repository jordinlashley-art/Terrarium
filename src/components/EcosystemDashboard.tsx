"use client";

import { useEcosystemLogic } from "@/hooks/useEcosystemLogic";
import EntityCard from "@/components/EntityCard";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import SpawnPanel from "@/components/SpawnPanel";
import { MoldSeverity } from "@/types/ecosystem";

const MOLD_COLORS: Record<MoldSeverity, string> = {
  none: "bg-gray-700 text-gray-400",
  mild: "bg-yellow-900 text-yellow-300",
  moderate: "bg-orange-900 text-orange-300",
  severe: "bg-red-900 text-red-300",
};

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h1 className="text-lg font-bold text-gray-100 leading-tight">
                Terrarium
              </h1>
              <p className="text-xs text-gray-400">Ecosystem Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded">
              Tick {tick}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                MOLD_COLORS[mold.severity]
              }`}
            >
              Mold: {mold.severity}
            </span>

            <button
              onClick={advanceTick}
              disabled={isRunning}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-600"
            >
              Step →
            </button>

            <button
              onClick={toggleRunning}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isRunning
                  ? "bg-red-700 hover:bg-red-600 border-red-600 text-white"
                  : "bg-emerald-700 hover:bg-emerald-600 border-emerald-600 text-white"
              }`}
            >
              {isRunning ? "⏸ Pause" : "▶ Run"}
            </button>

            <button
              onClick={resetEcosystem}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors"
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Plants Alive",
              value: `${alivePlants.length} / ${plants.length}`,
              color: "text-emerald-400",
            },
            {
              label: "Organisms Alive",
              value: `${aliveOrganisms.length} / ${organisms.length}`,
              color: "text-blue-400",
            },
            {
              label: "Total Deaths",
              value: stats.totalDeaths,
              color: "text-red-400",
            },
            {
              label: "Mold Events",
              value: stats.moldGrowthEvents,
              color: "text-yellow-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
            >
              <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
              <p className={`text-xl font-bold font-mono ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
          {/* Left: Controls */}
          <div className="space-y-4">
            <EnvironmentPanel
              environment={environment}
              onUpdate={updateEnvironment}
            />
          </div>

          {/* Center: Entities */}
          <div className="space-y-5">
            {/* Plants */}
            <section>
              <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <span>🌿</span> Plants
                <span className="text-gray-500 font-normal">
                  ({alivePlants.length} alive)
                </span>
              </h2>
              {plants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 py-8 text-center text-gray-500 text-sm">
                  No plants yet — add some from the spawn panel
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {plants.map((plant) => (
                    <EntityCard key={plant.id} entity={plant} type="plant" />
                  ))}
                </div>
              )}
            </section>

            {/* Organisms */}
            <section>
              <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <span>🐛</span> Organisms
                <span className="text-gray-500 font-normal">
                  ({aliveOrganisms.length} alive)
                </span>
              </h2>
              {organisms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 py-8 text-center text-gray-500 text-sm">
                  No organisms yet — add some from the spawn panel
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {organisms.map((org) => (
                    <EntityCard key={org.id} entity={org} type="organism" />
                  ))}
                </div>
              )}
            </section>

            {/* Activity Log */}
            <section>
              <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <span>📋</span> Activity Log
              </h2>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 h-40 overflow-y-auto space-y-0.5 font-mono text-xs">
                {log.map((entry, i) => (
                  <div
                    key={i}
                    className={`${
                      i === 0 ? "text-gray-200" : "text-gray-500"
                    } leading-relaxed`}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Spawn */}
          <div>
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
