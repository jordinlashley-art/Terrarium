export type PlantSpecies =
  | "fern"
  | "moss"
  | "succulent"
  | "vine"
  | "mushroom"
  | "cactus";

export type OrganismSpecies =
  | "isopod"
  | "springtail"
  | "snail"
  | "worm"
  | "beetle"
  | "mite";

export type MoldSeverity = "none" | "mild" | "moderate" | "severe";

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
  waterRequirement: number;
  humidityTolerance: { min: number; max: number };
  isMoistureSensitive: boolean;
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
  biomassConsumption: number;
}

export interface Environment {
  lighting: number;
  humidity: number;
  temperature: number;
  waterLevel: number;
  oxygenLevel: number;
  biomass: number;
  debris: number;
  waste: number;
}

export interface MoldStatus {
  severity: MoldSeverity;
  affectedEntities: string[];
}

export interface SimulationStats {
  totalTicks: number;
  totalPlantsSpawned: number;
  totalOrganismsSpawned: number;
  totalDeaths: number;
  moldGrowthEvents: number;
}

export interface EcosystemState {
  plants: Plant[];
  organisms: Organism[];
  environment: Environment;
  mold: MoldStatus;
  stats: SimulationStats;
  tick: number;
  isRunning: boolean;
  log: string[];
}

export interface PlantPreset {
  species: PlantSpecies;
  name: string;
  lightRequirement: number;
  waterRequirement: number;
  humidityTolerance: { min: number; max: number };
  isMoistureSensitive: boolean;
}

export interface OrganismPreset {
  species: OrganismSpecies;
  name: string;
  biomassConsumption: number;
}

export const PLANT_PRESETS: Record<PlantSpecies, PlantPreset> = {
  fern: {
    species: "fern",
    name: "Fern",
    lightRequirement: 40,
    waterRequirement: 30,
    humidityTolerance: { min: 55, max: 95 },
    isMoistureSensitive: true,
  },
  moss: {
    species: "moss",
    name: "Moss",
    lightRequirement: 25,
    waterRequirement: 25,
    humidityTolerance: { min: 60, max: 100 },
    isMoistureSensitive: true,
  },
  succulent: {
    species: "succulent",
    name: "Succulent",
    lightRequirement: 70,
    waterRequirement: 10,
    humidityTolerance: { min: 10, max: 60 },
    isMoistureSensitive: false,
  },
  vine: {
    species: "vine",
    name: "Pothos Vine",
    lightRequirement: 35,
    waterRequirement: 20,
    humidityTolerance: { min: 40, max: 85 },
    isMoistureSensitive: false,
  },
  mushroom: {
    species: "mushroom",
    name: "Mushroom",
    lightRequirement: 10,
    waterRequirement: 35,
    humidityTolerance: { min: 70, max: 100 },
    isMoistureSensitive: false,
  },
  cactus: {
    species: "cactus",
    name: "Cactus",
    lightRequirement: 90,
    waterRequirement: 5,
    humidityTolerance: { min: 5, max: 40 },
    isMoistureSensitive: false,
  },
};

export const ORGANISM_PRESETS: Record<OrganismSpecies, OrganismPreset> = {
  isopod: {
    species: "isopod",
    name: "Isopod",
    biomassConsumption: 8,
  },
  springtail: {
    species: "springtail",
    name: "Springtail",
    biomassConsumption: 3,
  },
  snail: {
    species: "snail",
    name: "Snail",
    biomassConsumption: 12,
  },
  worm: {
    species: "worm",
    name: "Earthworm",
    biomassConsumption: 10,
  },
  beetle: {
    species: "beetle",
    name: "Beetle",
    biomassConsumption: 15,
  },
  mite: {
    species: "mite",
    name: "Soil Mite",
    biomassConsumption: 4,
  },
};
