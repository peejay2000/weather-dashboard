import { useEffect, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("recentSearches") || "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (!q?.trim()) return;
    onSearch(q.trim());
    setQ("");
    // recent will be updated by hook
    setTimeout(() => setRecent(JSON.parse(localStorage.getItem("recentSearches") || "[]")), 200);
  };

  return (
    <form onSubmit={submit} className="relative flex items-center gap-2">
      <input
        className="px-4 py-2 rounded-lg border w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Enter city name..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search city"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Search
      </button>

      {recent.length > 0 && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow p-2 w-64 z-10">
          <div className="text-xs text-slate-500 px-1">Recent</div>
          {recent.map((r) => (
            <button
              key={r}
              onClick={() => onSearch(r)}
              className="w-full text-left px-2 py-1 rounded hover:bg-slate-50"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
