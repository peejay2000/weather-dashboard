import { useCallback, useEffect, useRef, useState } from "react";

// Base URL for Open-Meteo
const BASE = "https://api.open-meteo.com/v1/forecast";

// ✅ Fetch current weather by coordinates
async function fetchCurrentWeather(lat, lon) {
  const url = `${BASE}?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  return res.json();
}

// ✅ Fetch forecast (next 7 days) by coordinates
async function fetchForecast(lat, lon) {
  const url = `${BASE}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast data");
  return res.json();
}

// ✅ Fetch coordinates by city name using Open-Meteo Geocoding API
async function fetchCoords(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cityName
  )}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch coordinates");
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error("City not found");
  return data.results[0]; // { latitude, longitude, name, country }
}

export default function useWeather() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // ✅ Fetch by city name
  const fetchByCity = useCallback(async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    try {
      const location = await fetchCoords(cityName);
      const current = await fetchCurrentWeather(
        location.latitude,
        location.longitude
      );
      const oneCall = await fetchForecast(location.latitude, location.longitude);

      setData({
        current: {
          name: location.name,
          sys: { country: location.country },
          coord: { lat: location.latitude, lon: location.longitude },
          main: { temp: current.current_weather.temperature },
          wind: { speed: current.current_weather.windspeed },
          weather: [{ description: "Current Weather", icon: "" }],
        },
        oneCall,
      });

      setCity(location.name);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch by coordinates (used for geolocation)
  const fetchByCoords = useCallback(async (lat, lon, name = "Your Location") => {
    setLoading(true);
    setError(null);
    try {
      const current = await fetchCurrentWeather(lat, lon);
      const oneCall = await fetchForecast(lat, lon);

      setData({
        current: {
          name,
          sys: { country: "" },
          coord: { lat, lon },
          main: { temp: current.current_weather.temperature },
          wind: { speed: current.current_weather.windspeed },
          weather: [{ description: "Current Weather", icon: "" }],
        },
        oneCall,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Auto-refresh every 5 minutes
  const refresh = useCallback(() => {
    if (city) {
      fetchByCity(city);
    }
  }, [city, fetchByCity]);

  useEffect(() => {
    intervalRef.current = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [refresh]);

  return { data, loading, error, fetchByCity, fetchByCoords, refresh };
}
