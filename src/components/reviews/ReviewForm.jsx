import { useRef, useState } from "react";
import { Star } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { products } from "../../data/products";
import { useVideoFeedback } from "../../hooks/useVideoFeedback";
const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
export default function ReviewForm({ productId = "" }) {
  const { setReviews, notify, pendingVideoReviews, setPendingVideoReviews } =
    useStore();
  const video = useVideoFeedback();
  const ratingDrag = useRef(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0),
    [hover, setHover] = useState(0),
    [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget,
      data = new FormData(form);
    const name = data.get("name").trim(),
      text = data.get("text").trim(),
      next = {};
    if (name.length < 2) next.name = "Please enter at least 2 characters.";
    if (!rating) next.rating = "Choose a star rating.";
    if (text.length < 10)
      next.text = "Tell us a little more — at least 10 characters.";
    if (video.error) next.video = video.error;
    if (video.checking)
      next.video = "Please wait while we check the video length.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setReviews((old) => [
      {
        id: crypto.randomUUID(),
        name,
        rating,
        text,
        productId: productId || data.get("productId"),
        date: new Date().toISOString(),
        demo: false,
      },
      ...old,
    ]);
    if (video.preview) {
      const attachment = video.transfer();
      const pending = {
        id: crypto.randomUUID(),
        type: "mp4",
        customerName: name,
        caption: text,
        rating,
        productId: productId || data.get("productId") || undefined,
        date: new Date().toISOString(),
        verified: false,
        status: "pending",
        ...attachment,
      };
      setPendingVideoReviews((old) => [pending, ...old]);
      notify("Thanks! Your video will appear after the shop approves it.");
    } else notify("Thank you! Your feedback has been added on this device.");
    form.reset();
    setReviewText("");
    setRating(0);
  };
  return (
    <form className="review-form" onSubmit={submit} noValidate>
      <p className="eyebrow">YOUR EXPERIENCE MATTERS</p>
      <h2>Share a little feedback.</h2>
      <p className="muted">
        Help your neighbours find their next favourite. Reviews stay on this
        device.
      </p>
      <fieldset className="star-field">
        <legend>
          Your rating <span aria-hidden="true">*</span>
        </legend>
        <div
          className="star-selector"
          role="radiogroup"
          aria-label="Your star rating"
          aria-required="true"
          onMouseLeave={() => setHover(0)}
          onPointerDown={(event) => { ratingDrag.current = true; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={(event) => {
            if (!ratingDrag.current) return;
            const button = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-rating]");
            if (button && event.currentTarget.contains(button)) setRating(Number(button.dataset.rating));
          }}
          onPointerUp={(event) => {
            const button = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-rating]");
            if (button && event.currentTarget.contains(button)) setRating(Number(button.dataset.rating));
            ratingDrag.current = false;
          }}
          onPointerCancel={() => { ratingDrag.current = false; }}
        >
          {labels.map((label, i) => (
            <button
              key={label}
              data-rating={i + 1}
              type="button"
              role="radio"
              aria-checked={rating === i + 1}
              aria-label={`${i + 1} star${i ? "s" : ""}: ${label}`}
              tabIndex={rating === i + 1 || (!rating && i === 0) ? 0 : -1}
              onMouseEnter={() => setHover(i + 1)}
              onClick={() => setRating(i + 1)}
              onKeyDown={(e) => {
                if (
                  [
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowLeft",
                    "ArrowDown",
                    "Home",
                    "End",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                  const n =
                    e.key === "Home"
                      ? 1
                      : e.key === "End"
                        ? 5
                        : Math.min(
                            5,
                            Math.max(
                              1,
                              (rating || 1) +
                                (["ArrowRight", "ArrowUp"].includes(e.key)
                                  ? 1
                                  : -1),
                            ),
                          );
                  setRating(n);
                  e.currentTarget.parentElement.children[n - 1].focus();
                }
              }}
            >
              <Star
                size={29}
                fill={(hover || rating) > i ? "currentColor" : "none"}
              />
            </button>
          ))}
          <span>{labels[(hover || rating) - 1] || "Select a rating"}</span>
        </div>
        {errors.rating && (
          <span className="form-error" role="alert">
            {errors.rating}
          </span>
        )}
      </fieldset>
      <div className="form-grid">
        <label>
          Your name *
          <input
            name="name"
            autoComplete="name"
            placeholder="e.g. Rahul Patil"
            required
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <span className="form-error" role="alert">
              {errors.name}
            </span>
          )}
        </label>
        {!productId && (
          <label>
            Product (optional)
            <select name="productId">
              <option value="">Overall shop experience</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <label>
        Your review *
        <textarea
          name="text"
          rows="4"
          placeholder="What made your experience special?"
          minLength="10"
          maxLength="2000"
          value={reviewText}
          onChange={(event) => {
            setReviewText(event.target.value);
            event.target.style.height = "auto";
            event.target.style.height = Math.min(event.target.scrollHeight, 400) + "px";
          }}
          required
          aria-invalid={!!errors.text}
        />
        <small className="character-counter">{reviewText.length}/2000 characters</small>
        {errors.text && (
          <span className="form-error" role="alert">
            {errors.text}
          </span>
        )}
      </label>
      <fieldset className="video-upload-field">
        <legend>Add a video (optional)</legend>
        <label
          htmlFor={`feedback-video-${productId || "shop"}`}
          className="sr-only"
        >
          Choose an MP4 or MOV feedback video
        </label>
        <input
          ref={video.input}
          id={`feedback-video-${productId || "shop"}`}
          type="file"
          accept=".mp4,.mov,video/mp4,video/quicktime"
          onChange={video.select}
          aria-describedby={`video-help-${productId || "shop"}`}
          aria-invalid={!!video.error}
        />
        <p
          id={`video-help-${productId || "shop"}`}
          className="video-upload-note"
        >
          MP4 or MOV · Up to 30 MB · Up to 30 seconds. Local preview only;
          nothing is uploaded. Videos need shop approval before appearing.
        </p>
        {video.preview && (
          <div className="video-upload-preview">
            <video
              key={video.preview}
              src={video.preview}
              controls
              playsInline
              preload="metadata"
              aria-label="Your feedback video preview"
              onLoadedMetadata={video.metadataLoaded}
              onError={video.mediaFailed}
            />
            <button type="button" className="text-link" onClick={video.clear}>
              Remove video
            </button>
          </div>
        )}
        {video.checking && (
          <p role="status" className="video-upload-note">
            Checking video length…
          </p>
        )}
        {(video.error || errors.video) && (
          <p className="form-error" role="alert">
            {video.error || errors.video}
          </p>
        )}
        {pendingVideoReviews.length > 0 && (
          <p className="video-upload-note" role="status">
            {pendingVideoReviews.length} local video{" "}
            {pendingVideoReviews.length === 1 ? "is" : "are"} awaiting shop
            approval in this session. This is a demo queue; nothing has been
            sent.
          </p>
        )}
      </fieldset>
      <button
        className="button"
        type="submit"
        disabled={video.checking || !!video.error}
      >
        Share your feedback
      </button>
    </form>
  );
}
