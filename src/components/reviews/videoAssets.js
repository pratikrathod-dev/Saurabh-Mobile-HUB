// Keep missing local assets in a useful poster/link state rather than requesting Vite's SPA fallback as video.
const posters = new Set(
  Object.keys(
    import.meta.glob("/public/images/reels/*.{jpg,jpeg,png,webp}"),
  ).map((path) => path.replace("/public", "")),
);
const videos = new Set(
  Object.keys(import.meta.glob("/public/videos/**/*.mp4")).map((path) =>
    path.replace("/public", ""),
  ),
);
export const availablePoster = (src) =>
  !!src && (posters.has(src) || /^https:\/\//.test(src));
export const availableVideo = (src) =>
  !!src && (videos.has(src) || src.startsWith("blob:"));
