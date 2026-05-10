import { useEffect, useRef } from 'react';
import { LogEntry } from '../types/ecosystem';

interface Props {
  logs: LogEntry[];
}

const CATEGORY_STYLES: Record<LogEntry['category'], { icon: string; color: string }> = {
  birth:       { icon: '🌱', color: '#4ade80' },
  death:       { icon: '💀', color: '#f87171' },
  decay:       { icon: '🍂', color: '#a8a29e' },
  reproduce:   { icon: '✨', color: '#a78bfa' },
  environment: { icon: '⚠️', color: '#fbbf24' },
  info:        { icon: 'ℹ️', color: '#60a5fa' },
};

function formatTick(tick: number): string {
  const mins = Math.floor(tick / 60);
  const secs = tick % 60;
  if (mins > 0) return `T${tick} (${mins}m${secs}s)`;
  return `T${tick}`;
}

export function LogPanel({ logs }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive, unless the user has scrolled up
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="panel log-panel">
      <h3 className="panel-title">
        <span>📋 Event Log</span>
        <span className="log-count">{logs.length} events</span>
      </h3>
      <div className="log-entries" ref={containerRef}>
        {logs.length === 0 ? (
          <div className="log-empty">No events yet. Start the simulation!</div>
        ) : (
          logs
            .slice()
            .reverse()
            .map((entry) => {
              const style = CATEGORY_STYLES[entry.category];
              return (
                <div key={entry.id} className="log-entry">
                  <span className="log-icon">{style.icon}</span>
                  <div className="log-content">
                    <span className="log-message" style={{ color: style.color }}>
                      {entry.message}
                    </span>
                    <span className="log-tick">{formatTick(entry.timestamp)}</span>
                  </div>
                </div>
              );
            })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
