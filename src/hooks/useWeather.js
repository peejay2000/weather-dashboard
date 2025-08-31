import { useEffect, useRef, useState } from "react";
import { geocodeCity, fetchWeather } from "../api/weatherApi";

export default function useWeather(autoRefreshMinutes = 5) {
  const [data, setData] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchRef = useRef(null);
  const timerRef = useRef(null);

  const _loadByCoords = async (lat, lon, label) => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchWeather(lat, lon, 'auto');
      setData({
        place: label || `${lat.toFixed(3)},${lon.toFixed(3)}`,
        lat,
        lon,
        timezone: json.timezone,
        current: json.current_weather,
        hourly: json.hourly,
        daily: json.daily
      });
      setCoords({ lat, lon });
      lastFetchRef.current = Date.now();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  async function fetchByCity(city) {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const place = await geocodeCity(city);
      if (!place) {
        setError('City not found');
        setLoading(false);
        return;
      }
      const label = `${place.name}, ${place.country || ''}`.trim();
      await _loadByCoords(place.latitude, place.longitude, label);
      // store recent searches
      const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const updated = [label, ...recent.filter(r => r !== label)].slice(0, 6);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (err) {
      setError(err.message || 'Error searching city');
      setLoading(false);
    }
  }

  async function fetchByCoords(lat, lon, label) {
    await _loadByCoords(lat, lon, label);
  }

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await _loadByCoords(pos.coords.latitude, pos.coords.longitude, 'Your location');
      },
      (err) => {
        setError(err.message || 'Unable to get location');
        setLoading(false);
      }
    );
  }

  function refresh() {
    if (!coords) return;
    fetchByCoords(coords.lat, coords.lon, data?.place);
  }

  // Auto refresh
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      // only refresh if we've fetched before
      if (coords) refresh();
    }, autoRefreshMinutes * 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, [coords, autoRefreshMinutes]);

  return {
    data,
    loading,
    error,
    fetchByCity,
    fetchByCoords,
    refresh,
    useMyLocation,
    setError
  };
}
