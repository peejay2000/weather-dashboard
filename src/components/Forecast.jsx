import { dateFromUnix } from "../utils/format";

export default function Forecast({ forecast }) {
  if (!forecast?.list?.length) return null;

  // Group forecast by day
  const days = {};
  forecast.list.forEach((f) => {
    const date = f.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(f);
  });

  const daily = Object.keys(days).map((date) => {
    const entries = days[date];
    const temps = entries.map((e) => e.main.temp);
    return {
      dt: entries[0].dt,
      temp: {
        day: temps.reduce((a, b) => a + b, 0) / temps.length,
        min: Math.min(...temps),
        max: Math.max(...temps),
      },
      weather: [entries[0].weather[0]],
    };
  });

  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {daily.slice(0, 5).map((d) => (
        <div key={d.dt} className="p-3 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="text-xs text-slate-500">{dateFromUnix(d.dt)}</div>
          <img
            src={`https://openweathermap.org/img/wn/${d.weather?.[0]?.icon}@2x.png`}
            alt={d.weather?.[0]?.description}
            className="w-12 h-12"
          />
          <div className="text-sm font-semibold">{Math.round(d.temp.day)}°</div>
          <div className="text-xs text-slate-400">
            min {Math.round(d.temp.min)}° / max {Math.round(d.temp.max)}°
          </div>
        </div>
      ))}
    </div>
  );
}
