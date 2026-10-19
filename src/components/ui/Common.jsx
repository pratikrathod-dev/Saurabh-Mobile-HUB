import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag, MessageCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { whatsappUrl } from "../../data/shopInfo";
export const Stars = ({ rating = 5 }) => (
  <span className="stars" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={13}
        fill={i <= Math.round(rating) ? "currentColor" : "none"}
      />
    ))}
  </span>
);
export const SectionTitle = ({
  eyebrow,
  title,
  link,
  to = "/shop",
  children,
}) => (
  <div className="section-heading">
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
    </div>
    {children ||
      (link && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowRight size={16} />
        </Link>
      ))}
  </div>
);
export const Empty = ({
  title = "Nothing here yet",
  text = "Your next favourite is waiting to be discovered.",
  action = "Explore the shop",
  to = "/shop",
}) => (
  <div className="empty">
    <ShoppingBag size={44} strokeWidth={1} />
    <h2>{title}</h2>
    <p>{text}</p>
    <Link className="button" to={to}>
      {action}
      <ArrowRight size={16} />
    </Link>
  </div>
);
export function WhatsAppButton({
  message,
  children = "Enquire on WhatsApp",
  className = "button outline",
}) {
  const { notify } = useStore();
  const url = whatsappUrl(message);
  return url ? (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      <MessageCircle size={18} />
      {children}
    </a>
  ) : (
    <button
      className={className}
      onClick={() =>
        notify("Demo: the shop’s WhatsApp number has not been configured yet.")
      }
    >
      <MessageCircle size={18} />
      {children}
    </button>
  );
}
export function Skeletons() {
  return (
    <div className="product-grid" aria-label="Loading products" role="status">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton-card">
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
