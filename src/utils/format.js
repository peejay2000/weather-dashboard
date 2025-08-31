export const timeFromUnix = (ts, locale = undefined) =>
  new Date(ts * 1000).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

export const dateFromUnix = (ts) =>
  new Date(ts * 1000).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
