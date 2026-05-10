# Terrarium

A browser-based terrarium ecosystem simulator built with Next.js 16 and TypeScript.

## Stage 2: Ecosystem Simulation

This stage implements the core simulation engine via the `useEcosystemLogic` hook, following a **resource-conversion** model:

- **Plants** consume Light + Water → produce Oxygen + Biomass
- **Organisms** consume Biomass/Debris → produce Waste
- **Humidity** above 65% triggers mold growth; low humidity damages moisture-dependent species (ferns)

### Architecture

| Path | Description |
|---|---|
| `src/types/ecosystem.ts` | All TypeScript types: `Plant`, `Organism`, `Environment`, `EcosystemState` |
| `src/hooks/useEcosystemLogic.ts` | Core simulation hook with `advanceTick`, `addPlant`, `addOrganism`, `updateEnvironment`, `spawnPreset` |
| `src/components/EcosystemDashboard.tsx` | Main UI dashboard |
| `src/components/EnvironmentPanel.tsx` | Sliders for lighting, humidity, temperature, water |
| `src/components/EntityCard.tsx` | Per-entity health/energy cards |
| `src/components/SpawnPanel.tsx` | Quick-add buttons for species presets |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the simulation.
