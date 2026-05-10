"use client";

import { useEcosystemLogic } from "@/hooks/useEcosystemLogic";
import EnvironmentPanel from "./EnvironmentPanel";
import { OrganismCard, PlantCard } from "./EntityCard";
import SpawnPanel from "./SpawnPanel";
import HealthBar from "./HealthBar";
import { type EcosystemEvent } from "@/types/ecosystem";

const severityColor: Record<EcosystemEvent["severity"], string> = {
  info: "text-slate-400",
  warning: "text-amber-400",
  critical: "text-red-400",
};

function MetricTile({
  label,
  value,
  unit = "",
  colorClass = "text-white",
}: {
  label: string;
  value: number | string;
  unit?: string;
  colorClass?: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-3 text-center">
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold tabular-nums mt-0.5 ${colorClass}`}>
        {typeof value === "number" ? Math.round(value) : value}
        {unit}
      </p>
    </div>
  );
}

export default function EcosystemDashboard() {
  const {
    state,
    advanceTick,
    setAutoTick,
    removeEntity,
    updateEnvironment,
    spawnPreset,
    isAutoTicking,
  } = useEcosystemLogic();

  const { plants, organisms, environment, ecosystemHealth, biomassPool, debris, mold, tick, eventLog } =
    state;

  const alivePlants = plants.filter((p) => p.isAlive);
  const aliveOrganisms = organisms.filter((o) => o.isAlive);

  const healthColor =
    ecosystemHealth > 60
      ? "text-emerald-400"
      : ecosystemHealth > 30
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
              🌿 Terrarium
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Ecosystem Simulation — Tick {tick}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={advanceTick}
              disabled={isAutoTicking}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40
                         rounded-lg text-sm font-medium transition-colors"
            >
              Step ▶
            </button>
            <button
              onClick={() => setAutoTick(!isAutoTicking)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAutoTicking
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
            >
              {isAutoTicking ? "⏸ Pause" : "⏵ Auto"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left sidebar */}
        <aside className="space-y-4">
          <EnvironmentPanel environment={environment} onUpdate={updateEnvironment} />
          <SpawnPanel onSpawn={spawnPreset} />
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          {/* Key metrics */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricTile
                label="Ecosystem Health"
                value={ecosystemHealth}
                unit="%"
                colorClass={healthColor}
              />
              <MetricTile
                label="Biomass Pool"
                value={biomassPool}
                unit=" u"
                colorClass="text-green-400"
              />
              <MetricTile
                label="Debris"
                value={debris}
                unit=" u"
                colorClass="text-amber-400"
              />
              <MetricTile
                label="Mold Level"
                value={mold}
                unit="%"
                colorClass={mold > 50 ? "text-red-400" : "text-slate-300"}
              />
            </div>

            <div className="mt-3">
              <HealthBar
                value={ecosystemHealth}
                label="Overall Ecosystem Health"
                height="h-3"
                showValue
              />
            </div>
          </section>

          {/* Plants & Organisms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plants */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Plants ({alivePlants.length} alive / {plants.length} total)
              </h2>
              {plants.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No plants yet — add some from the panel.
                </p>
              ) : (
                <div className="space-y-2">
                  {plants.map((plant) => (
                    <PlantCard
                      key={plant.id}
                      entity={plant}
                      onRemove={removeEntity}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Organisms */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Organisms ({aliveOrganisms.length} alive / {organisms.length}{" "}
                total)
              </h2>
              {organisms.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No organisms yet — add some from the panel.
                </p>
              ) : (
                <div className="space-y-2">
                  {organisms.map((org) => (
                    <OrganismCard
                      key={org.id}
                      entity={org}
                      onRemove={removeEntity}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Event log */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Event Log
            </h2>
            <div className="bg-slate-800/60 rounded-xl p-3 h-44 overflow-y-auto font-mono text-xs space-y-0.5">
              {eventLog.length === 0 ? (
                <p className="text-slate-500 italic">
                  No events yet. Start the simulation.
                </p>
              ) : (
                [...eventLog].reverse().map((evt, i) => (
                  <p key={i} className={severityColor[evt.severity]}>
                    <span className="text-slate-500">[{evt.tick}]</span>{" "}
                    {evt.message}
                  </p>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
