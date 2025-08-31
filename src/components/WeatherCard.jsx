import TemperatureChart from "./TemperatureChart";
import { timeFromUnix } from "../utils/format";


export default function WeatherCard({ data, loading, onRefresh }) {
  if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">Search for a city to see weather.</div>;

  const { current, oneCall } = data;
  const weather = current.weather?.[0] || oneCall?.current?.weather?.[0] || {};
  const icon = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  const temp = Math.round(current.main?.temp ?? oneCall?.current?.temp ?? 0);
  const humidity = current.main?.humidity ?? oneCall?.current?.humidity ?? 0;
  const wind = current.wind?.speed ?? oneCall?.current?.wind_speed ?? 0;
  const sunrise = oneCall?.current?.sunrise || current.sys?.sunrise;
  const sunset = oneCall?.current?.sunset || current.sys?.sunset;
  const uvi = oneCall?.current?.uvi ?? "—";

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {current.name}
            {current.sys?.country ? `, ${current.sys.country}` : ""}
          </h2>
          <div className="text-slate-500">{weather.description || ""}</div>
        </div>

        <div className="flex items-center gap-4">
          {icon && (
            <img src={icon} alt={weather.description} className="w-20 h-20" />
          )}
          <div className="text-4xl font-bold">{temp}°</div>
          <div className="text-sm text-slate-500">{wind} m/s</div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">Humidity</div>
          <div className="text-lg font-semibold">{humidity}%</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">UV Index</div>
          <div className="text-lg font-semibold">{uvi}</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-50">
          <div className="text-xs text-slate-500">Sunrise / Sunset</div>
          <div className="text-sm">
            {sunrise ? timeFromUnix(sunrise) : "—"} /{" "}
            {sunset ? timeFromUnix(sunset) : "—"}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6">
        {oneCall?.hourly ? (
          <TemperatureChart hourly={oneCall.hourly.slice(0, 24)} />
        ) : (
          <div className="text-slate-500">No forecast data</div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onRefresh}
          className="px-3 py-1 rounded bg-indigo-50 text-indigo-600"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
