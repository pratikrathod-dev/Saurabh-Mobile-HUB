export const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 30;

export function cleanInstagramUrl(value) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["instagram.com", "www.instagram.com"].includes(url.hostname) ||
      url.port || url.username || url.password ||
      !/^\/reel\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)
    ) return null;
    return `https://www.instagram.com${url.pathname.replace(/\/?$/, "/")}`;
  } catch {
    return null;
  }
}

// Public helper used by catalog entries, cards, and modal embed URLs.
export const cleanUrl = cleanInstagramUrl;

export function instagramEmbedUrl(url) {
  const canonical = cleanUrl(url);
  return canonical ? `${canonical}embed` : null;
}

export function videoFileError(file) {
  if (!file) return "";
  if (
    !/\.(mp4|mov)$/i.test(file.name) ||
    (file.type && !["video/mp4", "video/quicktime"].includes(file.type))
  ) {
    return "Choose an MP4 or MOV video.";
  }
  if (file.size > MAX_VIDEO_BYTES) return "Keep your video under 30 MB.";
  if (file.size === 0) return "This file is empty. Choose another video.";
  return "";
}

export function videoDurationError(duration) {
  if (!Number.isFinite(duration) || duration <= 0)
    return "We couldn’t read this video. Try an MP4 file.";
  return duration > MAX_VIDEO_SECONDS
    ? "Keep your video to 30 seconds or less."
    : "";
}
