import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Plus, ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { formatPrice } from "../../utils/formatPrice";
import { Stars } from "../ui/Common";
import Modal from "../ui/Modal";
export default function ProductCard({ product: p }) {
  const { add, wishlist, toggleWishlist } = useStore();
  const [quick, setQuick] = useState(false);
  return (
    <>
      <article className="product-card">
        <div className={`product-visual tone-${p.tone}`}>
          <Link to={`/product/${p.id}`} aria-label={`View ${p.name}`}>
            <img
              src={p.images[0]}
              alt={p.name}
              loading="lazy"
              width="400"
              height="400"
            />
          </Link>
          <span
            className={`product-badge ${p.tags.includes("new") ? "badge-new" : ""}`}
          >
            {p.tags.includes("new")
              ? "NEW"
              : `−${Math.round((1 - p.price / p.oldPrice) * 100)}%`}
          </span>
          <div className="product-actions">
            <button
              aria-label={`${wishlist.includes(p.id) ? "Remove" : "Save"} ${p.name} ${wishlist.includes(p.id) ? "from" : "to"} wishlist`}
              className={wishlist.includes(p.id) ? "selected" : ""}
              onClick={() => toggleWishlist(p.id)}
            >
              <Heart
                size={17}
                fill={wishlist.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
            <button
              aria-label={`Quick view ${p.name}`}
              onClick={() => setQuick(true)}
            >
              <Eye size={17} />
            </button>
          </div>
          <button
            disabled={!p.inStock}
            className="card-add"
            onClick={() => add(p)}
          >
            <Plus size={16} />
            {p.inStock ? "Add to bag" : "Out of stock"}
          </button>
        </div>
        <div className="product-info">
          <span className="brand-label">{p.brand}</span>
          <Link className="product-name" to={`/product/${p.id}`}>
            {p.name}
          </Link>
          <div className="rating-line">
            <Stars rating={p.rating} />
            <span>
              {p.rating} <span className="muted">({p.reviewCount})</span>
            </span>
          </div>
          <div className="price">
            {formatPrice(p.price)} <del>{formatPrice(p.oldPrice)}</del>
          </div>
        </div>
      </article>
      {quick && (
        <Modal title="A closer look" onClose={() => setQuick(false)}>
          <div className="quick-view">
            <img src={p.images[0]} alt={p.name} />
            <div>
              <p className="eyebrow">{p.brand}</p>
              <h2>{p.name}</h2>
              <p className="price">{formatPrice(p.price)}</p>
              <p>{p.description}</p>
              <button
                className="button"
                disabled={!p.inStock}
                onClick={() => {
                  setQuick(false);
                  add(p);
                }}
              >
                Add to bag
              </button>
              <Link
                className="text-link"
                to={`/product/${p.id}`}
                onClick={() => setQuick(false)}
              >
                All the details
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
