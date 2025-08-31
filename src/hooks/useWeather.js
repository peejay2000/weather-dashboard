import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCurrentWeather, fetchOneCall } from "../api/weather";

export default function useWeather() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [city, setCity] = useState(null);
  const [data, setData] = useState(null); // { current, oneCall }
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
        const oneCall = await fetchOneCall(coord.lat, coord.lon, apiKey);
        setData({ current, oneCall });
        setCity(cityName);

        // save recent
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

  // manual refresh
  const refresh = useCallback(() => {
    if (city) fetchByCity(city);
  }, [city, fetchByCity]);

  // auto refresh every 5 minutes
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (city) fetchByCity(city);
    }, 5 * 60 * 1000); // 5 mins
    return () => clearInterval(intervalRef.current);
  }, [city, fetchByCity]);

  // geolocation helper to fetch current location on load (optional)
  const fetchByCoords = useCallback(
    async (lat, lon, cityNameFallback = "Current Location") => {
      setLoading(true);
      setError(null);
      try {
        const oneCall = await fetchOneCall(lat, lon, apiKey);
        // build a 'current' that mimics fetchCurrentWeather minimal fields
        const current = {
          name: cityNameFallback,
          coord: { lat, lon },
          sys: { country: "" },
          main: { temp: oneCall.current.temp, humidity: oneCall.current.humidity },
          wind: { speed: oneCall.current.wind_speed },
          weather: oneCall.current.weather,
        };
        setData({ current, oneCall });
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
