const BASE = "https://api.open-meteo.com/v1/forecast";

// Current weather
export async function fetchCurrentWeather(lat, lon) {
  const url = `${BASE}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  const data = await res.json();

  return {
    name: `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`, // no real city name from API
    coord: { lat, lon },
    sys: { country: "" },
    main: {
      temp: data.current_weather?.temperature ?? 0,
      humidity: data.current_weather?.relativehumidity_2m ?? 0,
    },
    wind: { speed: data.current_weather?.windspeed ?? 0 },
    weather: [
      {
        description: `Weather code: ${data.current_weather?.weathercode ?? "N/A"}`,
        icon: null,
      },
    ],
    raw: data,
  };
}

// 7-day forecast
export async function fetchForecast(lat, lon) {
  const url = `${BASE}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast data");
  const data = await res.json();

  return {
    daily: data.daily,
    raw: data,
  };
}
