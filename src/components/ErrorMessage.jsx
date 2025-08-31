export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-red-50 text-red-700 border border-red-100 p-3 rounded shadow">
      <strong>Error:</strong> {message}
    </div>
  );
}
