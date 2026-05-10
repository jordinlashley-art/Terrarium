import { useEffect } from 'react';
import { useEcosystem } from './hooks/useEcosystem';
import { useGameLoop } from './hooks/useGameLoop';
import { TerrariumView } from './components/TerrariumView';
import { TimeControls } from './components/TimeControls';
import { EnvironmentControls } from './components/EnvironmentControls';
import { EntityCard } from './components/EntityCard';
import { LogPanel } from './components/LogPanel';
import { saveState } from './utils/storage';
import { EntityType } from './types/ecosystem';

const ENTITY_TYPES: EntityType[] = ['moss', 'fern', 'isopod', 'springtail'];

export default function App() {
  const {
    state,
    tick,
    setLighting,
    setHumidity,
    setTemperature,
    setTimeScale,
    toggleRunning,
    addEntity,
    reset,
  } = useEcosystem();

  // Drive the simulation tick
  useGameLoop(state.running, state.timeScale, tick);

  // Persist state to localStorage on every tick
  useEffect(() => {
    saveState(state);
  }, [state]);

  const totalLiving = state.entities.filter((e) => !e.decaying).length;

  return (
    <div className="app-layout">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <img src="/assets/svgs/favicon.svg" alt="Terrarium" width={28} height={28} />
            <span>Terrarium</span>
          </div>
          <div className="app-header-meta">
            <span className="header-stat">
              🦎 {totalLiving} organism{totalLiving !== 1 ? 's' : ''}
            </span>
            <span className="header-stat">
              O₂ {Math.round(state.environment.oxygen)}%
            </span>
            <span className="header-stat tick-display">Tick {state.tick}</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="app-body">
        {/* Terrarium canvas */}
        <main className="terrarium-main">
          <TerrariumView
            entities={state.entities}
            environment={state.environment}
          />
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <TimeControls
            running={state.running}
            timeScale={state.timeScale}
            tick={state.tick}
            onToggleRunning={toggleRunning}
            onSetTimeScale={setTimeScale}
            onReset={reset}
          />

          <EnvironmentControls
            environment={state.environment}
            onSetLighting={setLighting}
            onSetHumidity={setHumidity}
            onSetTemperature={setTemperature}
          />

          <div className="panel">
            <h3 className="panel-title">🦎 Organisms</h3>
            <div className="entity-cards-list">
              {ENTITY_TYPES.map((type) => (
                <EntityCard
                  key={type}
                  type={type}
                  entities={state.entities}
                  onAdd={addEntity}
                />
              ))}
            </div>
          </div>

          {/* Logs pinned at the bottom of the sidebar */}
          <LogPanel logs={state.logs} />
        </aside>
      </div>
    </div>
  );
}
