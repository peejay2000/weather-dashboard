import React from "react";

/**
 * Tiny sparkline-style chart using SVG.
 * hourly: array of objects with .temp
 */
export default function TemperatureChart({ hourly = [] }) {
  if (!hourly.length) return null;
  const values = hourly.map(h => h.temp);
  const w = 700, h = 120, padding = 20;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const scaleX = (i) => padding + (i / (values.length - 1)) * (w - padding*2);
  const scaleY = (v) => h - padding - ((v - min) / (max - min || 1)) * (h - padding*2);

  const d = values.map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`).join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
        {/* area fill */}
        <path d={`${d} L ${w-padding} ${h-padding} L ${padding} ${h-padding} Z`} fill="rgba(99,102,241,0.08)" stroke="none" />
        {/* line */}
        <path d={d} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
