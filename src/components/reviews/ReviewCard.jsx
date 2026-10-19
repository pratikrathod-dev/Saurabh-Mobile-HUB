import { Stars } from "../ui/Common";
export default function ReviewCard({ review: r }) {
  return (
    <article className="review-card">
      <div className="review-top">
        <div className="review-author">
          <span className="avatar">
            {r.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <strong>{r.name}</strong>
            <small>
              {r.demo
                ? "Sample customer review"
                : "Community review · saved on this device"}
            </small>
          </div>
        </div>
        <time dateTime={r.date}>
          {new Date(r.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
      <Stars rating={r.rating} />
      <p>{r.text}</p>
    </article>
  );
}
