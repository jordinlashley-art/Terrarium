// ─── Environment ──────────────────────────────────────────────────────────────

export interface Environment {
  /** Percentage 0–100: available light intensity */
  lighting: number;
  /** Percentage 0–100: relative air humidity */
  humidity: number;
  /** Celsius */
  temperature: number;
  /** Percentage 0–100: substrate moisture / available water */
  water: number;
  /** Percentage 0–100: oxygen level produced by plants */
  oxygen: number;
}

// ─── Plant ────────────────────────────────────────────────────────────────────

export type PlantSpecies = "fern" | "moss" | "succulent" | "tropical" | "algae";

export interface PlantRequirements {
  /** Minimum lighting level the plant can tolerate */
  lightingMin: number;
  /** Maximum lighting level the plant can tolerate */
  lightingMax: number;
  /** Minimum humidity the plant needs to survive */
  humidityMin: number;
  /** Maximum humidity the plant can tolerate before rotting */
  humidityMax: number;
  /** Units of water consumed from the substrate per tick */
  waterConsumptionPerTick: number;
}

export interface PlantOutputs {
  /** Units of oxygen added to the environment per tick when at full health */
  oxygenProductionPerTick: number;
  /** Biomass (food) units contributed to the ecosystem per tick when alive */
  biomassPerTick: number;
}

export interface Plant {
  id: string;
  name: string;
  species: PlantSpecies;
  /** 0–100; at 0 the plant dies */
  health: number;
  /** Multiplier applied to size increase per tick (higher = faster growing) */
  growthRate: number;
  /** Current physical size – purely cosmetic but affects biomass contribution */
  size: number;
  requirements: PlantRequirements;
  outputs: PlantOutputs;
  /** Ticks this plant has been alive */
  age: number;
  isAlive: boolean;
}

// ─── Organism ────────────────────────────────────────────────────────────────

export type OrganismSpecies =
  | "isopod"
  | "springtail"
  | "snail"
  | "gecko"
  | "millipede";

export interface OrganismRequirements {
  /** Biomass units the organism must consume per tick to remain healthy */
  foodConsumptionPerTick: number;
  /** Minimum humidity the organism needs */
  humidityMin: number;
  /** Maximum humidity the organism can tolerate */
  humidityMax: number;
  /** Minimum oxygen level needed */
  oxygenMin: number;
}

export interface Organism {
  id: string;
  name: string;
  species: OrganismSpecies;
  /** 0–100; at 0 the organism dies */
  health: number;
  /** Energy reserve 0–100; depletes when food is scarce */
  energy: number;
  /** Multiplier applied to size increase per tick */
  growthRate: number;
  /** Current size */
  size: number;
  requirements: OrganismRequirements;
  /** Waste/debris units produced per tick */
  wasteProductionPerTick: number;
  /** Ticks this organism has been alive */
  age: number;
  isAlive: boolean;
}

// ─── Ecosystem state ─────────────────────────────────────────────────────────

export interface EcosystemState {
  plants: Plant[];
  organisms: Organism[];
  environment: Environment;
  /**
   * Aggregate health of the ecosystem 0–100.
   * Derived from average entity health, penalised by mold levels.
   */
  ecosystemHealth: number;
  /** Total available biomass pool (accumulated plant output minus consumption) */
  biomassPool: number;
  /** Accumulated organic debris (organism waste + dead matter) */
  debris: number;
  /** Mold / fungus level 0–100; grows with high humidity, consumes plants */
  mold: number;
  /** Number of simulation ticks elapsed */
  tick: number;
  /** Log of notable ecosystem events */
  eventLog: EcosystemEvent[];
}

export interface EcosystemEvent {
  tick: number;
  message: string;
  severity: "info" | "warning" | "critical";
}

// ─── Hook return type ─────────────────────────────────────────────────────────

export interface UseEcosystemLogicReturn {
  state: EcosystemState;
  /** Advance the simulation by one tick */
  advanceTick: () => void;
  /** Toggle auto-ticking at the given interval (ms) */
  setAutoTick: (enabled: boolean, intervalMs?: number) => void;
  /** Add a plant to the ecosystem */
  addPlant: (plant: Omit<Plant, "id" | "age" | "isAlive">) => void;
  /** Add an organism to the ecosystem */
  addOrganism: (organism: Omit<Organism, "id" | "age" | "isAlive">) => void;
  /** Remove an entity by id */
  removeEntity: (id: string) => void;
  /** Update one or more environment variables */
  updateEnvironment: (patch: Partial<Environment>) => void;
  /** Convenience presets – spawns a species with sensible defaults */
  spawnPreset: (
    type: "plant" | "organism",
    species: PlantSpecies | OrganismSpecies
  ) => void;
  isAutoTicking: boolean;
}
