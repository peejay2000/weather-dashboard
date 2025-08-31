export default function ErrorMessage({ message, onClear }) {
  if (!message) return null;
  return (
    <div className="p-3 bg-red-50 border border-red-100 rounded text-red-700">
      <div className="flex justify-between items-center">
        <div>{message}</div>
        <button onClick={onClear} className="ml-3 text-sm underline">Dismiss</button>
      </div>
    </div>
  );
}
