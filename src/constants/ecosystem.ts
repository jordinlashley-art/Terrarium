import { EntityConfig } from '../types/ecosystem';

export const ENTITY_CONFIGS: Record<string, EntityConfig> = {
  moss: {
    type: 'moss',
    label: 'Moss',
    emoji: '🌿',
    lightingMin: 20,
    lightingMax: 50,
    humidityMin: 70,
    humidityMax: 90,
    description: 'A resilient, low-light plant that thrives in high humidity.',
    effect: 'Increases Oxygen slowly',
    color: '#4ade80',
    bgColor: 'rgba(74, 222, 128, 0.15)',
    maxPopulation: 12,
    baseReproductionRate: 0.008,
    healthDecayRate: 2,
    healthGrowthRate: 1.5,
  },
  fern: {
    type: 'fern',
    label: 'Fern',
    emoji: '🌱',
    lightingMin: 40,
    lightingMax: 70,
    humidityMin: 60,
    humidityMax: 80,
    description: 'A lush fern that grows quickly but demands more water.',
    effect: 'High growth, needs more water',
    color: '#86efac',
    bgColor: 'rgba(134, 239, 172, 0.15)',
    maxPopulation: 8,
    baseReproductionRate: 0.012,
    healthDecayRate: 3,
    healthGrowthRate: 2,
  },
  isopod: {
    type: 'isopod',
    label: 'Isopod',
    emoji: '🦟',
    lightingMin: 0,
    lightingMax: 100,
    humidityMin: 60,
    humidityMax: 100,
    description: 'A tiny crustacean that cleans up decaying matter and enriches the soil.',
    effect: 'Eats decaying plants, boosts soil',
    color: '#fb923c',
    bgColor: 'rgba(251, 146, 60, 0.15)',
    maxPopulation: 20,
    baseReproductionRate: 0.015,
    healthDecayRate: 1.5,
    healthGrowthRate: 1.2,
  },
  springtail: {
    type: 'springtail',
    label: 'Springtail',
    emoji: '🦗',
    lightingMin: 0,
    lightingMax: 30,
    humidityMin: 80,
    humidityMax: 100,
    description: 'A microscopic arthropod that prevents mold growth in wet environments.',
    effect: 'Prevents mold growth',
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.15)',
    maxPopulation: 25,
    baseReproductionRate: 0.018,
    healthDecayRate: 2,
    healthGrowthRate: 1.8,
  },
};

export const TICK_INTERVAL_MS = 500; // Base tick interval at 1x speed

export const MAX_LOG_ENTRIES = 100;

export const OXYGEN_GAIN_MOSS = 0.08;     // per healthy moss per tick
export const OXYGEN_GAIN_FERN = 0.15;     // per healthy fern per tick
export const OXYGEN_DECAY = 0.02;         // passive oxygen decay per tick

export const SOIL_GAIN_ISOPOD = 0.12;    // per active isopod per tick
export const SOIL_DECAY = 0.015;          // passive soil decay per tick

export const MOLD_GROWTH_RATE = 0.05;    // mold grows when humidity > 85 & no springtails
export const MOLD_REDUCTION_SPRINGTAIL = 0.2; // per active springtail per tick

export const HUMIDITY_DRAIN_FERN = 0.1;  // per healthy fern (ferns drink more water)

export const INITIAL_ENVIRONMENT = {
  lighting: 40,
  humidity: 80,
  oxygen: 50,
  soil: 50,
  mold: 0,
  temperature: 65,
};
