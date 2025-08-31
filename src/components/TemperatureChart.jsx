import React from "react";
import { timeFromUnix } from "../utils/format";

/**
 * Tiny sparkline-style chart using SVG.
 * hourly: array of forecast points (each has .main.temp and .dt)
 */
export default function TemperatureChart({ hourly = [] }) {
  if (!hourly.length) return null;

  const values = hourly.map((h) => h.main.temp);
  const labels = hourly.map((h) => timeFromUnix(h.dt));

  const w = 700;
  const h = 120;
  const padding = 40; // add space for time labels

  const max = Math.max(...values);
  const min = Math.min(...values);

  const scaleX = (i) => padding + (i / (values.length - 1)) * (w - padding * 2);
  const scaleY = (v) => h - padding - ((v - min) / (max - min || 1)) * (h - padding * 2);

  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`)
    .join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
        {/* area fill */}
        <path
          d={`${d} L ${w - padding} ${h - padding} L ${padding} ${h - padding} Z`}
          fill="rgba(99,102,241,0.08)"
          stroke="none"
        />
        {/* line */}
        <path
          d={d}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* time labels */}
        {labels.map((t, i) => (
          <text
            key={i}
            x={scaleX(i)}
            y={h - padding + 15}
            fontSize="10"
            textAnchor="middle"
            fill="#6b7280"
          >
            {t}
          </text>
        ))}
      </svg>
    </div>
  );
}
