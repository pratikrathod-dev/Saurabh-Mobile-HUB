/** Resolve public files beneath Vite's configured base; Node tests default to /. */
export function publicAsset(path, base = import.meta.env?.BASE_URL ?? "/") {
  if (!path || /^(?:https?:|blob:|data:|\/\/)/i.test(path)) return path;
  const prefix = `${base.replace(/\/+$/, "")}/`;
  if (prefix !== "/" && path.startsWith(prefix)) return path;
  return `${prefix}${path.replace(/^\/+/, "")}`;
}
