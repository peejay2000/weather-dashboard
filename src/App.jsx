import React from "react";
import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
  const { data, loading, error, fetchByCity, useMyLocation, refresh, setError } = useWeather(5); // auto refresh every 5 min

  return (
    <div className="min-h-screen hero-bg p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-8 mb-6">
          <div>
            <div className="text-4xl font-bold text-indigo-600">Day - 34</div>
            <div className="text-2xl text-gray-500">Weather</div>
          </div>
          <div className="flex-1">
            <SearchBar onSearch={fetchByCity} onUseLocation={useMyLocation} loading={loading} />
          </div>
          <div>
            <button onClick={refresh} className="px-4 py-2 border rounded-lg">Refresh</button>
          </div>
        </header>

        {error && <ErrorMessage message={error} onClear={() => setError(null)} />}

        <main className="mt-6">
          <div className="weather-card p-6">
            {/* big hero illustration area (simple gradient + placeholder) */}
            <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'linear-gradient(90deg,#eaf2ff,#fff5f5)' }}>
              <div className="p-8">
                <h2 className="text-2xl font-semibold">Welcome to PeeJay Weather-Dashboard</h2>
                <p className="text-sm text-gray-600">Search a city to see current weather & forecast</p>
              </div>
            </div>

            {data ? (
              <>
                <WeatherCard weather={data} />
                <ForecastList daily={data.daily} />
              </>
            ) : (
              <div className="text-gray-500 p-12 text-center">Search a city or use your location to start.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
