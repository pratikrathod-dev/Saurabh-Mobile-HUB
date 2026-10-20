import { memo, useState } from "react";
import { Play, Instagram } from "lucide-react";
import { Stars } from "../ui/Common";
import { cleanUrl } from "../../utils/videoReviews";
import { availablePoster, availableVideo } from "./videoAssets";
import AutoPlayVideo from "./AutoPlayVideo";

function VideoReviewCard({ review, centered, interactive, offset, onSelect, onPlay }) {
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const poster = !posterFailed && availablePoster(review.poster);
  const localVideo = interactive && !videoFailed && availableVideo(review.videoSrc);
  const instagramUrl = cleanUrl(review.instagramUrl);
  return (
    <article className={`video-review-card ${centered ? "is-center" : ""}`}>
      <div className="video-card-media">
        {poster ? (
          <img src={review.poster} alt={`${review.customerName}, customer video review cover`}
            loading="lazy" width="720" height="1280" className="video-review-poster"
            onError={() => setPosterFailed(true)} />
        ) : (
          <div className="video-poster-fallback" aria-hidden="true">
            <span>{review.customerName.trim().charAt(0).toUpperCase()}</span>
          </div>
        )}
        {localVideo && <AutoPlayVideo review={review} active={centered} onUnavailable={() => setVideoFailed(true)} />}
        <span className="video-media-shade" aria-hidden="true" />
        <button type="button" className="video-card-open" tabIndex={interactive ? 0 : -1}
          onClick={(event) => centered ? onPlay(review, event.currentTarget) : onSelect(offset)}
          aria-label={`${centered ? "Play" : "Center"} video review by ${review.customerName}: ${review.caption}`}>
          <span className="video-play" aria-hidden="true"><Play size={27} fill="currentColor" /></span>
        </button>
      </div>
      <div className="video-card-copy">
        <div className="video-card-info">
          <strong title={review.customerName}>{review.customerName}</strong>
          <Stars rating={review.rating} />
        </div>
        {instagramUrl && (
          <a className="video-card-instagram" href={instagramUrl} target="_blank" rel="noreferrer"
            tabIndex={interactive ? 0 : -1} aria-label={`Watch ${review.customerName}’s review on Instagram`}>
            <Instagram size={19} aria-hidden="true" />
          </a>
        )}
        {centered && <p className="video-card-caption">{review.caption}</p>}
      </div>
    </article>
  );
}
export default memo(VideoReviewCard);

