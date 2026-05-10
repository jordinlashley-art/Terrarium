import { EntityType, Entity } from '../types/ecosystem';
import { ENTITY_CONFIGS } from '../constants/ecosystem';

interface Props {
  type: EntityType;
  entities: Entity[];
  onAdd: (type: EntityType) => void;
}

export function EntityCard({ type, entities, onAdd }: Props) {
  const cfg = ENTITY_CONFIGS[type];
  const living = entities.filter((e) => e.type === type && !e.decaying);
  const decaying = entities.filter((e) => e.type === type && e.decaying);
  const avgHealth =
    living.length > 0
      ? Math.round(living.reduce((s, e) => s + e.health, 0) / living.length)
      : 0;
  const atCap = living.length >= cfg.maxPopulation;

  const healthColor =
    avgHealth >= 70 ? cfg.color : avgHealth >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="entity-card" style={{ borderColor: cfg.color + '44', background: cfg.bgColor }}>
      <div className="entity-card-header">
        <div className="entity-card-title">
          <img
            src={`/assets/svgs/${type}.svg`}
            alt={cfg.label}
            width={28}
            height={28}
          />
          <div>
            <div className="entity-card-name" style={{ color: cfg.color }}>
              {cfg.label}
            </div>
            <div className="entity-card-effect">{cfg.effect}</div>
          </div>
        </div>
        <button
          className="btn-add-entity"
          style={{
            borderColor: cfg.color,
            color: atCap ? '#6b7280' : cfg.color,
            cursor: atCap ? 'not-allowed' : 'pointer',
            opacity: atCap ? 0.5 : 1,
          }}
          onClick={() => onAdd(type)}
          disabled={atCap}
          title={atCap ? `Population cap (${cfg.maxPopulation}) reached` : `Add a ${cfg.label}`}
        >
          {atCap ? 'Max' : '+ Add'}
        </button>
      </div>

      <div className="entity-card-stats">
        <div className="entity-stat">
          <span className="entity-stat-label">Population</span>
          <span className="entity-stat-value">
            {living.length}
            <span className="entity-stat-cap"> / {cfg.maxPopulation}</span>
          </span>
        </div>
        {living.length > 0 && (
          <div className="entity-stat">
            <span className="entity-stat-label">Avg Health</span>
            <span className="entity-stat-value" style={{ color: healthColor }}>
              {avgHealth}%
            </span>
          </div>
        )}
        {decaying.length > 0 && (
          <div className="entity-stat">
            <span className="entity-stat-label">Decaying</span>
            <span className="entity-stat-value" style={{ color: '#9ca3af' }}>
              {decaying.length}
            </span>
          </div>
        )}
      </div>

      <div className="entity-card-reqs">
        <ReqBadge label={`☀️ ${cfg.lightingMin}–${cfg.lightingMax}%`} />
        <ReqBadge label={`💧 ${cfg.humidityMin}–${cfg.humidityMax}%`} />
      </div>

      {living.length > 0 && (
        <div className="entity-health-bar-bg">
          <div
            className="entity-health-bar-fill"
            style={{ width: `${avgHealth}%`, background: healthColor }}
          />
        </div>
      )}
    </div>
  );
}

function ReqBadge({ label }: { label: string }) {
  return <span className="req-badge">{label}</span>;
}
