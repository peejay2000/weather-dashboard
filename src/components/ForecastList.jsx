export default function ForecastList({ daily }) {
  if (!daily) return null;
  const rows = daily.time.map((t, i) => ({
    date: t,
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
  }));

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      {rows.map(r => (
        <div key={r.date} className="p-3 bg-white rounded shadow-sm text-sm">
          <div className="font-medium">{new Date(r.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          <div className="text-xs text-gray-500">Max {Math.round(r.max)}° • Min {Math.round(r.min)}°</div>
          <div className="text-xs text-gray-400 mt-1">Sunrise: {new Date(r.sunrise).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
          <div className="text-xs text-gray-400">Sunset: {new Date(r.sunset).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
        </div>
      ))}
    </div>
  );
}
