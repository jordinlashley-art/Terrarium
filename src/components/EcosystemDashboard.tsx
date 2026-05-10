'use client';

import { useEcosystemLogic } from '../hooks/useEcosystemLogic';
import { EnvironmentPanel } from './EnvironmentPanel';
import { EntityCard } from './EntityCard';
import { SpawnPanel } from './SpawnPanel';

export function EcosystemDashboard() {
  const {
    state,
    isRunning,
    speed,
    setSpeed,
    advanceTick,
    addPlant,
    addOrganism,
    updateEnvironment,
    spawnPreset,
    toggleRunning,
    resetEcosystem,
  } = useEcosystemLogic();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-tight">Terrarium</h1>
            <p className="text-xs text-zinc-400">
              Ecosystem Simulator &mdash; Tick {state.tick}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1.5 cursor-pointer"
          >
            <option value={2000}>0.5× Speed</option>
            <option value={1000}>1× Speed</option>
            <option value={500}>2× Speed</option>
            <option value={250}>4× Speed</option>
          </select>

          <button
            onClick={advanceTick}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs hover:bg-zinc-700 disabled:opacity-40 transition-colors"
          >
            Step
          </button>

          <button
            onClick={toggleRunning}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isRunning
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Run'}
          </button>

          <button
            onClick={resetEcosystem}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs hover:bg-zinc-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 gap-3 p-3 overflow-auto min-h-0">
        {/* Left: Environment controls */}
        <div className="w-56 flex-shrink-0">
          <EnvironmentPanel environment={state.environment} onUpdate={updateEnvironment} />
        </div>

        {/* Center: Entities + Log */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Plants */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Plants ({state.plants.length})
            </h2>
            {state.plants.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">
                No plants yet. Add some from the spawn panel or choose a preset.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {state.plants.map((plant) => (
                  <EntityCard key={plant.id} entity={plant} type="plant" />
                ))}
              </div>
            )}
          </div>

          {/* Organisms */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Organisms ({state.organisms.length})
            </h2>
            {state.organisms.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">
                No organisms yet. Add some from the spawn panel.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {state.organisms.map((org) => (
                  <EntityCard key={org.id} entity={org} type="organism" />
                ))}
              </div>
            )}
          </div>

          {/* Activity log */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex-1">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Activity Log
            </h2>
            <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-1">
              {state.log.map((entry, i) => (
                <p
                  key={i}
                  className={`text-xs font-mono leading-relaxed ${
                    i === 0 ? 'text-zinc-200' : 'text-zinc-500'
                  }`}
                >
                  {entry}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Spawn panel */}
        <div className="w-48 flex-shrink-0">
          <SpawnPanel
            onAddPlant={addPlant}
            onAddOrganism={addOrganism}
            onSpawnPreset={spawnPreset}
          />
        </div>
      </div>
    </div>
  );
}
