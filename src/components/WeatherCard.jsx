import TemperatureChart from "./TemperatureChart";

export default function WeatherCard({ data, loading, onRefresh }) {
  if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">Search for a city to see weather.</div>;

  const { current, forecast } = data;
  const weather = current.weather?.[0] || {};
  const icon = weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null;

  const temp = Math.round(current.main?.temp);
  const humidity = current.main?.humidity;
  const wind = current.wind?.speed;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {current.name}{current.sys?.country ? `, ${current.sys.country}` : ""}
          </h2>
          <div className="text-slate-500">{weather.description || ""}</div>
        </div>

        <div className="flex items-center gap-4">
          {icon && <img src={icon} alt={weather.description} className="w-20 h-20" />}
          <div className="text-4xl font-bold">{temp}°</div>
          <div className="text-sm text-slate-500">{wind} m/s</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">Humidity</div>
          <div className="text-lg font-semibold">{humidity}%</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">Wind</div>
          <div className="text-lg font-semibold">{wind} m/s</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">Forecast Points</div>
          <div className="text-sm">{forecast.list.length}</div>
        </div>
      </div>

      <div className="mt-6">
        {/* Show first 8 intervals (~24h) */}
        <TemperatureChart hourly={forecast.list.slice(0, 8)} />
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={onRefresh} className="px-3 py-1 rounded bg-indigo-50 text-indigo-600">
          Refresh
        </button>
      </div>
    </div>
  );
}
