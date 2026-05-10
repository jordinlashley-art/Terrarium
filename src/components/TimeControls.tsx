import { TimeScale } from '../types/ecosystem';

interface Props {
  running: boolean;
  timeScale: TimeScale;
  tick: number;
  onToggleRunning: () => void;
  onSetTimeScale: (scale: TimeScale) => void;
  onReset: () => void;
}

const TIME_SCALES: TimeScale[] = [1, 5, 10];

export function TimeControls({
  running,
  timeScale,
  tick,
  onToggleRunning,
  onSetTimeScale,
  onReset,
}: Props) {
  return (
    <div className="panel">
      <h3 className="panel-title">
        <span>⏱ Time Control</span>
        <span className="tick-badge">Tick {tick}</span>
      </h3>

      <div className="time-controls-row">
        <button
          className={`btn-play ${running ? 'btn-pause' : 'btn-start'}`}
          onClick={onToggleRunning}
        >
          {running ? '⏸ Pause' : '▶ Run'}
        </button>

        <div className="time-scale-group">
          {TIME_SCALES.map((scale) => (
            <button
              key={scale}
              className={`btn-scale ${timeScale === scale ? 'btn-scale-active' : ''}`}
              onClick={() => onSetTimeScale(scale)}
              title={`${scale}× speed`}
            >
              {scale}×
            </button>
          ))}
        </div>

        <button className="btn-reset" onClick={onReset} title="Reset simulation">
          ↺
        </button>
      </div>

      {running && (
        <div className="running-indicator">
          <span className="pulse-dot" /> Simulation running at {timeScale}× speed
        </div>
      )}
    </div>
  );
}
