import React, { useEffect } from "react";
import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
  const { data, loading, error, fetchByCity, refresh, fetchByCoords } = useWeather();

  // optional: try geolocation on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude, "Your Location"),
        () => {} // ignore permission errors; user can search
      );
    }
  }, [fetchByCoords]);

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-600">Weather Dashboard</h1>
          <div className="text-slate-500">displays current weather conditions and forecasts</div>
        </div>
        <SearchBar onSearch={fetchByCity} />
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          {/* hero card showing illustration (put your hero.png into public/assets) */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-100 to-pink-100 p-6 mb-6">
            <img src="/assets/hero.png" alt="hero" className="w-full rounded-xl shadow" />
          </div>

          <WeatherCard data={data} loading={loading} onRefresh={refresh} />
          <Forecast daily={data?.oneCall?.daily} />
        </section>

        <aside>
          <div className="bg-white p-4 rounded-2xl shadow mb-4">
            <h3 className="text-sm text-slate-500">Quick Stats</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs">Monthly Rainfall</div>
                <div className="font-semibold">45 mm</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs">Precipitation</div>
                <div className="font-semibold">27%</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-sm text-slate-500">Legend / Tips</h3>
            <ul className="mt-3 text-sm text-slate-600 space-y-2">
              <li>- Use search to find any city</li>
              <li>- Auto-refresh every 5 minutes</li>
              <li>- Click recent searches for quick access</li>
            </ul>
          </div>
        </aside>
      </main>

      <ErrorMessage message={error} />
    </div>
  );
}
