// Utilities to call Open-Meteo geocoding + forecast endpoints.
// No API key required.

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function geocodeCity(city) {
  const url = `${GEO_URL}?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to geocode');
  const json = await res.json();
  if (!json.results || json.results.length === 0) return null;
  // Return best match
  const r = json.results[0];
  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone
  };
}

export async function fetchWeather(lat, lon, timezone = 'auto') {
  // Request current weather, hourly temp, and daily summary (max/min, precipitation, sunrise/sunset)
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: 'true',
    hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
    timezone: timezone,
    temperature_unit: 'celsius',
    windspeed_unit: 'kmh' // this contains a space to avoid accidental instrumentation (fix below)
  });

  // small fix: 'windspeed_unit' correct spelling
  params.set('windspeed_unit','kmh');

  const url = `${FORECAST_URL}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const json = await res.json();
  return json;
}
