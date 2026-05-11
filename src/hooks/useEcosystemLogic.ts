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
  lighting: 60,
  humidity: 55,
  temperature: 22,
  waterLevel: 70,
  oxygenLevel: 50,
  biomass: 30,
  debris: 10,
  waste: 0,
};

const INITIAL_STATE: EcosystemState = {
  plants: [],
  organisms: [],
  environment: INITIAL_ENVIRONMENT,
  mold: { severity: "none", affectedEntities: [] },
  stats: {
    totalTicks: 0,
    totalPlantsSpawned: 0,
    totalOrganismsSpawned: 0,
    totalDeaths: 0,
    moldGrowthEvents: 0,
  },
  tick: 0,
  isRunning: false,
  log: ["Terrarium initialized. Add plants and organisms to begin."],
};

let idCounter = 0;
function genId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function calcMoldSeverity(humidity: number) {
  if (humidity >= 90) return "severe" as const;
  if (humidity >= 80) return "moderate" as const;
  if (humidity >= 65) return "mild" as const;
  return "none" as const;
}

export function useEcosystemLogic() {
  const [state, setState] = useState<EcosystemState>(INITIAL_STATE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceTick = useCallback(() => {
    setState((prev) => {
      const env = { ...prev.environment };
      const logs: string[] = [];

      // --- Plants: consume Light + Water → produce Oxygen + Biomass ---
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
          const waterRatio = clamp(env.waterLevel / (preset.waterRequirement + 10), 0, 1.5);
          const inHumidityRange =
            env.humidity >= preset.humidityTolerance.min &&
            env.humidity <= preset.humidityTolerance.max;

          const photosynthesisRate = Math.min(lightRatio, waterRatio) * 10;

          if (photosynthesisRate > 0) {
            energy = clamp(energy + photosynthesisRate, 0, 100);
            const biomassGain = photosynthesisRate * 0.5;
            biomassProduced += biomassGain;
            totalBiomassProduced += biomassGain;
            totalOxygenProduced += photosynthesisRate * 0.3;
          }

          // Consume water each tick
          env.waterLevel = clamp(
            env.waterLevel - preset.waterRequirement * 0.05,
            0,
            100
          );

          // Humidity damage for moisture-sensitive species (ferns)
          if (preset.isMoistureSensitive && env.humidity < preset.humidityTolerance.min) {
            const dmg = (preset.humidityTolerance.min - env.humidity) * 0.3;
            health = clamp(health - dmg, 0, 100);
            logs.push(`${plant.name} suffering from low humidity (${env.humidity.toFixed(0)}%).`);
          }

          // Out-of-range humidity hurts non-moisture plants too (reversed range)
          if (!inHumidityRange && !preset.isMoistureSensitive) {
            health = clamp(health - 2, 0, 100);
          }

          // Mold damage at high humidity
          if (env.humidity >= 65) {
            const moldDmg = (env.humidity - 65) * 0.1;
            health = clamp(health - moldDmg, 0, 100);
          }

          // Energy drain without sufficient light or water
          if (photosynthesisRate < 3) {
            energy = clamp(energy - 5, 0, 100);
            health = clamp(health - 2, 0, 100);
          } else {
            health = clamp(health + 1, 0, 100);
          }

          const isAlive = health > 0;
          if (!isAlive) {
            plantDeaths++;
            env.debris = clamp(env.debris + 15, 0, 100);
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

      // --- Organisms: consume Biomass/Debris → produce Waste ---
      let orgDeaths = 0;
      const updatedOrganisms = prev.organisms
        .filter((o) => o.isAlive)
        .map((org): Organism => {
          const preset = ORGANISM_PRESETS[org.species];
          let health = org.health;
          let energy = org.energy;
          let wasteProduced = org.wasteProduced;

          const availableFood = env.biomass + env.debris;
          const consumed = Math.min(preset.biomassConsumption, availableFood);
          const biomassFraction = env.biomass / Math.max(availableFood, 1);
          const bioConsumed = consumed * biomassFraction;
          const debrisConsumed = consumed * (1 - biomassFraction);

          env.biomass = clamp(env.biomass - bioConsumed, 0, 200);
          env.debris = clamp(env.debris - debrisConsumed, 0, 100);

          if (consumed > 0) {
            energy = clamp(energy + consumed * 0.6, 0, 100);
            const wasteGain = consumed * 0.4;
            wasteProduced += wasteGain;
            env.waste = clamp(env.waste + wasteGain, 0, 100);
          } else {
            energy = clamp(energy - 8, 0, 100);
            health = clamp(health - 5, 0, 100);
          }

          // High waste damages organisms
          if (env.waste > 70) {
            health = clamp(health - 3, 0, 100);
          }

          // Low energy kills
          if (energy < 10) {
            health = clamp(health - 5, 0, 100);
          } else {
            health = clamp(health + 0.5, 0, 100);
          }

          const isAlive = health > 0;
          if (!isAlive) {
            orgDeaths++;
            env.debris = clamp(env.debris + 10, 0, 100);
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

      // --- Apply produced resources to environment ---
      env.oxygenLevel = clamp(env.oxygenLevel + totalOxygenProduced * 0.1, 0, 100);
      env.biomass = clamp(env.biomass + totalBiomassProduced, 0, 200);

      // Natural oxygen decay
      env.oxygenLevel = clamp(env.oxygenLevel - 0.5, 0, 100);

      // Slow water evaporation increases humidity
      env.humidity = clamp(
        env.humidity + (env.waterLevel > 50 ? 0.2 : -0.3),
        0,
        100
      );

      // Waste slowly breaks down into debris
      if (env.waste > 10) {
        const decomposed = env.waste * 0.05;
        env.waste = clamp(env.waste - decomposed, 0, 100);
        env.debris = clamp(env.debris + decomposed * 0.5, 0, 100);
      }

      // --- Mold calculation ---
      const moldSeverity = calcMoldSeverity(env.humidity);
      const moldEvents = prev.stats.moldGrowthEvents;
      let newMoldGrowthEvents = moldEvents;

      const affectedEntities: string[] = [];
      if (moldSeverity !== "none") {
        const moldDmgFactor =
          moldSeverity === "severe" ? 5 : moldSeverity === "moderate" ? 3 : 1;
        updatedPlants.forEach((p) => {
          if (p.isAlive) {
            p.health = clamp(p.health - moldDmgFactor * 0.5, 0, 100);
            affectedEntities.push(p.id);
          }
        });
        if (moldSeverity !== prev.mold.severity) {
          newMoldGrowthEvents++;
          logs.push(
            `Mold growth: ${moldSeverity} (humidity ${env.humidity.toFixed(0)}%).`
          );
        }
      }

      const totalDeaths =
        prev.stats.totalDeaths + plantDeaths + orgDeaths;

      const newTick = prev.tick + 1;
      if (newTick % 10 === 0) {
        logs.push(`Tick ${newTick}: ${updatedPlants.filter((p) => p.isAlive).length} plants, ${updatedOrganisms.filter((o) => o.isAlive).length} organisms.`);
      }

      const combinedLog = [
        ...logs,
        ...prev.log,
      ].slice(0, 50);

      return {
        ...prev,
        plants: updatedPlants,
        organisms: updatedOrganisms,
        environment: env,
        mold: { severity: moldSeverity, affectedEntities },
        tick: newTick,
        stats: {
          ...prev.stats,
          totalTicks: prev.stats.totalTicks + 1,
          totalDeaths,
          moldGrowthEvents: newMoldGrowthEvents,
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
      waterRequirement: preset.waterRequirement,
      humidityTolerance: preset.humidityTolerance,
      isMoistureSensitive: preset.isMoistureSensitive,
    };

    setState((prev) => ({
      ...prev,
      plants: [...prev.plants, plant],
      stats: {
        ...prev.stats,
        totalPlantsSpawned: prev.stats.totalPlantsSpawned + 1,
      },
      log: [`Added ${plant.name} to terrarium.`, ...prev.log].slice(0, 50),
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
      biomassConsumption: preset.biomassConsumption,
    };

    setState((prev) => ({
      ...prev,
      organisms: [...prev.organisms, organism],
      stats: {
        ...prev.stats,
        totalOrganismsSpawned: prev.stats.totalOrganismsSpawned + 1,
      },
      log: [`Added ${organism.name} to terrarium.`, ...prev.log].slice(0, 50),
    }));
  }, []);

  const updateEnvironment = useCallback((updates: Partial<Environment>) => {
    setState((prev) => ({
      ...prev,
      environment: { ...prev.environment, ...updates },
    }));
  }, []);

  const spawnPreset = useCallback(
    (presetName: "tropical" | "desert" | "temperate" | "decomposer") => {
      setState((prev) => {
        const envUpdates: Partial<Environment> = {};
        const newPlants: Plant[] = [];
        const newOrganisms: Organism[] = [];
        const logs: string[] = [];

        if (presetName === "tropical") {
          envUpdates.humidity = 75;
          envUpdates.lighting = 65;
          envUpdates.temperature = 26;
          envUpdates.waterLevel = 80;
          ["fern", "moss", "vine"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              biomassProduced: 0,
              age: 0,
              isAlive: true,
              lightRequirement: preset.lightRequirement,
              waterRequirement: preset.waterRequirement,
              humidityTolerance: preset.humidityTolerance,
              isMoistureSensitive: preset.isMoistureSensitive,
            });
          });
          ["isopod", "springtail"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              wasteProduced: 0,
              age: 0,
              isAlive: true,
              biomassConsumption: preset.biomassConsumption,
            });
          });
          logs.push("Tropical preset spawned: fern, moss, vine + isopods, springtails.");
        } else if (presetName === "desert") {
          envUpdates.humidity = 20;
          envUpdates.lighting = 90;
          envUpdates.temperature = 32;
          envUpdates.waterLevel = 20;
          ["succulent", "cactus"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              biomassProduced: 0,
              age: 0,
              isAlive: true,
              lightRequirement: preset.lightRequirement,
              waterRequirement: preset.waterRequirement,
              humidityTolerance: preset.humidityTolerance,
              isMoistureSensitive: preset.isMoistureSensitive,
            });
          });
          ["mite", "beetle"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              wasteProduced: 0,
              age: 0,
              isAlive: true,
              biomassConsumption: preset.biomassConsumption,
            });
          });
          logs.push("Desert preset spawned: succulent, cactus + mites, beetles.");
        } else if (presetName === "temperate") {
          envUpdates.humidity = 55;
          envUpdates.lighting = 55;
          envUpdates.temperature = 18;
          envUpdates.waterLevel = 55;
          ["vine", "fern"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              biomassProduced: 0,
              age: 0,
              isAlive: true,
              lightRequirement: preset.lightRequirement,
              waterRequirement: preset.waterRequirement,
              humidityTolerance: preset.humidityTolerance,
              isMoistureSensitive: preset.isMoistureSensitive,
            });
          });
          ["worm", "snail"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              wasteProduced: 0,
              age: 0,
              isAlive: true,
              biomassConsumption: preset.biomassConsumption,
            });
          });
          logs.push("Temperate preset spawned: vine, fern + worms, snails.");
        } else if (presetName === "decomposer") {
          envUpdates.humidity = 80;
          envUpdates.lighting = 15;
          envUpdates.temperature = 20;
          envUpdates.waterLevel = 70;
          ["mushroom", "moss"].forEach((sp) => {
            const preset = PLANT_PRESETS[sp as PlantSpecies];
            newPlants.push({
              id: genId("plant"),
              species: sp as PlantSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              biomassProduced: 0,
              age: 0,
              isAlive: true,
              lightRequirement: preset.lightRequirement,
              waterRequirement: preset.waterRequirement,
              humidityTolerance: preset.humidityTolerance,
              isMoistureSensitive: preset.isMoistureSensitive,
            });
          });
          ["isopod", "springtail", "worm"].forEach((sp) => {
            const preset = ORGANISM_PRESETS[sp as OrganismSpecies];
            newOrganisms.push({
              id: genId("org"),
              species: sp as OrganismSpecies,
              name: `${preset.name} #${idCounter}`,
              health: 100,
              energy: 70,
              wasteProduced: 0,
              age: 0,
              isAlive: true,
              biomassConsumption: preset.biomassConsumption,
            });
          });
          logs.push("Decomposer preset spawned: mushroom, moss + isopods, springtails, worms.");
        }

        return {
          ...prev,
          plants: [...prev.plants, ...newPlants],
          organisms: [...prev.organisms, ...newOrganisms],
          environment: { ...prev.environment, ...envUpdates },
          stats: {
            ...prev.stats,
            totalPlantsSpawned: prev.stats.totalPlantsSpawned + newPlants.length,
            totalOrganismsSpawned:
              prev.stats.totalOrganismsSpawned + newOrganisms.length,
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
    setState({ ...INITIAL_STATE, log: ["Terrarium reset."] });
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
