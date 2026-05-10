import { EcosystemState } from '../types/ecosystem';

const STORAGE_KEY = 'terrarium_state';

export function saveState(state: EcosystemState): void {
  try {
    const serialized = JSON.stringify({
      environment: state.environment,
      entities: state.entities,
      tick: state.tick,
      timeScale: state.timeScale,
      // Trim logs to last 50 entries to keep storage lean
      logs: state.logs.slice(-50),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // localStorage may be unavailable in some environments
  }
}

export function loadState(): Partial<EcosystemState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<EcosystemState>;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
