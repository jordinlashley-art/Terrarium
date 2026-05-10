"use client";

import { useState, useCallback } from "react";

type PlantType = "Moss" | "Fern";
type OrganismType = "Isopod" | "Springtail";
type ItemType = PlantType | OrganismType;

interface TerrariumItem {
  id: number;
  type: ItemType;
  x: number;
  y: number;
  delay: number;
}

const ITEM_EMOJI: Record<ItemType, string> = {
  Moss: "🌿",
  Fern: "🌱",
  Isopod: "🐛",
  Springtail: "🦗",
};

const ITEM_ANIMATION: Record<ItemType, string> = {
  Moss: "animate-sway",
  Fern: "animate-float",
  Isopod: "animate-crawl",
  Springtail: "animate-hop",
};

let nextId = 1;

function SliderControl({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  trackColor,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min: number;
  max: number;
  trackColor: string;
  icon: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-green-100/80 tracking-wide uppercase">
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-sm font-mono font-bold text-green-300">
          {value}
          {unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, ${trackColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

function ShopButton({
  label,
  emoji,
  onClick,
  color,
}: {
  label: string;
  emoji: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${color} hover:scale-105 active:scale-95 w-full`}
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
      <span className="ml-auto opacity-60 text-xs">+ Add</span>
    </button>
  );
}

export default function TerrariumPage() {
  const [lighting, setLighting] = useState(70);
  const [humidity, setHumidity] = useState(60);
  const [temperature, setTemperature] = useState(22);
  const [items, setItems] = useState<TerrariumItem[]>([]);

  const addItem = useCallback((type: ItemType) => {
    const isOrganism = type === "Isopod" || type === "Springtail";
    const x = 10 + Math.random() * 75;
    const y = isOrganism ? 55 + Math.random() * 30 : 20 + Math.random() * 55;
    const delay = Math.random() * 2;
    setItems((prev) => [...prev, { id: nextId++, type, x, y, delay }]);
  }, []);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Derive ambient tint from controls
  const lightOpacity = Math.round((lighting / 100) * 60 + 10);
  const fogOpacity = Math.round((humidity / 100) * 40);
  const tempTint =
    temperature < 15
      ? `rgba(99,179,237,0.08)`
      : temperature > 28
      ? `rgba(252,129,74,0.08)`
      : `rgba(74,222,128,0.05)`;

  const glowIntensity = Math.round((lighting / 100) * 40 + 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060d06] via-[#0a160a] to-[#050d0a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-base">
            🌿
          </div>
          <span className="text-lg font-bold tracking-tight text-white/90">
            Terra<span className="text-green-400">rium</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live Environment
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* ── Terrarium View ── */}
        <section className="flex-1 flex flex-col">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 pl-1">
            Terrarium View
          </h2>

          {/* Glass container */}
          <div
            className="relative flex-1 rounded-3xl overflow-hidden animate-pulse-glow border border-white/10"
            style={{
              background: `linear-gradient(160deg, rgba(20,40,20,0.85) 0%, rgba(8,20,12,0.95) 100%)`,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: `0 0 ${glowIntensity}px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 80px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Glass highlight */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
              }}
            />

            {/* Lighting overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,210,0.${lightOpacity.toString().padStart(2,"0")}) 0%, transparent 70%)`,
              }}
            />

            {/* Fog / humidity overlay */}
            {fogOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-700"
                style={{
                  background: `linear-gradient(to top, rgba(180,220,255,0.${fogOpacity.toString().padStart(2,"0")}) 0%, transparent 60%)`,
                }}
              />
            )}

            {/* Temperature tint */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl transition-all duration-700"
              style={{ background: tempTint }}
            />

            {/* Ground layer */}
            <div className="absolute bottom-0 left-0 right-0 h-24 rounded-b-3xl"
              style={{
                background: "linear-gradient(to top, #1a0f00 0%, #2d1a00 40%, #3d2800 70%, transparent 100%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-3xl"
              style={{
                background: "linear-gradient(to top, #0f1a0f 0%, #1a2d1a 50%, transparent 100%)",
                opacity: 0.7,
              }}
            />

            {/* Moss base layer */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-around items-end px-4 pointer-events-none">
              {["🌾","🌿","🍃","🌾","🍃"].map((e, i) => (
                <span key={i} className="text-xl opacity-40" style={{ animationDelay: `${i * 0.4}s` }}>
                  {e}
                </span>
              ))}
            </div>

            {/* Placed items */}
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => removeItem(item.id)}
                title="Click to remove"
                className={`absolute text-2xl cursor-pointer transition-transform hover:scale-125 ${ITEM_ANIMATION[item.type]}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${item.delay}s`,
                  filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6))`,
                  textShadow: "0 0 8px rgba(255,255,255,0.2)",
                }}
              >
                {ITEM_EMOJI[item.type]}
              </button>
            ))}

            {/* Empty state */}
            {items.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/15 pointer-events-none select-none">
                <span className="text-5xl mb-3 opacity-30">🌿</span>
                <p className="text-sm font-medium">Your terrarium is empty</p>
                <p className="text-xs mt-1 opacity-60">Add plants & organisms from the shop →</p>
              </div>
            )}

            {/* Item count badge */}
            {items.length > 0 && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                <span className="text-xs text-white/50">{items.length} inhabitant{items.length !== 1 ? "s" : ""}</span>
              </div>
            )}

            {/* Corner glass shine */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
              style={{
                background: "radial-gradient(circle at top right, rgba(255,255,255,0.07) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Stats bar */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Lighting", value: `${lighting}%`, icon: "☀️", color: "text-yellow-300" },
              { label: "Humidity", value: `${humidity}%`, icon: "💧", color: "text-blue-300" },
              {
                label: "Temp",
                value: `${temperature}°C`,
                icon: temperature > 28 ? "🌡️" : temperature < 15 ? "❄️" : "🌡️",
                color: temperature > 28 ? "text-orange-300" : temperature < 15 ? "text-blue-300" : "text-green-300",
              },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-lg">{icon}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Control Sidebar ── */}
        <aside className="w-72 flex flex-col gap-4 overflow-y-auto">

          {/* Environment Controls */}
          <div
            className="rounded-2xl border border-white/8 p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
              <span>⚙️</span> Environment
            </h3>

            <SliderControl
              label="Lighting"
              icon="☀️"
              value={lighting}
              onChange={setLighting}
              unit="%"
              min={0}
              max={100}
              trackColor="#facc15"
            />
            <SliderControl
              label="Humidity"
              icon="💧"
              value={humidity}
              onChange={setHumidity}
              unit="%"
              min={0}
              max={100}
              trackColor="#60a5fa"
            />
            <SliderControl
              label="Temperature"
              icon="🌡️"
              value={temperature}
              onChange={setTemperature}
              unit="°C"
              min={5}
              max={40}
              trackColor={temperature > 28 ? "#fb923c" : temperature < 15 ? "#93c5fd" : "#4ade80"}
            />
          </div>

          {/* Shop */}
          <div
            className="rounded-2xl border border-white/8 p-5 flex-1"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
              <span>🛒</span> Shop
            </h3>

            {/* Plants */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-green-400/60 font-semibold mb-3 flex items-center gap-1.5">
                <span>🌱</span> Plants
              </p>
              <div className="flex flex-col gap-2">
                <ShopButton
                  label="Moss"
                  emoji="🌿"
                  onClick={() => addItem("Moss")}
                  color="bg-green-900/30 border-green-700/30 text-green-200 hover:bg-green-800/40 hover:border-green-600/50"
                />
                <ShopButton
                  label="Fern"
                  emoji="🌱"
                  onClick={() => addItem("Fern")}
                  color="bg-emerald-900/30 border-emerald-700/30 text-emerald-200 hover:bg-emerald-800/40 hover:border-emerald-600/50"
                />
              </div>
            </div>

            {/* Organisms */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-400/60 font-semibold mb-3 flex items-center gap-1.5">
                <span>🐾</span> Organisms
              </p>
              <div className="flex flex-col gap-2">
                <ShopButton
                  label="Isopod"
                  emoji="🐛"
                  onClick={() => addItem("Isopod")}
                  color="bg-amber-900/30 border-amber-700/30 text-amber-200 hover:bg-amber-800/40 hover:border-amber-600/50"
                />
                <ShopButton
                  label="Springtail"
                  emoji="🦗"
                  onClick={() => addItem("Springtail")}
                  color="bg-orange-900/30 border-orange-700/30 text-orange-200 hover:bg-orange-800/40 hover:border-orange-600/50"
                />
              </div>
            </div>

            {/* Inventory summary */}
            {items.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">
                  Inventory
                </p>
                <div className="flex flex-col gap-1.5">
                  {(["Moss", "Fern", "Isopod", "Springtail"] as ItemType[])
                    .filter((t) => items.some((i) => i.type === t))
                    .map((type) => {
                      const count = items.filter((i) => i.type === type).length;
                      return (
                        <div key={type} className="flex items-center justify-between text-xs text-white/50">
                          <span className="flex items-center gap-1.5">
                            <span>{ITEM_EMOJI[type]}</span>
                            {type}
                          </span>
                          <span className="font-mono font-bold text-white/70">×{count}</span>
                        </div>
                      );
                    })}
                </div>
                <button
                  onClick={() => setItems([])}
                  className="mt-4 w-full text-xs text-red-400/60 hover:text-red-400 transition-colors py-1.5 rounded-lg hover:bg-red-900/20 border border-transparent hover:border-red-900/30"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
