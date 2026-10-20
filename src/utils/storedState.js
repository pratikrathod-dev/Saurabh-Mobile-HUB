const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
const text = value => typeof value === "string" && value.trim().length > 0;
const validEntry = {
  "smh-cart": item => record(item) && text(item.id) && typeof item.color === "string" && Number.isInteger(item.qty) && item.qty >= 1 && item.qty <= 10,
  "smh-wishlist": text,
  "smh-recent-products": text,
  "smh-recent-searches": text,
  "smh-reviews": item => record(item) && text(item.id) && text(item.name) && typeof item.text === "string" && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5 && typeof item.date === "string" && Number.isFinite(Date.parse(item.date)),
};

export function readStoredState(key, initial, storage) {
  try {
    // Accessing localStorage itself can throw when storage is blocked.
    const raw = (storage ?? globalThis.localStorage)?.getItem(key);
    if (raw == null) return initial;
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return initial;
    const clean = validEntry[key] ? value.filter(validEntry[key]) : value;
    return value.length && !clean.length ? initial : clean;
  } catch {
    return initial;
  }
}
