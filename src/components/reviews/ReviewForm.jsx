import { useState } from "react";
import { Star } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { products } from "../../data/products";
const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
export default function ReviewForm({ productId = "" }) {
  const { setReviews, notify } = useStore();
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
    notify("Thank you! Your feedback has been added on this device.");
    form.reset();
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
        >
          {labels.map((label, i) => (
            <button
              key={label}
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
          required
          aria-invalid={!!errors.text}
        />
        {errors.text && (
          <span className="form-error" role="alert">
            {errors.text}
          </span>
        )}
      </label>
      <button className="button" type="submit">
        Share your feedback <span>↗</span>
      </button>
    </form>
  );
}
