export type EntityType = 'moss' | 'fern' | 'isopod' | 'springtail';

export type TimeScale = 1 | 5 | 10;

export interface Entity {
  id: string;
  type: EntityType;
  health: number;       // 0–100
  age: number;          // ticks alive
  x: number;            // 0–100 (percentage position in terrarium)
  y: number;            // 0–100
  decaying: boolean;
  reproduced: boolean;  // flag to prevent double-reproduction in same tick
}

export interface LogEntry {
  id: string;
  message: string;
  timestamp: number;    // simulation tick
  category: 'birth' | 'death' | 'decay' | 'reproduce' | 'environment' | 'info';
}

export interface EnvironmentState {
  lighting: number;     // 0–100 (user-controlled)
  humidity: number;     // 0–100 (user-controlled)
  oxygen: number;       // 0–100 (simulation-driven)
  soil: number;         // 0–100 (simulation-driven)
  mold: number;         // 0–100 (simulation-driven, reduced by springtails)
  temperature: number;  // 0–100 (user-controlled)
}

export interface EcosystemState {
  environment: EnvironmentState;
  entities: Entity[];
  logs: LogEntry[];
  tick: number;
  running: boolean;
  timeScale: TimeScale;
}

export interface EntityConfig {
  type: EntityType;
  label: string;
  emoji: string;
  lightingMin: number;
  lightingMax: number;
  humidityMin: number;
  humidityMax: number;
  description: string;
  effect: string;
  color: string;
  bgColor: string;
  maxPopulation: number;
  baseReproductionRate: number; // probability per 100 ticks at full health
  healthDecayRate: number;      // HP lost per tick when out of range
  healthGrowthRate: number;     // HP gained per tick when in range
}
