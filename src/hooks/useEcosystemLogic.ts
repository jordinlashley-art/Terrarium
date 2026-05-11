"use client";

import { useCallback, useRef, useState } from "react";
import {
  EcosystemState,
  Environment,
  Organism,
  OrganismSpecies,
  Plant,
  PlantSpecies,
  ORGANISM_PRESETS,
  PLANT_PRESETS,
} from "@/types/ecosystem";

const INITIAL_ENVIRONMENT: Environment = {
  lighting: 65,
  salinity: 35,
  temperature: 25,
  waterFlow: 60,
  oxygenLevel: 70,
  nutrients: 25,
  ammonia: 0,
  debris: 5,
};

const INITIAL_STATE: EcosystemState = {
  plants: [],
  organisms: [],
  environment: INITIAL_ENVIRONMENT,
  algae: { severity: "none", affectedEntities: [] },
  stats: {
    totalTicks: 0,
    totalPlantsSpawned: 0,
    totalOrganismsSpawned: 0,
    totalDeaths: 0,
    algaeBloomEvents: 0,
  },
  tick: 0,
  isRunning: false,
  log: ["Aquarium initialized. Add plants and fish to begin."],
};

let idCounter = 0;
function genId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function calcAlgaeBloom(nutrients: number, ammonia: number) {
  const stress = nutrients * 0.5 + ammonia * 0.5;
  if (stress >= 75) return "severe" as const;
  if (stress >= 55) return "moderate" as const;
  if (stress >= 35) return "mild" as const;
  return "none" as const;
}

export function useEcosystemLogic() {
  const [state, setState] = useState<EcosystemState>(INITIAL_STATE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceTick = useCallback(() => {
    setState((prev) => {
      const env = { ...prev.environment };
      const logs: string[] = [];

      // --- Plants: consume Light + Nutrients → produce Oxygen + Biomass ---
      let totalOxygenProduced = 0;
      let totalBiomassProduced = 0;
      let plantDeaths = 0;

      const updatedPlants = prev.plants
        .filter((p) => p.isAlive)
        .map((plant): Plant => {
          const preset = PLANT_PRESETS[plant.species];
          let health = plant.health;
          let energy = plant.energy;
          let biomassProduced = plant.biomassProduced;

          const lightRatio = clamp(env.lighting / preset.lightRequirement, 0, 1.5);
          const nutrientRatio = clamp(env.nutrients / (preset.nutrientRequirement + 5), 0, 1.5);
          const inSalinityRange =
            env.salinity >= preset.salinityTolerance.min &&
            env.salinity <= preset.salinityTolerance.max;

          const photosynthesisRate = Math.min(lightRatio, nutrientRatio) * 10;

          if (photosynthesisRate > 0 && inSalinityRange) {
            energy = clamp(energy + photosynthesisRate, 0, 100);
            const biomassGain = photosynthesisRate * 0.5;
            biomassProduced += biomassGain;
            totalBiomassProduced += biomassGain;
            totalOxygenProduced += photosynthesisRate * 0.4;
          }

          // Consume nutrients each tick
          env.nutrients = clamp(env.nutrients - preset.nutrientRequirement * 0.04, 0, 100);

          // Salinity out of range damages plants
          if (!inSalinityRange) {
            const salinityDmg = preset.isDelicate ? 4 : 2;
            health = clamp(health - salinityDmg, 0, 100);
            if (Math.random() < 0.15) {
              logs.push(`${plant.name} stressed by incorrect salinity (${env.salinity.toFixed(1)} ppt).`);
            }
          }

          // Algae bloom damages delicate species
          if (env.nutrients > 60 && preset.isDelicate) {
            health = clamp(health - (env.nutrients - 60) * 0.08, 0, 100);
          }

          // High ammonia damages plants
          if (env.ammonia > 0.5) {
            health = clamp(health - env.ammonia * 0.3, 0, 100);
          }

          if (photosynthesisRate < 3) {
            energy = clamp(energy - 5, 0, 100);
            health = clamp(health - 2, 0, 100);
          } else {
            health = clamp(health + 1, 0, 100);
          }

          const isAlive = health > 0;
          if (!isAlive) {
            plantDeaths++;
            env.debris = clamp(env.debris + 12, 0, 100);
            logs.push(`${plant.name} has died.`);
          }

          return {
            ...plant,
            health,
            energy,
            biomassProduced,
            age: plant.age + 1,
            isAlive,
          };
        });

      // --- Organisms: consume Biomass → produce Ammonia ---
      let orgDeaths = 0;
      const updatedOrganisms = prev.organisms
        .filter((o) => o.isAlive)
        .map((org): Organism => {
          const preset = ORGANISM_PRESETS[org.species];
          let health = org.health;
          let energy = org.energy;
          let wasteProduced = org.wasteProduced;

          const availableFood = env.nutrients + env.debris;
          const consumed = Math.min(preset.foodConsumption, availableFood);
          const nutrientFrac = env.nutrients / Math.max(availableFood, 1);
          const nutrientConsumed = consumed * nutrientFrac;
          const debrisConsumed = consumed * (1 - nutrientFrac);

          env.nutrients = clamp(env.nutrients - nutrientConsumed, 0, 100);
          env.debris = clamp(env.debris - debrisConsumed, 0, 100);

          if (consumed > 0) {
            energy = clamp(energy + consumed * 0.6, 0, 100);
            const ammoniaGain = consumed * 0.35;
            wasteProduced += ammoniaGain;
            env.ammonia = clamp(env.ammonia + ammoniaGain, 0, 100);
          } else {
            energy = clamp(energy - 8, 0, 100);
            health = clamp(health - 5, 0, 100);
          }

          // Ammonia poisoning
          if (env.ammonia > 2) {
            health = clamp(health - env.ammonia * 0.4, 0, 100);
            if (env.ammonia > 5 && Math.random() < 0.1) {
              logs.push(`${org.name} struggling with high ammonia (${env.ammonia.toFixed(1)} ppm).`);
            }
          }

          // Oxygen depletion hurts fish
          if (env.oxygenLevel < 20) {
            health = clamp(health - 4, 0, 100);
            if (Math.random() < 0.1) {
              logs.push(`${org.name} gasping — low oxygen!`);
            }
          }

          if (energy < 10) {
            health = clamp(health - 5, 0, 100);
          } else {
            health = clamp(health + 0.5, 0, 100);
          }

          const isAlive = health > 0;
          if (!isAlive) {
            orgDeaths++;
            env.debris = clamp(env.debris + 8, 0, 100);
            logs.push(`${org.name} has died.`);
          }

          return {
            ...org,
            health,
            energy,
            wasteProduced,
            age: org.age + 1,
            isAlive,
          };
        });

      // --- Apply produced resources ---
      env.oxygenLevel = clamp(env.oxygenLevel + totalOxygenProduced * 0.15, 0, 100);
      env.nutrients = clamp(env.nutrients + totalBiomassProduced * 0.3, 0, 100);

      // Natural oxygen decay from respiration
      env.oxygenLevel = clamp(env.oxygenLevel - 0.6, 0, 100);

      // Water flow increases oxygenation
      env.oxygenLevel = clamp(env.oxygenLevel + env.waterFlow * 0.01, 0, 100);

      // Nitrification: beneficial bacteria break down ammonia (slowly)
      if (env.ammonia > 0) {
        const nitrified = env.ammonia * 0.08;
        env.ammonia = clamp(env.ammonia - nitrified, 0, 100);
        env.debris = clamp(env.debris + nitrified * 0.2, 0, 100);
      }

      // Debris sinks and decomposes into nutrients slowly
      if (env.debris > 5) {
        const decomposed = env.debris * 0.04;
        env.debris = clamp(env.debris - decomposed, 0, 100);
        env.nutrients = clamp(env.nutrients + decomposed * 0.4, 0, 100);
      }

      // --- Algae bloom calculation ---
      const algaeSeverity = calcAlgaeBloom(env.nutrients, env.ammonia);
      const prevAlgaeEvents = prev.stats.algaeBloomEvents;
      let newAlgaeEvents = prevAlgaeEvents;

      const affectedEntities: string[] = [];
      if (algaeSeverity !== "none") {
        const algaeDmgFactor =
          algaeSeverity === "severe" ? 5 : algaeSeverity === "moderate" ? 3 : 1;
        updatedPlants.forEach((p) => {
          if (p.isAlive && PLANT_PRESETS[p.species].isDelicate) {
            p.health = clamp(p.health - algaeDmgFactor * 0.6, 0, 100);
            affectedEntities.push(p.id);
          }
        });
        if (algaeSeverity !== prev.algae.severity) {
          newAlgaeEvents++;
          logs.push(`Algae bloom: ${algaeSeverity} (nutrients ${env.nutrients.toFixed(0)}, NH₃ ${env.ammonia.toFixed(1)}).`);
        }
      }

      const totalDeaths = prev.stats.totalDeaths + plantDeaths + orgDeaths;

      const newTick = prev.tick + 1;
      if (newTick % 10 === 0) {
        logs.push(
          `Tick ${newTick}: ${updatedPlants.filter((p) => p.isAlive).length} plants, ${updatedOrganisms.filter((o) => o.isAlive).length} animals alive.`
        );
      }

      const combinedLog = [...logs, ...prev.log].slice(0, 50);

      return {
        ...prev,
        plants: updatedPlants,
        organisms: updatedOrganisms,
        environment: env,
        algae: { severity: algaeSeverity, affectedEntities },
        tick: newTick,
        stats: {
          ...prev.stats,
          totalTicks: prev.stats.totalTicks + 1,
          totalDeaths,
          algaeBloomEvents: newAlgaeEvents,
        },
        log: combinedLog,
      };
    });
  }, []);

  const addPlant = useCallback((species: PlantSpecies) => {
    const preset = PLANT_PRESETS[species];
    const plant: Plant = {
      id: genId("plant"),
      species,
      name: `${preset.name} #${idCounter}`,
      health: 100,
      energy: 60,
      biomassProduced: 0,
      age: 0,
      isAlive: true,
      lightRequirement: preset.lightRequirement,
      nutrientRequirement: preset.nutrientRequirement,
      salinityTolerance: preset.salinityTolerance,
      isDelicate: preset.isDelicate,
    };

    setState((prev) => ({
      ...prev,
      plants: [...prev.plants, plant],
      stats: {
        ...prev.stats,
        totalPlantsSpawned: prev.stats.totalPlantsSpawned + 1,
      },
      log: [`Added ${plant.name} to aquarium.`, ...prev.log].slice(0, 50),
    }));
  }, []);

  const addOrganism = useCallback((species: OrganismSpecies) => {
    const preset = ORGANISM_PRESETS[species];
    const organism: Organism = {
      id: genId("org"),
      species,
      name: `${preset.name} #${idCounter}`,
      health: 100,
      energy: 60,
      wasteProduced: 0,
      age: 0,
      isAlive: true,
      foodConsumption: preset.foodConsumption,
    };

    setState((prev) => ({
      ...prev,
      organisms: [...prev.organisms, organism],
      stats: {
        ...prev.stats,
        totalOrganismsSpawned: prev.stats.totalOrganismsSpawned + 1,
      },
      log: [`Added ${organism.name} to aquarium.`, ...prev.log].slice(0, 50),
    }));
  }, []);

  const updateEnvironment = useCallback((updates: Partial<Environment>) => {
    setState((prev) => ({
      ...prev,
      environment: { ...prev.environment, ...updates },
    }));
  }, []);

  const spawnPreset = useCallback(
    (presetName: "tropical_reef" | "freshwater" | "cold_water" | "mini_reef") => {
      setState((prev) => {
        const envUpdates: Partial<Environment> = {};
        const newPlants: Plant[] = [];
        const newOrganisms: Organism[] = [];
        const logs: string[] = [];

        if (presetName === "tropical_reef") {
          envUpdates.salinity = 35;
          envUpdates.lighting = 70;
          envUpdates.temperature = 26;
          envUpdates.waterFlow = 70;
          ["coral", "anemone", "seagrass"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, biomassProduced: 0, age: 0, isAlive: true,
              lightRequirement: preset.lightRequirement,
              nutrientRequirement: preset.nutrientRequirement,
              salinityTolerance: preset.salinityTolerance,
              isDelicate: preset.isDelicate,
            });
          });
          ["clownfish", "angelfish"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, wasteProduced: 0, age: 0, isAlive: true,
              foodConsumption: preset.foodConsumption,
            });
          });
          logs.push("Tropical reef preset: coral, anemone, seagrass + clownfish, angelfish.");
        } else if (presetName === "freshwater") {
          envUpdates.salinity = 3;
          envUpdates.lighting = 55;
          envUpdates.temperature = 24;
          envUpdates.waterFlow = 55;
          ["hornwort", "seagrass"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, biomassProduced: 0, age: 0, isAlive: true,
              lightRequirement: preset.lightRequirement,
              nutrientRequirement: preset.nutrientRequirement,
              salinityTolerance: preset.salinityTolerance,
              isDelicate: preset.isDelicate,
            });
          });
          ["guppy", "shrimp"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, wasteProduced: 0, age: 0, isAlive: true,
              foodConsumption: preset.foodConsumption,
            });
          });
          logs.push("Freshwater preset: hornwort, seagrass + guppies, shrimp.");
        } else if (presetName === "cold_water") {
          envUpdates.salinity = 32;
          envUpdates.lighting = 45;
          envUpdates.temperature = 14;
          envUpdates.waterFlow = 80;
          ["kelp", "coralline_algae"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, biomassProduced: 0, age: 0, isAlive: true,
              lightRequirement: preset.lightRequirement,
              nutrientRequirement: preset.nutrientRequirement,
              salinityTolerance: preset.salinityTolerance,
              isDelicate: preset.isDelicate,
            });
          });
          ["crab", "snail"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, wasteProduced: 0, age: 0, isAlive: true,
              foodConsumption: preset.foodConsumption,
            });
          });
          logs.push("Cold water preset: kelp, coralline algae + hermit crabs, snails.");
        } else if (presetName === "mini_reef") {
          envUpdates.salinity = 36;
          envUpdates.lighting = 75;
          envUpdates.temperature = 25;
          envUpdates.waterFlow = 65;
          ["coral", "coralline_algae", "anemone"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, biomassProduced: 0, age: 0, isAlive: true,
              lightRequirement: preset.lightRequirement,
              nutrientRequirement: preset.nutrientRequirement,
              salinityTolerance: preset.salinityTolerance,
              isDelicate: preset.isDelicate,
            });
          });
          ["clownfish", "shrimp"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100, energy: 70, wasteProduced: 0, age: 0, isAlive: true,
              foodConsumption: preset.foodConsumption,
            });
          });
          logs.push("Mini reef preset: coral, coralline algae, anemone + clownfish, shrimp.");
        }

        return {
          ...prev,
          plants: [...prev.plants, ...newPlants],
          organisms: [...prev.organisms, ...newOrganisms],
          environment: { ...prev.environment, ...envUpdates },
          stats: {
            ...prev.stats,
            totalPlantsSpawned: prev.stats.totalPlantsSpawned + newPlants.length,
            totalOrganismsSpawned: prev.stats.totalOrganismsSpawned + newOrganisms.length,
          },
          log: [...logs, ...prev.log].slice(0, 50),
        };
      });
    },
    []
  );

  const toggleRunning = useCallback(() => {
    setState((prev) => {
      const nextRunning = !prev.isRunning;
      if (nextRunning) {
        intervalRef.current = setInterval(() => {
          advanceTick();
        }, 800);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return { ...prev, isRunning: nextRunning };
    });
  }, [advanceTick]);

  const resetEcosystem = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    idCounter = 0;
    setState({ ...INITIAL_STATE, log: ["Aquarium reset."] });
  }, []);

  return {
    state,
    advanceTick,
    addPlant,
    addOrganism,
    updateEnvironment,
    spawnPreset,
    toggleRunning,
    resetEcosystem,
  };
}
