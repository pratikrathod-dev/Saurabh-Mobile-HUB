import { useEffect, useRef, useState } from "react";
import { videoFileError, videoDurationError } from "../utils/videoReviews";

export function useVideoFeedback() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const ownedUrl = useRef(null);
  const input = useRef(null);
  useEffect(
    () => () => {
      if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current);
    },
    [],
  );
  useEffect(() => {
    if (!preview || !checking) return;
    const timer = setTimeout(() => {
      setChecking(false);
      setError("We couldn’t read this video. Try an MP4 file.");
    }, 12000);
    return () => clearTimeout(timer);
  }, [preview, checking]);
  const clear = () => {
    if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current);
    ownedUrl.current = null;
    setPreview("");
    setFile(null);
    setError("");
    setChecking(false);
    if (input.current) input.current.value = "";
  };
  const select = (event) => {
    const next = event.target.files?.[0];
    clear();
    if (!next) return;
    const problem = videoFileError(next);
    if (problem) {
      setError(problem);
      return;
    }
    ownedUrl.current = URL.createObjectURL(next);
    setFile(next);
    setPreview(ownedUrl.current);
    setChecking(true);
  };
  const metadataLoaded = (event) => {
    if (event.currentTarget.src !== ownedUrl.current) return;
    setChecking(false);
    setError(videoDurationError(event.currentTarget.duration));
  };
  const mediaFailed = () => {
    setChecking(false);
    setError("Your browser cannot preview this file. Try an MP4 video.");
  };
  const transfer = () => {
    const value = { videoSrc: preview, fileName: file.name };
    // Transfer blob ownership to session state. A backend must handle real storage and moderation later.
    ownedUrl.current = null;
    setPreview("");
    setFile(null);
    setError("");
    setChecking(false);
    return value;
  };
  return {
    input,
    preview,
    file,
    error,
    checking,
    select,
    clear,
    metadataLoaded,
    mediaFailed,
    transfer,
  };
}
