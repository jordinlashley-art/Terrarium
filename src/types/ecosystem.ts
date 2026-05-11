export type PlantSpecies =
  | "seagrass"
  | "kelp"
  | "coral"
  | "anemone"
  | "coralline_algae"
  | "hornwort";

export type OrganismSpecies =
  | "clownfish"
  | "angelfish"
  | "guppy"
  | "shrimp"
  | "crab"
  | "snail"
  | "axolotl";

export type AlgaeBloomSeverity = "none" | "mild" | "moderate" | "severe";

export interface Plant {
  id: string;
  species: PlantSpecies;
  name: string;
  health: number;
  energy: number;
  biomassProduced: number;
  age: number;
  isAlive: boolean;
  lightRequirement: number;
  nutrientRequirement: number;
  salinityTolerance: { min: number; max: number };
  isDelicate: boolean;
}

export interface Organism {
  id: string;
  species: OrganismSpecies;
  name: string;
  health: number;
  energy: number;
  wasteProduced: number;
  age: number;
  isAlive: boolean;
  foodConsumption: number;
}

export interface Environment {
  lighting: number;
  salinity: number;
  temperature: number;
  waterFlow: number;
  oxygenLevel: number;
  nutrients: number;
  ammonia: number;
  debris: number;
}

export interface AlgaeStatus {
  severity: AlgaeBloomSeverity;
  affectedEntities: string[];
}

export interface SimulationStats {
  totalTicks: number;
  totalPlantsSpawned: number;
  totalOrganismsSpawned: number;
  totalDeaths: number;
  algaeBloomEvents: number;
}

export interface EcosystemState {
  plants: Plant[];
  organisms: Organism[];
  environment: Environment;
  algae: AlgaeStatus;
  stats: SimulationStats;
  tick: number;
  isRunning: boolean;
  log: string[];
}

export interface PlantPreset {
  species: PlantSpecies;
  name: string;
  lightRequirement: number;
  nutrientRequirement: number;
  salinityTolerance: { min: number; max: number };
  isDelicate: boolean;
}

export interface OrganismPreset {
  species: OrganismSpecies;
  name: string;
  foodConsumption: number;
}

export const PLANT_PRESETS: Record<PlantSpecies, PlantPreset> = {
  seagrass: {
    species: "seagrass",
    name: "Seagrass",
    lightRequirement: 40,
    nutrientRequirement: 20,
    salinityTolerance: { min: 28, max: 40 },
    isDelicate: false,
  },
  kelp: {
    species: "kelp",
    name: "Giant Kelp",
    lightRequirement: 50,
    nutrientRequirement: 35,
    salinityTolerance: { min: 30, max: 38 },
    isDelicate: false,
  },
  coral: {
    species: "coral",
    name: "Staghorn Coral",
    lightRequirement: 65,
    nutrientRequirement: 18,
    salinityTolerance: { min: 33, max: 40 },
    isDelicate: true,
  },
  anemone: {
    species: "anemone",
    name: "Sea Anemone",
    lightRequirement: 60,
    nutrientRequirement: 25,
    salinityTolerance: { min: 32, max: 40 },
    isDelicate: true,
  },
  coralline_algae: {
    species: "coralline_algae",
    name: "Coralline Algae",
    lightRequirement: 55,
    nutrientRequirement: 12,
    salinityTolerance: { min: 33, max: 40 },
    isDelicate: true,
  },
  hornwort: {
    species: "hornwort",
    name: "Hornwort",
    lightRequirement: 30,
    nutrientRequirement: 28,
    salinityTolerance: { min: 0, max: 10 },
    isDelicate: false,
  },
};

export const ORGANISM_PRESETS: Record<OrganismSpecies, OrganismPreset> = {
  clownfish: {
    species: "clownfish",
    name: "Clownfish",
    foodConsumption: 8,
  },
  angelfish: {
    species: "angelfish",
    name: "Angelfish",
    foodConsumption: 12,
  },
  guppy: {
    species: "guppy",
    name: "Guppy",
    foodConsumption: 4,
  },
  shrimp: {
    species: "shrimp",
    name: "Cleaner Shrimp",
    foodConsumption: 5,
  },
  crab: {
    species: "crab",
    name: "Hermit Crab",
    foodConsumption: 10,
  },
  snail: {
    species: "snail",
    name: "Nerite Snail",
    foodConsumption: 6,
  },
  axolotl: {
    species: "axolotl",
    name: "Axolotl",
    foodConsumption: 9,
  },
};
