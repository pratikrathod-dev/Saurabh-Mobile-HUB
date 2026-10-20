import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { videoPlayback } from "../../utils/videoPlayback";
import { availableVideo, availablePoster } from "./videoAssets";

export default function AutoPlayVideo({ review, active = true, onUnavailable }) {
  const frame = useRef(null),
    player = useRef(null);
  const permission = useRef(false);
  const reducedMotion = useReducedMotion();
  const [shouldPlay, setShouldPlay] = useState(false),
    [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false),
    [failed, setFailed] = useState(false),
    [posterFailed, setPosterFailed] = useState(false);
  const hasVideo = availableVideo(review.videoSrc),
    hasPoster = availablePoster(review.poster) && !posterFailed;

  useEffect(() => {
    const registration = videoPlayback.register((allowed) => {
      permission.current = allowed;
      if (!allowed) player.current?.pause();
      setShouldPlay(allowed);
    });
    const media = window.matchMedia("(max-width: 767px)");
    const environment = () =>
      videoPlayback.setEnvironment(media.matches, document.hidden);
    environment();
    media.addEventListener("change", environment);
    document.addEventListener("visibilitychange", environment);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              registration.update(
                entry.intersectionRatio,
                hasVideo && active && !reducedMotion && !blocked && !failed,
              );
            },
            { threshold: 0.6 },
          );
    if (observer && frame.current) observer.observe(frame.current);
    return () => {
      observer?.disconnect();
      registration.remove();
      media.removeEventListener("change", environment);
      document.removeEventListener("visibilitychange", environment);
    };
  }, [hasVideo, active, reducedMotion, blocked, failed]);

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    let cancelled = false;
    permission.current = shouldPlay && active && !reducedMotion && !blocked && !failed;
    if (shouldPlay && active && !reducedMotion && !blocked && !failed) {
      try {
        const request = video.play();
        request
          ?.then(() => {
            if (cancelled && !permission.current) video.pause();
          })
          .catch((error) => {
            if (!cancelled && error?.name !== "AbortError") {
              video.pause();
              setBlocked(true);
              setPlaying(false);
            }
          });
      } catch {
        video.pause();
        setBlocked(true);
        setPlaying(false);
      }
    } else video.pause();
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [shouldPlay, active, reducedMotion, blocked, failed]);

  const toggleMute = () => {
    const next = !muted;
    if (player.current) player.current.muted = next;
    setMuted(next);
  };
  return (
    <div
      ref={frame}
      className={`autoplay-video ${playing ? "is-playing" : ""}`}
    >
      {hasPoster && (
        <img
          className="video-review-poster"
          src={review.poster}
          alt={`${review.customerName}’s video review cover`}
          loading="lazy"
          width="450"
          height="800"
          onError={() => {
            setPosterFailed(true);
            onUnavailable?.();
          }}
        />
      )}
      {hasVideo && !failed && (
        <video
          ref={player}
          src={review.videoSrc}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          poster={hasPoster ? review.poster : undefined}
          className={ready && !blocked ? "is-ready" : ""}
          aria-label={`Autoplay preview of ${review.customerName}’s video review`}
          onLoadedData={() => setReady(true)}
          onPlaying={() => {
            setReady(true);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onError={() => {
            player.current?.pause();
            setFailed(true);
            setPlaying(false);
            onUnavailable?.();
          }}
        />
      )}
      {hasVideo && active && !failed && !reducedMotion && (
        <button
          type="button"
          className="video-mute"
          aria-label={`${muted ? "Unmute" : "Mute"} video by ${review.customerName}`}
          aria-pressed={!muted}
          onClick={toggleMute}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </div>
  );
}
