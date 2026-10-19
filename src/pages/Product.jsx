import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Gift,
  Check,
  ZoomIn,
} from "lucide-react";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../utils/formatPrice";
import {
  Empty,
  Stars,
  WhatsAppButton,
  SectionTitle,
} from "../components/ui/Common";
import ProductCard from "../components/product/ProductCard";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewCard from "../components/reviews/ReviewCard";
export default function Product() {
  const { id } = useParams();
  const p = products.find((x) => x.id === id);
  return p ? (
    <ProductContent key={id} p={p} />
  ) : (
    <Empty title="That product isn’t in our collection." />
  );
}
function ProductContent({ p }) {
  const { add, toggleWishlist, wishlist, reviews } = useStore();
  const [image, setImage] = useState(0),
    [color, setColor] = useState(p.colors[0]),
    [qty, setQty] = useState(1),
    [tab, setTab] = useState("Description");
  const productReviews = reviews.filter((r) => r.productId === p.id),
    category = categories.find((c) => c.slug === p.category);
  return (
    <div className="container inner-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/category/${p.category}`}>{category?.name}</Link>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      <div className="product-detail">
        <div>
          <div className={`detail-image tone-${p.tone}`}>
            <img src={p.images[image]} alt={`${p.name}, view ${image + 1}`} />
            <span>
              <ZoomIn size={17} />
              Hover for a closer look
            </span>
          </div>
          <div className="thumbnails">
            {p.images.map((src, i) => (
              <button
                key={i}
                aria-label={`View product image ${i + 1}`}
                aria-pressed={image === i}
                className={image === i ? "active" : ""}
                onClick={() => setImage(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{p.brand} · SELECTED AT THE HUB</p>
          <h1>{p.name}</h1>
          <div className="rating-line">
            <Stars rating={p.rating} />
            <strong>{p.rating}</strong>
            <button
              className="subtle-link"
              onClick={() => {
                setTab("Reviews");
                document
                  .getElementById("product-tabs")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Read reviews ({productReviews.length})
            </button>
          </div>
          <div className="detail-price">
            <span>{formatPrice(p.price)}</span>
            <del>{formatPrice(p.oldPrice)}</del>
            <b>Save {Math.round((1 - p.price / p.oldPrice) * 100)}%</b>
          </div>
          <small className="muted">
            Illustrative demo pricing · Confirm current price in store
          </small>
          <p className={p.inStock ? "stock-status" : "out-stock"}>
            <span />
            {p.inStock
              ? "In stock — ready for your next chapter"
              : "Currently unavailable"}
          </p>
          <p>{p.description}</p>
          <fieldset className="color-selector">
            <legend>
              Colour: <strong>{color}</strong>
            </legend>
            <div>
              {p.colors.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch swatch-${i} ${c === color ? "active" : ""}`}
                  onClick={() => setColor(c)}
                  aria-label={`Select ${c}`}
                  aria-pressed={c === color}
                >
                  {c === color && <Check size={15} />}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="buy-row">
            <div className="quantity">
              <button
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty((q) => q - 1)}
              >
                <Minus size={15} />
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                aria-label="Increase quantity"
                disabled={qty >= 10}
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              className="button"
              disabled={!p.inStock}
              onClick={() => add(p, qty, color)}
            >
              {p.inStock ? "Add to bag" : "Out of stock"}
              <Plus size={17} />
            </button>
            <button
              className="button outline icon-only"
              aria-label="Toggle wishlist"
              aria-pressed={wishlist.includes(p.id)}
              onClick={() => toggleWishlist(p.id)}
            >
              <Heart
                size={20}
                fill={wishlist.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <WhatsAppButton
            message={`Hi Saurabh Mobile Hub! I’m interested in ${p.name} (${color}). Can you confirm availability and price?`}
            className="button outline full"
          />
          <div className="product-perks">
            <span>
              <ShieldCheck size={17} />
              Genuine products
            </span>
            <span>
              <Gift size={17} />
              {p.category === "smartphones"
                ? "Free screen guard"
                : "Picked for everyday life"}
            </span>
          </div>
        </div>
      </div>
      <section id="product-tabs" className="product-tabs">
        <div className="tabs" role="tablist" aria-label="Product information">
          {["Description", "Specifications", "Reviews"].map((t) => (
            <button
              role="tab"
              id={`tab-${t}`}
              aria-controls={`panel-${t}`}
              aria-selected={tab === t}
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "active" : ""}
            >
              {t}
              {t === "Reviews" ? ` (${productReviews.length})` : ""}
            </button>
          ))}
        </div>
        <div
          className="tab-panel"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {tab === "Description" ? (
            <>
              <h2>Made for your everyday.</h2>
              <p>{p.description}</p>
              <p className="muted">
                This is a frontend demonstration. Product illustrations,
                specifications, prices, and availability are sample data.
              </p>
            </>
          ) : tab === "Specifications" ? (
            <dl className="specs">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="product-review-layout">
              <div>
                {productReviews.length ? (
                  productReviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))
                ) : (
                  <p>
                    Be the first to share your experience with this product.
                  </p>
                )}
              </div>
              <ReviewForm productId={p.id} />
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="YOU MIGHT ALSO LOVE"
          title="A few more good choices."
          link="Explore the collection"
          to={`/category/${p.category}`}
        />
        <div className="related-row">
          {products
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 6)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
