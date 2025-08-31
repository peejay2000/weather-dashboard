// simple helper to format temperature values
export function formatTemp(temp) {
  if (temp == null) return "--°C";
  return `${Math.round(temp)}°C`;
}
