const BASE = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch current weather for a city
 * Returns { name, coord, main, wind, weather, sys }
 */
export async function fetchCurrentWeather(city, apiKey) {
  if (!apiKey) throw new Error("Missing API key");

  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Invalid API response");
  }

  if (!res.ok) {
    throw new Error(json?.message || "City not found");
  }

  return json;
}

/**
 * Fetch 5-day / 3-hour forecast by coordinates
 * Returns { list: [ { dt, main, wind, weather, dt_txt } ] }
 */
export async function fetchForecast(lat, lon, apiKey) {
  if (!apiKey) throw new Error("Missing API key");

  const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Invalid API response");
  }

  if (!res.ok) {
    throw new Error(json?.message || "Failed to fetch forecast");
  }

  return json;
}
