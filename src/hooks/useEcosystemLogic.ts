"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type EcosystemEvent,
  type EcosystemState,
  type Environment,
  type Organism,
  type OrganismSpecies,
  type Plant,
  type PlantSpecies,
  type UseEcosystemLogicReturn,
} from "@/types/ecosystem";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEALTH_DAMAGE_PER_TICK = 8;
const HEALTH_RECOVERY_PER_TICK = 4;
const ENERGY_DRAIN_PER_TICK = 10;
const ENERGY_GAIN_PER_TICK = 15;
const MOLD_GROWTH_THRESHOLD = 65; // humidity above this grows mold
const MOLD_GROWTH_RATE = 2;
const MOLD_DECAY_RATE = 3;
const MOLD_DAMAGE_PER_TICK = 4;
const MAX_EVENT_LOG = 60;

// ─── Species presets ──────────────────────────────────────────────────────────

const PLANT_PRESETS: Record<
  PlantSpecies,
  Omit<Plant, "id" | "age" | "isAlive">
> = {
  fern: {
    name: "Fern",
    species: "fern",
    health: 100,
    growthRate: 0.6,
    size: 1,
    requirements: {
      lightingMin: 20,
      lightingMax: 65,
      humidityMin: 55,
      humidityMax: 90,
      waterConsumptionPerTick: 4,
    },
    outputs: { oxygenProductionPerTick: 3, biomassPerTick: 2 },
  },
  moss: {
    name: "Moss",
    species: "moss",
    health: 100,
    growthRate: 0.4,
    size: 1,
    requirements: {
      lightingMin: 10,
      lightingMax: 50,
      humidityMin: 65,
      humidityMax: 100,
      waterConsumptionPerTick: 5,
    },
    outputs: { oxygenProductionPerTick: 2, biomassPerTick: 1 },
  },
  succulent: {
    name: "Succulent",
    species: "succulent",
    health: 100,
    growthRate: 0.3,
    size: 1,
    requirements: {
      lightingMin: 50,
      lightingMax: 100,
      humidityMin: 10,
      humidityMax: 45,
      waterConsumptionPerTick: 1,
    },
    outputs: { oxygenProductionPerTick: 2, biomassPerTick: 1 },
  },
  tropical: {
    name: "Tropical Plant",
    species: "tropical",
    health: 100,
    growthRate: 0.7,
    size: 1,
    requirements: {
      lightingMin: 35,
      lightingMax: 75,
      humidityMin: 50,
      humidityMax: 85,
      waterConsumptionPerTick: 3,
    },
    outputs: { oxygenProductionPerTick: 4, biomassPerTick: 3 },
  },
  algae: {
    name: "Algae",
    species: "algae",
    health: 100,
    growthRate: 1.0,
    size: 1,
    requirements: {
      lightingMin: 30,
      lightingMax: 90,
      humidityMin: 70,
      humidityMax: 100,
      waterConsumptionPerTick: 6,
    },
    outputs: { oxygenProductionPerTick: 5, biomassPerTick: 2 },
  },
};

const ORGANISM_PRESETS: Record<
  OrganismSpecies,
  Omit<Organism, "id" | "age" | "isAlive">
> = {
  isopod: {
    name: "Isopod",
    species: "isopod",
    health: 100,
    energy: 80,
    growthRate: 0.3,
    size: 1,
    requirements: {
      foodConsumptionPerTick: 2,
      humidityMin: 50,
      humidityMax: 95,
      oxygenMin: 15,
    },
    wasteProductionPerTick: 1,
  },
  springtail: {
    name: "Springtail",
    species: "springtail",
    health: 100,
    energy: 80,
    growthRate: 0.2,
    size: 1,
    requirements: {
      foodConsumptionPerTick: 1,
      humidityMin: 55,
      humidityMax: 95,
      oxygenMin: 15,
    },
    wasteProductionPerTick: 0.5,
  },
  snail: {
    name: "Snail",
    species: "snail",
    health: 100,
    energy: 80,
    growthRate: 0.4,
    size: 1,
    requirements: {
      foodConsumptionPerTick: 3,
      humidityMin: 60,
      humidityMax: 100,
      oxygenMin: 10,
    },
    wasteProductionPerTick: 1.5,
  },
  gecko: {
    name: "Gecko",
    species: "gecko",
    health: 100,
    energy: 80,
    growthRate: 0.5,
    size: 1,
    requirements: {
      foodConsumptionPerTick: 5,
      humidityMin: 40,
      humidityMax: 80,
      oxygenMin: 18,
    },
    wasteProductionPerTick: 2,
  },
  millipede: {
    name: "Millipede",
    species: "millipede",
    health: 100,
    energy: 80,
    growthRate: 0.35,
    size: 1,
    requirements: {
      foodConsumptionPerTick: 2,
      humidityMin: 50,
      humidityMax: 90,
      oxygenMin: 12,
    },
    wasteProductionPerTick: 1,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _idCounter = 0;
function genId() {
  return `ent_${++_idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function isOutsideRange(value: number, min: number, max: number) {
  return value < min || value > max;
}

function calcEcosystemHealth(
  plants: Plant[],
  organisms: Organism[],
  mold: number
): number {
  const allEntities = [
    ...plants.map((p) => p.health),
    ...organisms.map((o) => o.health),
  ];
  if (allEntities.length === 0) return 0;
  const avgHealth =
    allEntities.reduce((sum, h) => sum + h, 0) / allEntities.length;
  const moldPenalty = mold * 0.3;
  return clamp(avgHealth - moldPenalty);
}

function pushEvent(
  log: EcosystemEvent[],
  tick: number,
  message: string,
  severity: EcosystemEvent["severity"]
): EcosystemEvent[] {
  const updated = [...log, { tick, message, severity }];
  return updated.length > MAX_EVENT_LOG ? updated.slice(-MAX_EVENT_LOG) : updated;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_ENVIRONMENT: Environment = {
  lighting: 60,
  humidity: 65,
  temperature: 22,
  water: 70,
  oxygen: 20,
};

function makeInitialState(): EcosystemState {
  return {
    plants: [],
    organisms: [],
    environment: { ...INITIAL_ENVIRONMENT },
    ecosystemHealth: 0,
    biomassPool: 0,
    debris: 0,
    mold: 0,
    tick: 0,
    eventLog: [],
  };
}

// ─── Core tick logic (pure function) ─────────────────────────────────────────

export function runTick(prev: EcosystemState): EcosystemState {
  const { environment, tick } = prev;
  let { biomassPool, debris, mold } = prev;
  let eventLog = prev.eventLog;
  const nextTick = tick + 1;

  // 1. Mold dynamics – high humidity grows mold; mold damages the ecosystem
  if (environment.humidity > MOLD_GROWTH_THRESHOLD) {
    const growthBoost =
      ((environment.humidity - MOLD_GROWTH_THRESHOLD) / 35) * MOLD_GROWTH_RATE;
    mold = clamp(mold + growthBoost);
    if (mold > 50 && mold % 5 < MOLD_GROWTH_RATE) {
      eventLog = pushEvent(
        eventLog,
        nextTick,
        `Mold is spreading (level ${Math.round(mold)})`,
        mold > 75 ? "critical" : "warning"
      );
    }
  } else {
    mold = clamp(mold - MOLD_DECAY_RATE);
  }

  // Debris also feeds mold slightly when humidity is high
  if (environment.humidity > MOLD_GROWTH_THRESHOLD && debris > 10) {
    mold = clamp(mold + 0.5);
    debris = Math.max(0, debris - 0.5);
  }

  // 2. Process plants – Light × Water × Humidity consumption → Oxygen + Biomass
  let oxygenDelta = 0;
  let waterDelta = 0;

  const updatedPlants: Plant[] = prev.plants
    .filter((p) => p.isAlive)
    .map((plant) => {
      const { requirements, outputs } = plant;
      let { health, size, age } = plant;
      const events: string[] = [];

      const lightStress = isOutsideRange(
        environment.lighting,
        requirements.lightingMin,
        requirements.lightingMax
      );
      const humidityStress = isOutsideRange(
        environment.humidity,
        requirements.humidityMin,
        requirements.humidityMax
      );
      const waterShortage = environment.water < requirements.waterConsumptionPerTick * 2;

      if (lightStress) {
        health = clamp(health - HEALTH_DAMAGE_PER_TICK);
        events.push(`${plant.name} suffering from light stress`);
      }
      if (humidityStress) {
        // Ferns are especially sensitive to low humidity
        const damage =
          plant.species === "fern" && environment.humidity < requirements.humidityMin
            ? HEALTH_DAMAGE_PER_TICK * 1.8
            : HEALTH_DAMAGE_PER_TICK;
        health = clamp(health - damage);
        events.push(`${plant.name} suffering from humidity stress`);
      }
      if (waterShortage) {
        health = clamp(health - HEALTH_DAMAGE_PER_TICK * 0.75);
        events.push(`${plant.name} drying out`);
      }
      // Mold attacks plants
      if (mold > 30) {
        health = clamp(health - (mold / 100) * MOLD_DAMAGE_PER_TICK);
      }

      const isHealthy = !lightStress && !humidityStress && !waterShortage;
      if (isHealthy && health < 100) {
        health = clamp(health + HEALTH_RECOVERY_PER_TICK);
      }

      if (health > 0) {
        // Consume water
        waterDelta -= requirements.waterConsumptionPerTick;
        // Produce oxygen proportional to health
        const healthFactor = health / 100;
        oxygenDelta += outputs.oxygenProductionPerTick * healthFactor;
        // Contribute biomass to the pool
        biomassPool += outputs.biomassPerTick * healthFactor;
        // Grow
        if (isHealthy) {
          size = clamp(size + plant.growthRate * healthFactor, 0, 20);
        }
        age += 1;
      }

      const isAlive = health > 0;
      if (!isAlive) {
        eventLog = pushEvent(
          eventLog,
          nextTick,
          `${plant.name} has died`,
          "warning"
        );
        // Dead plant contributes some debris
        debris += size * 2;
      }

      // Log first occurrence of stress events (deduplicate by checking last few entries)
      for (const msg of events) {
        const recentlyLogged = eventLog
          .slice(-10)
          .some((e) => e.message === msg);
        if (!recentlyLogged) {
          eventLog = pushEvent(eventLog, nextTick, msg, "warning");
        }
      }

      return { ...plant, health, size, age, isAlive };
    });

  // 3. Process organisms – consume biomass → produce waste; humidity + O2 check
  const updatedOrganisms: Organism[] = prev.organisms
    .filter((o) => o.isAlive)
    .map((org) => {
      const { requirements } = org;
      let { health, energy, size, age } = org;
      const events: string[] = [];

      const humidityStress = isOutsideRange(
        environment.humidity,
        requirements.humidityMin,
        requirements.humidityMax
      );
      const oxygenShortage = environment.oxygen < requirements.oxygenMin;

      if (humidityStress) {
        health = clamp(health - HEALTH_DAMAGE_PER_TICK * 0.6);
        events.push(`${org.name} stressed by humidity`);
      }
      if (oxygenShortage) {
        health = clamp(health - HEALTH_DAMAGE_PER_TICK * 0.8);
        events.push(`${org.name} suffering from low oxygen`);
      }

      // Feeding – organisms consume from the biomass pool
      if (biomassPool >= requirements.foodConsumptionPerTick) {
        biomassPool -= requirements.foodConsumptionPerTick;
        energy = clamp(energy + ENERGY_GAIN_PER_TICK);
        if (!humidityStress && !oxygenShortage && health < 100) {
          health = clamp(health + HEALTH_RECOVERY_PER_TICK * 0.5);
        }
      } else {
        // Try to consume from debris if direct biomass is unavailable
        const debrisAvailable = Math.min(debris, requirements.foodConsumptionPerTick);
        if (debrisAvailable > 0) {
          debris -= debrisAvailable;
          energy = clamp(energy + ENERGY_GAIN_PER_TICK * 0.5);
        } else {
          energy = clamp(energy - ENERGY_DRAIN_PER_TICK);
          if (energy <= 0) {
            health = clamp(health - HEALTH_DAMAGE_PER_TICK * 1.2);
            events.push(`${org.name} is starving`);
          }
        }
      }

      // Produce waste
      debris += org.wasteProductionPerTick;
      age += 1;

      if (energy > 40 && !humidityStress && !oxygenShortage) {
        size = clamp(size + org.growthRate * (energy / 100), 0, 20);
      }

      const isAlive = health > 0;
      if (!isAlive) {
        eventLog = pushEvent(
          eventLog,
          nextTick,
          `${org.name} has died`,
          "critical"
        );
        debris += size * 3;
      }

      for (const msg of events) {
        const recentlyLogged = eventLog
          .slice(-10)
          .some((e) => e.message === msg);
        if (!recentlyLogged) {
          eventLog = pushEvent(
            eventLog,
            nextTick,
            msg,
            msg.includes("starving") ? "critical" : "warning"
          );
        }
      }

      return { ...org, health, energy, size, age, isAlive };
    });

  // 4. Update environment from plant activity
  const newOxygen = clamp(environment.oxygen + oxygenDelta * 0.1 - 0.5);
  const newWater = clamp(environment.water + waterDelta * 0.1);

  const newEnvironment: Environment = {
    ...environment,
    oxygen: newOxygen,
    water: newWater,
  };

  // 5. Cap debris accumulation
  debris = Math.min(debris, 200);

  // 6. Global ecosystem health
  const ecosystemHealth = calcEcosystemHealth(
    updatedPlants,
    updatedOrganisms,
    mold
  );

  // Periodic ecosystem health events
  if (nextTick % 10 === 0) {
    const severity =
      ecosystemHealth < 25
        ? "critical"
        : ecosystemHealth < 50
        ? "warning"
        : "info";
    eventLog = pushEvent(
      eventLog,
      nextTick,
      `Ecosystem health: ${Math.round(ecosystemHealth)}%`,
      severity
    );
  }

  return {
    plants: updatedPlants,
    organisms: updatedOrganisms,
    environment: newEnvironment,
    ecosystemHealth,
    biomassPool: Math.max(0, biomassPool),
    debris,
    mold,
    tick: nextTick,
    eventLog,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEcosystemLogic(): UseEcosystemLogicReturn {
  const [state, setState] = useState<EcosystemState>(makeInitialState);
  const [isAutoTicking, setIsAutoTicking] = useState(false);
  const autoTickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Tick ──────────────────────────────────────────────────────────────────
  const advanceTick = useCallback(() => {
    setState((prev) => runTick(prev));
  }, []);

  // ── Auto-tick ─────────────────────────────────────────────────────────────
  const setAutoTick = useCallback(
    (enabled: boolean, intervalMs = 1500) => {
      if (autoTickIntervalRef.current) {
        clearInterval(autoTickIntervalRef.current);
        autoTickIntervalRef.current = null;
      }
      if (enabled) {
        autoTickIntervalRef.current = setInterval(advanceTick, intervalMs);
      }
      setIsAutoTicking(enabled);
    },
    [advanceTick]
  );

  useEffect(() => {
    return () => {
      if (autoTickIntervalRef.current) {
        clearInterval(autoTickIntervalRef.current);
      }
    };
  }, []);

  // ── Add plant ─────────────────────────────────────────────────────────────
  const addPlant = useCallback((plant: Omit<Plant, "id" | "age" | "isAlive">) => {
    setState((prev) => ({
      ...prev,
      plants: [...prev.plants, { ...plant, id: genId(), age: 0, isAlive: true }],
    }));
  }, []);

  // ── Add organism ──────────────────────────────────────────────────────────
  const addOrganism = useCallback(
    (organism: Omit<Organism, "id" | "age" | "isAlive">) => {
      setState((prev) => ({
        ...prev,
        organisms: [
          ...prev.organisms,
          { ...organism, id: genId(), age: 0, isAlive: true },
        ],
      }));
    },
    []
  );

  // ── Remove entity ─────────────────────────────────────────────────────────
  const removeEntity = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      plants: prev.plants.filter((p) => p.id !== id),
      organisms: prev.organisms.filter((o) => o.id !== id),
    }));
  }, []);

  // ── Update environment ────────────────────────────────────────────────────
  const updateEnvironment = useCallback((patch: Partial<Environment>) => {
    setState((prev) => ({
      ...prev,
      environment: { ...prev.environment, ...patch },
    }));
  }, []);

  // ── Spawn preset ──────────────────────────────────────────────────────────
  const spawnPreset = useCallback(
    (type: "plant" | "organism", species: PlantSpecies | OrganismSpecies) => {
      if (type === "plant") {
        const preset = PLANT_PRESETS[species as PlantSpecies];
        if (preset) addPlant({ ...preset });
      } else {
        const preset = ORGANISM_PRESETS[species as OrganismSpecies];
        if (preset) addOrganism({ ...preset });
      }
    },
    [addPlant, addOrganism]
  );

  return {
    state,
    advanceTick,
    setAutoTick,
    addPlant,
    addOrganism,
    removeEntity,
    updateEnvironment,
    spawnPreset,
    isAutoTicking,
  };
}
