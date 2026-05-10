export type PlantSpecies = 'fern' | 'moss' | 'cactus' | 'orchid' | 'succulent';
export type OrganismSpecies = 'isopod' | 'springtail' | 'snail' | 'beetle';

export interface Plant {
  id: string;
  species: PlantSpecies;
  name: string;
  health: number;
  energy: number;
  biomassOutput: number;
  oxygenOutput: number;
  lightNeeded: number;
  waterNeeded: number;
  humidityRange: [number, number];
  tempRange: [number, number];
  age: number;
}

export interface Organism {
  id: string;
  species: OrganismSpecies;
  name: string;
  health: number;
  energy: number;
  biomassConsumed: number;
  wasteOutput: number;
  age: number;
}

export interface Environment {
  light: number;
  humidity: number;
  temperature: number;
  water: number;
  oxygen: number;
  biomass: number;
  debris: number;
  mold: number;
}

export interface EcosystemState {
  plants: Plant[];
  organisms: Organism[];
  environment: Environment;
  tick: number;
  log: string[];
}
