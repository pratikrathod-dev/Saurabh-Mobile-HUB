import { publicAsset } from "../../utils/publicAsset";
// Glob patterns are compile-time source paths; runtime URLs include Vite's base.
const posters = new Set(
  Object.keys(
    import.meta.glob("/public/images/reels/*.{jpg,jpeg,png,webp}"),
  ).map((path) => publicAsset(path.replace("/public/", ""))),
);
const videos = new Set(
  Object.keys(import.meta.glob("/public/videos/**/*.mp4")).map((path) =>
    publicAsset(path.replace("/public/", "")),
  ),
);
export const availablePoster = (src) =>
  !!src && (posters.has(src) || /^https:\/\//.test(src));
export const availableVideo = (src) =>
  !!src && (videos.has(src) || src.startsWith("blob:"));
