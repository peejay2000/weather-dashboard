import React from "react";
import Sparkline from "./Sparkline";

/* Map Open-Meteo weathercode to icon + description */
const codeMap = {
  0: { label: "Clear", icon: '☀️' },
  1: { label: "Mainly clear", icon: '🌤' },
  2: { label: "Partly cloudy", icon: '⛅️' },
  3: { label: "Overcast", icon: '☁️' },
  45: { label: "Fog", icon: '🌫️' },
  48: { label: "Depositing rime fog", icon: '🌫️' },
  51: { label: "Light drizzle", icon: '🌦️' },
  53: { label: "Moderate drizzle", icon: '🌦️' },
  55: { label: "Dense drizzle", icon: '🌧️' },
  61: { label: "Slight rain", icon: '🌧️' },
  63: { label: "Moderate rain", icon: '🌧️' },
  65: { label: "Heavy rain", icon: '⛈️' },
  71: { label: "Light snow", icon: '🌨️' },
  73: { label: "Moderate snow", icon: '❄️' },
  75: { label: "Heavy snow", icon: '❄️' },
  80: { label: "Rain showers", icon: '🌦️' },
  81: { label: "Moderate showers", icon: '🌧️' },
  82: { label: "Violent showers", icon: '⛈️' },
  95: { label: "Thunderstorm", icon: '⛈️' },
  99: { label: "Severe storm", icon: '🌩️' },
};

function formatDateTime(isoString, tz) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const { place, current, hourly, daily } = weather;
  const { temperature: temp, windspeed, weathercode: code, time } = current;
  // Find humidity from hourly arrays: we take the hour matching current time
  let humidity = null;
  if (hourly && hourly.relativehumidity_2m) {
    const idx = hourly.time.indexOf(time);
    if (idx >= 0) humidity = hourly.relativehumidity_2m[idx];
  }

  // Build 24-hour sparkline from hourly.temperature_2m (take next 24)
  const nowIdx = hourly?.time?.indexOf(time) ?? 0;
  const temps24 = hourly?.temperature_2m?.slice(nowIdx, nowIdx + 24) ?? [];

  const wc = codeMap[code] || { label: 'Unknown', icon: '❓' };

  // daily summary array
  const days = (daily?.time || []).map((d, i) => ({
    date: daily.time[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    precip: daily.precipitation_sum ? daily.precipitation_sum[i] : 0
  }));

  return (
    <div className="weather-card p-6">
      <div className="flex justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{Math.round(temp)}°</div>
            <div>
              <div className="text-lg font-semibold">{place}</div>
              <div className="text-sm text-gray-500">{wc.label} • Updated {formatDateTime(time)}</div>
            </div>
            <div className="ml-4 text-3xl">{wc.icon}</div>
            <div className="ml-auto text-sm text-gray-600">
              Wind: {Math.round(windspeed)} km/h<br/>
              Humidity: {humidity ?? '—'}%
            </div>
          </div>

          <div className="mt-6">
            <Sparkline values={temps24} width={560} height={80} />
          </div>
        </div>

        <div className="w-72 border-l pl-6">
          <div className="text-sm font-medium mb-3">Monthly Rainfall</div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white p-3 rounded-lg mb-6">
            <div className="text-sm">This month</div>
            <div className="text-2xl font-bold">45mm</div>
            <div className="text-xs">+17% vs last year</div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">7-Day Forecast</div>
            <div className="space-y-2">
              {days.slice(0,7).map(d => (
                <div key={d.date} className="flex justify-between text-sm text-gray-700">
                  <div>{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div>{Math.round(d.max)}° / {Math.round(d.min)}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
