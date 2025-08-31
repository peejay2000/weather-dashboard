import React, { useEffect, useState } from "react";

export default function SearchBar({ onSearch, onUseLocation, loading }) {
  const [text, setText] = useState('');
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    setRecent(r);
  }, [loading]);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSearch(text.trim());
    setText('');
    const r = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    setRecent(r);
  }

  return (
    <div className="w-full flex items-center gap-4">
      <form onSubmit={submit} className="flex-1 flex gap-2">
        <input
          aria-label="Search city"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter city name..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="flex gap-2">
        <button onClick={onUseLocation} className="px-3 py-2 border rounded-lg">
          Use my location
        </button>
      </div>

      <div className="ml-3">
        {recent.length > 0 && (
          <div className="text-sm text-gray-500">
            Recent:
            <div className="flex flex-wrap gap-2 mt-1">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => onSearch(r)}
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
