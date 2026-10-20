import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Stars } from "../components/ui/Common";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewCard from "../components/reviews/ReviewCard";
import VideoReviewCarousel from "../components/reviews/VideoReviewCarousel";
export default function Reviews() {
  const { reviews } = useStore();
  const [view, setView] = useState("Written Reviews");
  const [rating, setRating] = useState(0),
    [sort, setSort] = useState("newest");
  const avg =
    reviews.reduce((n, r) => n + r.rating, 0) / Math.max(1, reviews.length);
  const list = reviews
    .filter((r) => !rating || r.rating === rating)
    .sort((a, b) =>
      sort === "highest"
        ? b.rating - a.rating
        : new Date(b.date) - new Date(a.date),
    );
  return (
    <>
      <div className="container inner-page">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>Reviews
        </div>
        <div className="page-heading">
          <p className="eyebrow">YOUR TRUST MEANS EVERYTHING</p>
          <h1>A little local love.</h1>
          <p>Honest words, happy upgrades, and stories from our community.</p>
        </div>
        <div
          className="tabs review-view-tabs"
          role="tablist"
          aria-label="Review format"
        >
          {["Written Reviews", "Video Reviews"].map((tab, index) => (
            <button
              key={tab}
              id={`review-format-${index}`}
              role="tab"
              aria-selected={view === tab}
              aria-controls={`review-format-panel-${index}`}
              tabIndex={view === tab ? 0 : -1}
              onClick={() => setView(tab)}
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 1
                        : 1 - index;
                  setView(next === 0 ? "Written Reviews" : "Video Reviews");
                  event.currentTarget.parentElement.children[next].focus();
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {view === "Written Reviews" ? (
          <div
            role="tabpanel"
            id="review-format-panel-0"
            aria-labelledby="review-format-0"
          >
            <p className="demo-notice">
              Seed reviews are illustrative samples. New feedback is stored only
              in your browser.
            </p>
            <div className="reviews-layout">
              <div>
                <section className="review-overview">
                  <div>
                    <strong>
                      {avg.toFixed(1)}
                      <small>/ 5</small>
                    </strong>
                    <Stars rating={avg} />
                    <p>Based on {reviews.length} reviews</p>
                  </div>
                  <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((n) => {
                      const count = reviews.filter(
                        (r) => r.rating === n,
                      ).length;
                      return (
                        <button
                          key={n}
                          onClick={() => setRating((r) => (r === n ? 0 : n))}
                          aria-pressed={rating === n}
                        >
                          <span>{n} ★</span>
                          <span className="rating-track">
                            <i
                              style={{
                                width: `${(count / reviews.length) * 100}%`,
                              }}
                            />
                          </span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
                <div className="review-toolbar">
                  <label>
                    Show
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="0">All ratings</option>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option value={n} key={n}>
                          {n} stars
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Sort
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="newest">Newest first</option>
                      <option value="highest">Highest rated</option>
                    </select>
                  </label>
                </div>
                <div className="review-list">
                  {list.length ? (
                    list.map((r) => <ReviewCard key={r.id} review={r} />)
                  ) : (
                    <p className="empty">No reviews at this rating yet.</p>
                  )}
                </div>
              </div>
              <aside>
                <ReviewForm />
              </aside>
            </div>
          </div>
        ) : (
          <div
            role="tabpanel"
            id="review-format-panel-1"
            aria-labelledby="review-format-1"
          >
            <VideoReviewCarousel contained title="Video Reviews" />
            <div className="video-feedback-form">
              <ReviewForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
