'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  EcosystemState,
  Environment,
  Plant,
  PlantSpecies,
  Organism,
  OrganismSpecies,
} from '../types/ecosystem';

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const PLANT_TEMPLATES: Record<PlantSpecies, Omit<Plant, 'id' | 'age'>> = {
  fern: {
    species: 'fern',
    name: 'Fern',
    health: 100,
    energy: 80,
    biomassOutput: 3,
    oxygenOutput: 2,
    lightNeeded: 40,
    waterNeeded: 3,
    humidityRange: [65, 90],
    tempRange: [15, 25],
  },
  moss: {
    species: 'moss',
    name: 'Moss',
    health: 100,
    energy: 80,
    biomassOutput: 1,
    oxygenOutput: 1,
    lightNeeded: 20,
    waterNeeded: 2,
    humidityRange: [70, 100],
    tempRange: [10, 20],
  },
  cactus: {
    species: 'cactus',
    name: 'Cactus',
    health: 100,
    energy: 80,
    biomassOutput: 2,
    oxygenOutput: 1,
    lightNeeded: 80,
    waterNeeded: 0.5,
    humidityRange: [10, 40],
    tempRange: [20, 40],
  },
  orchid: {
    species: 'orchid',
    name: 'Orchid',
    health: 100,
    energy: 80,
    biomassOutput: 2,
    oxygenOutput: 3,
    lightNeeded: 60,
    waterNeeded: 2,
    humidityRange: [50, 80],
    tempRange: [18, 28],
  },
  succulent: {
    species: 'succulent',
    name: 'Succulent',
    health: 100,
    energy: 80,
    biomassOutput: 1,
    oxygenOutput: 1,
    lightNeeded: 70,
    waterNeeded: 0.5,
    humidityRange: [20, 50],
    tempRange: [15, 30],
  },
};

const ORGANISM_TEMPLATES: Record<OrganismSpecies, Omit<Organism, 'id' | 'age'>> = {
  isopod: {
    species: 'isopod',
    name: 'Isopod',
    health: 100,
    energy: 80,
    biomassConsumed: 2,
    wasteOutput: 0.5,
  },
  springtail: {
    species: 'springtail',
    name: 'Springtail',
    health: 100,
    energy: 80,
    biomassConsumed: 1,
    wasteOutput: 0.3,
  },
  snail: {
    species: 'snail',
    name: 'Snail',
    health: 100,
    energy: 80,
    biomassConsumed: 3,
    wasteOutput: 1,
  },
  beetle: {
    species: 'beetle',
    name: 'Beetle',
    health: 100,
    energy: 80,
    biomassConsumed: 2,
    wasteOutput: 0.5,
  },
};

const DEFAULT_ENV: Environment = {
  light: 60,
  humidity: 70,
  temperature: 22,
  water: 80,
  oxygen: 50,
  biomass: 30,
  debris: 10,
  mold: 0,
};

const INITIAL_STATE: EcosystemState = {
  plants: [],
  organisms: [],
  environment: { ...DEFAULT_ENV },
  tick: 0,
  log: ['Terrarium initialized. Add plants and organisms to begin.'],
};

let idCounter = 0;
const newId = () => `entity-${++idCounter}`;

function simulateTick(state: EcosystemState): EcosystemState {
  const env = state.environment;
  const logs: string[] = [];

  const updatedPlants = state.plants.map((plant) => {
    const lightOk = Math.abs(env.light - plant.lightNeeded) < 30;
    const humidOk =
      env.humidity >= plant.humidityRange[0] &&
      env.humidity <= plant.humidityRange[1];
    const tempOk =
      env.temperature >= plant.tempRange[0] &&
      env.temperature <= plant.tempRange[1];
    const waterOk = env.water >= plant.waterNeeded * 5;

    const conditionScore = [lightOk, humidOk, tempOk, waterOk].filter(Boolean).length;
    const healthDelta =
      conditionScore >= 3 ? 2 : conditionScore === 2 ? 0 : conditionScore === 1 ? -3 : -6;
    const moldDmg = env.mold > 60 ? -3 : env.mold > 30 ? -1 : 0;

    return {
      ...plant,
      health: clamp(plant.health + healthDelta + moldDmg, 0, 100),
      energy: clamp(plant.energy + (conditionScore >= 3 ? 2 : -1), 0, 100),
      age: plant.age + 1,
    };
  });

  const updatedOrganisms = state.organisms.map((org) => {
    const foodAvailable = env.biomass + env.debris >= org.biomassConsumed;
    const healthDelta = foodAvailable ? 1 : -4;
    return {
      ...org,
      health: clamp(org.health + healthDelta, 0, 100),
      energy: clamp(org.energy + (foodAvailable ? 1 : -2), 0, 100),
      age: org.age + 1,
    };
  });

  const alivePlants = updatedPlants.filter((p) => p.health > 0);
  const aliveOrgs = updatedOrganisms.filter((o) => o.health > 0);
  const deadPlants = updatedPlants.filter((p) => p.health <= 0);
  const deadOrgs = updatedOrganisms.filter((o) => o.health <= 0);

  if (deadPlants.length > 0)
    logs.push(`Tick ${state.tick}: ${deadPlants.map((p) => p.name).join(', ')} died.`);
  if (deadOrgs.length > 0)
    logs.push(`Tick ${state.tick}: ${deadOrgs.map((o) => o.name).join(', ')} died.`);

  const oxygenProduced = alivePlants.reduce((s, p) => {
    const lightOk = Math.abs(env.light - p.lightNeeded) < 30;
    return s + (lightOk && p.health > 20 ? p.oxygenOutput : 0);
  }, 0);

  const biomassProduced = alivePlants.reduce(
    (s, p) => s + (p.health > 20 ? p.biomassOutput * 0.5 : 0),
    0
  );
  const waterConsumed = alivePlants.reduce(
    (s, p) => s + (p.health > 20 ? p.waterNeeded * 0.1 : 0),
    0
  );
  const biomassConsumed = aliveOrgs.reduce(
    (s, o) => s + (o.health > 20 ? o.biomassConsumed * 0.5 : 0),
    0
  );
  const wasteProduced = aliveOrgs.reduce(
    (s, o) => s + (o.health > 20 ? o.wasteOutput : 0),
    0
  );
  const debrisAdded = deadPlants.length * 5 + deadOrgs.length * 3;

  const moldDelta = env.humidity > 65 ? (env.humidity - 65) * 0.05 : -1;

  const newEnv: Environment = {
    light: env.light,
    humidity: clamp(env.humidity - waterConsumed * 0.2 + wasteProduced * 0.1, 0, 100),
    temperature: env.temperature,
    water: clamp(env.water - waterConsumed, 0, 100),
    oxygen: clamp(env.oxygen + oxygenProduced * 0.5 - 0.5, 0, 100),
    biomass: clamp(
      env.biomass + biomassProduced - biomassConsumed + debrisAdded * 0.3,
      0,
      300
    ),
    debris: clamp(
      env.debris + debrisAdded - biomassConsumed * 0.2 + wasteProduced * 0.5,
      0,
      300
    ),
    mold: clamp(env.mold + moldDelta, 0, 100),
  };

  if (newEnv.mold > 70 && env.mold <= 70)
    logs.push(`Tick ${state.tick}: Mold outbreak! Reduce humidity.`);
  if (newEnv.water < 15 && env.water >= 15)
    logs.push(`Tick ${state.tick}: Water running low!`);
  if (newEnv.oxygen > 80 && state.tick % 10 === 0)
    logs.push(`Tick ${state.tick}: Oxygen levels optimal.`);

  return {
    plants: alivePlants,
    organisms: aliveOrgs,
    environment: newEnv,
    tick: state.tick + 1,
    log: [...logs, ...state.log].slice(0, 30),
  };
}

export function useEcosystemLogic() {
  const [state, setState] = useState<EcosystemState>(INITIAL_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceTick = useCallback(() => {
    setState((prev) => simulateTick(prev));
  }, []);

  const addPlant = useCallback((species: PlantSpecies) => {
    const template = PLANT_TEMPLATES[species];
    const plant: Plant = { ...template, id: newId(), age: 0 };
    setState((prev) => ({
      ...prev,
      plants: [...prev.plants, plant],
      log: [`Added ${plant.name} to the terrarium.`, ...prev.log].slice(0, 30),
    }));
  }, []);

  const addOrganism = useCallback((species: OrganismSpecies) => {
    const template = ORGANISM_TEMPLATES[species];
    const org: Organism = { ...template, id: newId(), age: 0 };
    setState((prev) => ({
      ...prev,
      organisms: [...prev.organisms, org],
      log: [`Added ${org.name} to the terrarium.`, ...prev.log].slice(0, 30),
    }));
  }, []);

  const updateEnvironment = useCallback(
    (key: keyof Environment, value: number) => {
      setState((prev) => ({
        ...prev,
        environment: { ...prev.environment, [key]: value },
      }));
    },
    []
  );

  const spawnPreset = useCallback((name: string) => {
    if (name === 'tropical') {
      setState((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          humidity: 80,
          temperature: 24,
          light: 65,
          water: 90,
        },
        log: ['Preset: Tropical setup loaded.', ...prev.log].slice(0, 30),
      }));
      setTimeout(() => {
        const fern: Plant = { ...PLANT_TEMPLATES.fern, id: newId(), age: 0 };
        const orchid: Plant = { ...PLANT_TEMPLATES.orchid, id: newId(), age: 0 };
        const isopod: Organism = { ...ORGANISM_TEMPLATES.isopod, id: newId(), age: 0 };
        setState((prev) => ({
          ...prev,
          plants: [...prev.plants, fern, orchid],
          organisms: [...prev.organisms, isopod],
        }));
      }, 0);
    } else if (name === 'desert') {
      setState((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          humidity: 20,
          temperature: 30,
          light: 85,
          water: 30,
        },
        log: ['Preset: Desert setup loaded.', ...prev.log].slice(0, 30),
      }));
      setTimeout(() => {
        const cactus: Plant = { ...PLANT_TEMPLATES.cactus, id: newId(), age: 0 };
        const succulent: Plant = { ...PLANT_TEMPLATES.succulent, id: newId(), age: 0 };
        setState((prev) => ({
          ...prev,
          plants: [...prev.plants, cactus, succulent],
        }));
      }, 0);
    } else if (name === 'forest') {
      setState((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          humidity: 75,
          temperature: 18,
          light: 35,
          water: 85,
        },
        log: ['Preset: Forest Floor setup loaded.', ...prev.log].slice(0, 30),
      }));
      setTimeout(() => {
        const moss: Plant = { ...PLANT_TEMPLATES.moss, id: newId(), age: 0 };
        const fern: Plant = { ...PLANT_TEMPLATES.fern, id: newId(), age: 0 };
        const springtail: Organism = {
          ...ORGANISM_TEMPLATES.springtail,
          id: newId(),
          age: 0,
        };
        const isopod: Organism = { ...ORGANISM_TEMPLATES.isopod, id: newId(), age: 0 };
        setState((prev) => ({
          ...prev,
          plants: [...prev.plants, moss, fern],
          organisms: [...prev.organisms, springtail, isopod],
        }));
      }, 0);
    }
  }, []);

  const toggleRunning = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetEcosystem = useCallback(() => {
    setIsRunning(false);
    setState({ ...INITIAL_STATE, log: ['Terrarium reset.'] });
  }, []);

  useEffect(() => {
    if (isRunning) {
      tickRef.current = setInterval(() => {
        setState((prev) => simulateTick(prev));
      }, speed);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, speed]);

  return {
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
  };
}
