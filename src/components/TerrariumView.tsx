import React, { useMemo } from 'react';
import { Entity, EnvironmentState } from '../types/ecosystem';
import { ENTITY_CONFIGS } from '../constants/ecosystem';

interface Props {
  entities: Entity[];
  environment: EnvironmentState;
}

const SVG_PATHS: Record<string, string> = {
  moss: '/assets/svgs/moss.svg',
  fern: '/assets/svgs/fern.svg',
  isopod: '/assets/svgs/isopod.svg',
  springtail: '/assets/svgs/springtail.svg',
};

function EntitySprite({ entity }: { entity: Entity }) {
  const cfg = ENTITY_CONFIGS[entity.type];
  const opacity = entity.decaying ? 0.3 : Math.max(0.4, entity.health / 100);
  const scale = entity.decaying ? 0.7 : 0.7 + (entity.health / 100) * 0.5;
  const size = entity.type === 'moss' ? 52 : entity.type === 'fern' ? 48 : 32;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${entity.x}%`,
        top: `${entity.y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        transition: 'opacity 0.5s, transform 0.5s',
        filter: entity.decaying ? 'grayscale(80%) sepia(40%)' : 'none',
        zIndex: entity.type === 'isopod' || entity.type === 'springtail' ? 3 : 2,
      }}
      title={`${cfg.label} | HP: ${Math.round(entity.health)} | Age: ${entity.age}`}
    >
      <img
        src={SVG_PATHS[entity.type]}
        alt={cfg.label}
        width={size}
        height={size}
        style={{ display: 'block', pointerEvents: 'none' }}
      />
    </div>
  );
}

export function TerrariumView({ entities, environment }: Props) {
  const sortedEntities = useMemo(
    () => [...entities].sort((a, b) => a.y - b.y),
    [entities],
  );

  const lightingStyle = useMemo(() => {
    const l = environment.lighting;
    const brightness = 0.3 + (l / 100) * 0.9;
    const warmth = l > 60 ? `rgba(255,200,100,${(l - 60) / 150})` : 'transparent';
    return { filter: `brightness(${brightness})`, '--warmth': warmth } as React.CSSProperties;
  }, [environment.lighting]);

  const humidityFog = Math.max(0, (environment.humidity - 70) / 100);
  const moldTint = environment.mold > 30 ? `rgba(134,239,172,${environment.mold / 500})` : 'transparent';

  return (
    <div className="terrarium-container" style={lightingStyle}>
      {/* Sky / gradient background */}
      <div className="terrarium-bg" />

      {/* Fog overlay from humidity */}
      {humidityFog > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(186,230,253,${humidityFog * 0.25})`,
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Mold tint overlay */}
      {environment.mold > 30 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: moldTint,
            pointerEvents: 'none',
            zIndex: 1,
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Ground layer */}
      <div className="terrarium-ground" />

      {/* Entities */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {sortedEntities.map((entity) => (
          <EntitySprite key={entity.id} entity={entity} />
        ))}
      </div>

      {/* Environment overlay info */}
      <div className="terrarium-stats-overlay">
        <span title="Oxygen">O₂ {Math.round(environment.oxygen)}%</span>
        <span title="Soil Quality">🪱 {Math.round(environment.soil)}%</span>
        {environment.mold > 5 && (
          <span title="Mold Level" style={{ color: '#a3e635' }}>
            🍄 {Math.round(environment.mold)}%
          </span>
        )}
      </div>
    </div>
  );
}
