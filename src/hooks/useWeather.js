import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCurrentWeather, fetchForecast } from "../api/weather";

export default function useWeather() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [city, setCity] = useState(null);
  const [data, setData] = useState(null); // { current, forecast }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByCity = useCallback(
    async (cityName) => {
      if (!cityName) return;
      setLoading(true);
      setError(null);
      try {
        const current = await fetchCurrentWeather(cityName, apiKey);
        const { coord } = current;
        const forecast = await fetchForecast(coord.lat, coord.lon, apiKey);
        setData({ current, forecast });
        setCity(cityName);

        // Save recent searches
        try {
          const prev = JSON.parse(localStorage.getItem("recentSearches") || "[]");
          const updated = [cityName, ...prev.filter((s) => s !== cityName)].slice(0, 6);
          localStorage.setItem("recentSearches", JSON.stringify(updated));
        } catch (e) {}
      } catch (err) {
        setError(err.message || "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  const refresh = useCallback(() => {
    if (city) fetchByCity(city);
  }, [city, fetchByCity]);

  // Auto refresh every 5 minutes
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (city) fetchByCity(city);
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [city, fetchByCity]);

  // Fetch by coordinates (geolocation)
  const fetchByCoords = useCallback(
    async (lat, lon, cityNameFallback = "Current Location") => {
      setLoading(true);
      setError(null);
      try {
        const forecast = await fetchForecast(lat, lon, apiKey);
        const current = {
          name: cityNameFallback,
          coord: { lat, lon },
          sys: { country: "" },
          main: forecast.list[0].main,
          wind: forecast.list[0].wind,
          weather: forecast.list[0].weather,
        };
        setData({ current, forecast });
        setCity(cityNameFallback);
      } catch (err) {
        setError(err.message || "Failed to fetch by coords");
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  return { city, data, loading, error, fetchByCity, refresh, fetchByCoords };
}
