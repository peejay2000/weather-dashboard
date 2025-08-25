import { dateFromUnix } from "../utils/format";

export default function Forecast({ daily = [] }) {
  if (!daily?.length) return null;
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {daily.slice(0, 7).map((d) => (
        <div key={d.dt} className="p-3 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="text-xs text-slate-500">{dateFromUnix(d.dt)}</div>
          <img
            src={`https://openweathermap.org/img/wn/${d.weather?.[0]?.icon}@2x.png`}
            alt={d.weather?.[0]?.description}
            className="w-12 h-12"
          />
          <div className="text-sm font-semibold">{Math.round(d.temp.day)}°</div>
          <div className="text-xs text-slate-400">min {Math.round(d.temp.min)}° / max {Math.round(d.temp.max)}°</div>
        </div>
      ))}
    </div>
  );
}
