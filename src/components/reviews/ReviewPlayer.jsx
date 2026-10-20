import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
export default function ReviewPlayer({ review }) {
  const player = useRef(null), [failed,setFailed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const video = player.current;
    // Explicit play also resumes after React Strict Mode's development cleanup.
    if (video && !reduced) video.play().catch(() => {});
    return () => video?.pause();
  }, [reduced]);
  if (failed) return <p role="status" className="video-embed-fallback">This video could not be played. Please close it and try again.</p>;
  return <video ref={player} src={review.videoSrc} poster={review.poster || undefined}
    autoPlay={!reduced} muted loop playsInline controls preload="metadata"
    onError={() => setFailed(true)} className="review-player-video"
    aria-label={`Video review by ${review.customerName}`}/>;
}

