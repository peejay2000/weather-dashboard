const BASE = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch current weather for a city (returns the "weather" object with coord)
 */
export async function fetchCurrentWeather(city, apiKey) {
  if (!apiKey) throw new Error("Missing API key");
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "City not found");
  }
  return res.json();
}

/**
 * Fetch One Call data by lat/lon (hourly + daily + current includes uvi)
 */
export async function fetchOneCall(lat, lon, apiKey, exclude = "minutely") {
  if (!apiKey) throw new Error("Missing API key");
  const url = `${BASE}/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Forecast fetch failed");
  }
  return res.json();
}
