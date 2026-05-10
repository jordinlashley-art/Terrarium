import { useCallback, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  EcosystemState,
  Entity,
  EntityType,
  LogEntry,
  TimeScale,
  EnvironmentState,
} from '../types/ecosystem';
import {
  ENTITY_CONFIGS,
  MAX_LOG_ENTRIES,
  OXYGEN_GAIN_MOSS,
  OXYGEN_GAIN_FERN,
  OXYGEN_DECAY,
  SOIL_GAIN_ISOPOD,
  SOIL_DECAY,
  MOLD_GROWTH_RATE,
  MOLD_REDUCTION_SPRINGTAIL,
  HUMIDITY_DRAIN_FERN,
  INITIAL_ENVIRONMENT,
} from '../constants/ecosystem';
import { loadState } from '../utils/storage';

// ── helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function makeLog(
  message: string,
  tick: number,
  category: LogEntry['category'],
): LogEntry {
  return { id: uuidv4(), message, timestamp: tick, category };
}

function spawnEntity(type: EntityType, overrides?: Partial<Entity>): Entity {
  return {
    id: uuidv4(),
    type,
    health: 80,
    age: 0,
    x: randomBetween(5, 95),
    y: randomBetween(10, 85),
    decaying: false,
    reproduced: false,
    ...overrides,
  };
}

function buildInitialEntities(): Entity[] {
  return [
    spawnEntity('moss', { x: 15, y: 60 }),
    spawnEntity('moss', { x: 35, y: 70 }),
    spawnEntity('fern', { x: 55, y: 55 }),
    spawnEntity('isopod', { x: 70, y: 80 }),
    spawnEntity('isopod', { x: 80, y: 75 }),
    spawnEntity('springtail', { x: 25, y: 85 }),
  ];
}

// ── initial state ─────────────────────────────────────────────────────────────

function buildInitialState(): EcosystemState {
  const saved = loadState();
  return {
    environment: saved?.environment ?? { ...INITIAL_ENVIRONMENT },
    entities: saved?.entities ?? buildInitialEntities(),
    logs: saved?.logs ?? [
      makeLog('Terrarium initialised. Welcome!', 0, 'info'),
    ],
    tick: saved?.tick ?? 0,
    running: false,
    timeScale: saved?.timeScale ?? 1,
  };
}

// ── reducer actions ───────────────────────────────────────────────────────────

type Action =
  | { type: 'TICK' }
  | { type: 'SET_LIGHTING'; value: number }
  | { type: 'SET_HUMIDITY'; value: number }
  | { type: 'SET_TEMPERATURE'; value: number }
  | { type: 'SET_TIME_SCALE'; value: TimeScale }
  | { type: 'TOGGLE_RUNNING' }
  | { type: 'ADD_ENTITY'; entityType: EntityType }
  | { type: 'RESET' };

// ── tick logic ────────────────────────────────────────────────────────────────

function processTick(state: EcosystemState): EcosystemState {
  const { environment, entities, tick } = state;
  const newTick = tick + 1;
  const newLogs: LogEntry[] = [];

  let { oxygen, soil, mold, lighting, humidity, temperature } = environment;

  const updatedEntities: Entity[] = [];
  const toRemove = new Set<string>();

  // Count entities by type for population caps
  const popCount: Record<EntityType, number> = {
    moss: 0,
    fern: 0,
    isopod: 0,
    springtail: 0,
  };
  for (const e of entities) {
    if (!e.decaying) popCount[e.type]++;
  }

  // Track decaying plant count for isopods to eat
  let decayingPlantCount = entities.filter(
    (e) => e.decaying && (e.type === 'moss' || e.type === 'fern'),
  ).length;

  for (const entity of entities) {
    const cfg = ENTITY_CONFIGS[entity.type];
    let { health, age, decaying, reproduced } = entity;

    if (decaying) {
      // Decaying entities slowly disappear
      age++;
      if (age > 20) {
        toRemove.add(entity.id);
        newLogs.push(
          makeLog(
            `A ${cfg.label} patch has fully decomposed.`,
            newTick,
            'decay',
          ),
        );
        continue;
      }
      updatedEntities.push({ ...entity, age });
      continue;
    }

    age++;

    const lightingOk = isInRange(lighting, cfg.lightingMin, cfg.lightingMax);
    const humidityOk = isInRange(humidity, cfg.humidityMin, cfg.humidityMax);
    const conditionsMet = lightingOk && humidityOk;

    if (conditionsMet) {
      health = clamp(health + cfg.healthGrowthRate);
    } else {
      health = clamp(health - cfg.healthDecayRate);
    }

    // Entity dies → becomes decaying matter
    if (health <= 0) {
      if (entity.type === 'moss') {
        newLogs.push(
          makeLog(`A Moss patch has withered.`, newTick, 'death'),
        );
      } else if (entity.type === 'fern') {
        newLogs.push(
          makeLog(`A Fern has wilted and is now decaying.`, newTick, 'death'),
        );
      } else {
        newLogs.push(
          makeLog(`An ${cfg.label} has perished.`, newTick, 'death'),
        );
      }
      updatedEntities.push({ ...entity, health: 0, age, decaying: true, reproduced: false });
      if (entity.type === 'moss' || entity.type === 'fern') {
        decayingPlantCount++;
      }
      continue;
    }

    // Environmental effects
    if (entity.type === 'moss' && health > 50) {
      oxygen = clamp(oxygen + OXYGEN_GAIN_MOSS);
    }
    if (entity.type === 'fern' && health > 50) {
      oxygen = clamp(oxygen + OXYGEN_GAIN_FERN);
      humidity = clamp(humidity - HUMIDITY_DRAIN_FERN);
    }
    if (entity.type === 'isopod' && health > 40 && decayingPlantCount > 0) {
      soil = clamp(soil + SOIL_GAIN_ISOPOD);
    }
    if (entity.type === 'springtail' && health > 40) {
      mold = clamp(mold - MOLD_REDUCTION_SPRINGTAIL);
    }

    // Reproduction
    reproduced = false;
    if (
      health >= 75 &&
      !entity.reproduced &&
      popCount[entity.type] < cfg.maxPopulation
    ) {
      const roll = Math.random();
      if (roll < cfg.baseReproductionRate) {
        const offspring = spawnEntity(entity.type, {
          x: clamp(entity.x + randomBetween(-10, 10), 5, 95),
          y: clamp(entity.y + randomBetween(-10, 10), 10, 90),
          health: 50,
          age: 0,
        });
        updatedEntities.push(offspring);
        popCount[entity.type]++;
        reproduced = true;
        newLogs.push(
          makeLog(
            `An ${cfg.label} has reproduced! The population grows.`,
            newTick,
            'reproduce',
          ),
        );
      }
    }

    updatedEntities.push({ ...entity, health, age, decaying, reproduced });
  }

  // Remove fully decomposed entities (marked for removal)
  const finalEntities = updatedEntities.filter((e) => !toRemove.has(e.id));

  // Isopods eat decaying plants
  const activeIsopods = finalEntities.filter(
    (e) => e.type === 'isopod' && !e.decaying && e.health > 40,
  ).length;
  const decayingToRemove = Math.min(
    Math.floor(activeIsopods * 0.3),
    finalEntities.filter((e) => e.decaying && (e.type === 'moss' || e.type === 'fern')).length,
  );
  let removed = 0;
  const afterIsopodCleanup = finalEntities.filter((e) => {
    if (
      removed < decayingToRemove &&
      e.decaying &&
      (e.type === 'moss' || e.type === 'fern')
    ) {
      removed++;
      if (removed === 1) {
        newLogs.push(
          makeLog(
            `An Isopod ate some decaying matter, enriching the soil.`,
            newTick,
            'info',
          ),
        );
      }
      return false;
    }
    return true;
  });

  // Passive environmental changes
  oxygen = clamp(oxygen - OXYGEN_DECAY);
  soil = clamp(soil - SOIL_DECAY);

  const highHumidityAndFewSpringtails =
    humidity > 85 &&
    afterIsopodCleanup.filter((e) => e.type === 'springtail' && !e.decaying).length < 2;
  if (highHumidityAndFewSpringtails) {
    mold = clamp(mold + MOLD_GROWTH_RATE);
    if (mold > 20 && Math.random() < 0.05) {
      newLogs.push(
        makeLog(
          `Mold is spreading in the humid environment! Add Springtails to control it.`,
          newTick,
          'environment',
        ),
      );
    }
  }

  // Oxygen warning
  if (oxygen < 20 && Math.random() < 0.03) {
    newLogs.push(
      makeLog(
        `Oxygen levels are critically low! Add more plants.`,
        newTick,
        'environment',
      ),
    );
  }

  // Periodic info
  if (newTick % 50 === 0) {
    const plantCount = afterIsopodCleanup.filter(
      (e) => !e.decaying && (e.type === 'moss' || e.type === 'fern'),
    ).length;
    newLogs.push(
      makeLog(
        `Tick ${newTick}: ${plantCount} plant(s) thriving, oxygen at ${Math.round(oxygen)}%.`,
        newTick,
        'info',
      ),
    );
  }

  const updatedEnvironment: EnvironmentState = {
    lighting,
    humidity: clamp(humidity),
    oxygen: clamp(oxygen),
    soil: clamp(soil),
    mold: clamp(mold),
    temperature,
  };

  const combinedLogs = [...state.logs, ...newLogs].slice(-MAX_LOG_ENTRIES);

  return {
    ...state,
    environment: updatedEnvironment,
    entities: afterIsopodCleanup,
    logs: combinedLogs,
    tick: newTick,
  };
}

// ── reducer ───────────────────────────────────────────────────────────────────

function ecosystemReducer(state: EcosystemState, action: Action): EcosystemState {
  switch (action.type) {
    case 'TICK':
      return processTick(state);

    case 'SET_LIGHTING':
      return {
        ...state,
        environment: { ...state.environment, lighting: clamp(action.value) },
      };

    case 'SET_HUMIDITY':
      return {
        ...state,
        environment: { ...state.environment, humidity: clamp(action.value) },
      };

    case 'SET_TEMPERATURE':
      return {
        ...state,
        environment: { ...state.environment, temperature: clamp(action.value) },
      };

    case 'SET_TIME_SCALE':
      return { ...state, timeScale: action.value };

    case 'TOGGLE_RUNNING':
      return { ...state, running: !state.running };

    case 'ADD_ENTITY': {
      const cfg = ENTITY_CONFIGS[action.entityType];
      const popCount = state.entities.filter(
        (e) => e.type === action.entityType && !e.decaying,
      ).length;
      if (popCount >= cfg.maxPopulation) return state;
      const newEntity = spawnEntity(action.entityType);
      const addLog = makeLog(
        `A new ${cfg.label} was introduced to the terrarium.`,
        state.tick,
        'birth',
      );
      return {
        ...state,
        entities: [...state.entities, newEntity],
        logs: [...state.logs, addLog].slice(-MAX_LOG_ENTRIES),
      };
    }

    case 'RESET':
      return { ...buildInitialState(), running: false };

    default:
      return state;
  }
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useEcosystem() {
  const [state, dispatch] = useReducer(ecosystemReducer, undefined, buildInitialState);

  const tick = useCallback(() => dispatch({ type: 'TICK' }), []);
  const setLighting = useCallback((v: number) => dispatch({ type: 'SET_LIGHTING', value: v }), []);
  const setHumidity = useCallback((v: number) => dispatch({ type: 'SET_HUMIDITY', value: v }), []);
  const setTemperature = useCallback((v: number) => dispatch({ type: 'SET_TEMPERATURE', value: v }), []);
  const setTimeScale = useCallback((v: TimeScale) => dispatch({ type: 'SET_TIME_SCALE', value: v }), []);
  const toggleRunning = useCallback(() => dispatch({ type: 'TOGGLE_RUNNING' }), []);
  const addEntity = useCallback((entityType: EntityType) => dispatch({ type: 'ADD_ENTITY', entityType }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state,
    tick,
    setLighting,
    setHumidity,
    setTemperature,
    setTimeScale,
    toggleRunning,
    addEntity,
    reset,
  };
}
