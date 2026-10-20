import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tablet,
  Headphones,
  Plug,
  Zap,
  Layers,
  AudioLines,
  Pause,
  Play,
} from "lucide-react";
import { products, brands } from "../data/products";
import { categories } from "../data/categories";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/product/ProductCard";
import ProductImage from "../components/product/ProductImage";
import { SectionTitle, Stars } from "../components/ui/Common";
import VideoReviewCarousel from "../components/reviews/VideoReviewCarousel";
const slides = [
  {
    eyebrow: "MEET THE NEW IPHONE 18 PRO",
    title: (
      <>
        iPhone 18 Pro.
        <br />
        Your next <span>big upgrade.</span>
      </>
    ),
    description:
      "Discover a bold new look in Burgundy.\nExplore iPhone 18 Pro and ask us about local pricing and availability.",
    cta: "Explore iPhone 18 Pro",
    to: "/product/iphone-18-pro",
    product: products.find((p) => p.id === "iphone-18-pro"),
    label: "A closer look at Pro.",
    tag: "Burgundy. Beautifully Pro.",
  },
  {
    eyebrow: "GOOD SOUND. GREAT DAYS.",
    title: (
      <>
        Your world.
        <br />A little more <span>wireless.</span>
      </>
    ),
    description:
      "From your first playlist to your last call of the day.\nFind audio essentials that keep up with you.",
    cta: "Find your sound",
    to: "/category/earbuds",
    product: products.find((p) => p.id === "airpods"),
    label: "Tune into something better.",
    tag: "Every beat. Every day.",
  },
  {
    eyebrow: "SMALL ESSENTIALS. BIG DIFFERENCE.",
    title: (
      <>
        Power up.
        <br />
        Go a little <span>further.</span>
      </>
    ),
    description:
      "Dependable charging for everyday life.\nExplore the Apple 20W USB-C adapter, right here at the hub.",
    cta: "Explore accessories",
    to: "/category/chargers-cables",
    product: products.find((p) => p.id === "charger-20"),
    label: "Ready for the everyday.",
    tag: "Stay connected.",
  },
];
function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const hero = useRef(null);
  const visible = useInView(hero, { amount: 0.25 });
  const reduced = useReducedMotion();
  const [touch, setTouch] = useState(null);
  const paused =
    hovered || focused || stopped || hidden || !visible || touch !== null || reduced;
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      4500,
    );
    return () => clearTimeout(timer);
  }, [paused, index]);
  const s = slides[index];
  const move = (n) => setIndex((i) => (i + n + slides.length) % slides.length);
  return (
    <section
      className="hero"
      ref={hero}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onTouchStart={(e) => setTouch(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (
          touch !== null &&
          Math.abs(e.changedTouches[0].clientX - touch) > 50
        )
          move(e.changedTouches[0].clientX < touch ? 1 : -1);
        setTouch(null);
      }}
      onTouchCancel={() => setTouch(null)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="hero-inner container">
        <div className="hero-copy" key={index}>
          <p className="eyebrow">
            <span className="little-line" />
            {s.eyebrow}
          </p>
          <h1>{s.title}</h1>
          <p className="hero-description">{s.description}</p>
          <Link
            className="button"
            to={s.to}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {s.cta}
          </Link>
        </div>
        <div className={`hero-art slide-${index}`}>
          <span className="hero-orbit orbit-one" />
          <span className="hero-orbit orbit-two" />
          <span className="art-word">UPGRADE</span>
          <ProductImage
            key={s.product.id}
            product={s.product}
            className="hero-real-image"
            loading="eager"
          />
          <div className="hero-note">
            <span>
              <strong>{s.label}</strong>
              <small>Genuine products. Honest advice.</small>
            </span>
          </div>
          <span className="hero-art-label">
            {s.tag}
          </span>
        </div>
        <div
          className="hero-controls"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="slide-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={i === index ? "active" : ""}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
          <div>
            <span>
              0{index + 1}
              <span className="muted"> / 03</span>
            </span>
            {!reduced && (
              <button
                className="round-button"
                aria-label={
                  stopped ? "Resume automatic slides" : "Pause automatic slides"
                }
                onClick={() => {
                  setStopped((value) => !value);
                  setFocused(false);
                }}
              >
                {stopped ? <Play size={13} /> : <Pause size={13} />}
              </button>
            )}
            <button
              className="round-button"
              aria-label="Previous slide"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              className="round-button"
              aria-label="Next slide"
              onClick={() => move(1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
const icons = [Smartphone, Tablet, Layers, Plug, Zap, Headphones, AudioLines];
export default function Home() {
  const [tab, setTab] = useState("New Arrivals"),
    [brand, setBrand] = useState("All");
  const { reviews } = useStore();
  const best = products
    .filter((p) =>
      p.tags.includes(
        tab === "New Arrivals"
          ? "new"
          : tab === "Best Deals"
            ? "deal"
            : "bestseller",
      ),
    )
    .slice(0, 4);
  const latest = products
    .filter(
      (p) =>
        p.category === "smartphones" && (brand === "All" || p.brand === brand),
    )
    .slice(0, 4);
  return (
    <>
      <Hero />
      <div className="store-note container">
        <span>
          Rooted in Digras. Ready for your next upgrade.
        </span>
        <span>Great phones. Genuine advice. A better experience.</span>
      </div>
      <section className="container promo-grid">
        <Link to="/category/smartphones" className="promo-card promo-black">
          <div>
            <p>MORE PHONE. LESS SPEND.</p>
            <h2>
              Your next favourite,
              <br />
              for a little less.
            </h2>
            <span>
              Explore phone deals
            </span>
          </div>
          <ProductImage
            product={products.find((p) => p.id === "samsung-s24")}
            className="promo-real-image"
          />
        </Link>
        <Link to="/category/earbuds" className="promo-card promo-yellow">
          <div>
            <p>GOOD VIBES. GREAT SOUND.</p>
            <h2>
              Big on sound.
              <br />
              Easy on your pocket.
            </h2>
            <span>
              Find your sound
            </span>
          </div>
          <ProductImage
            product={products.find((p) => p.id === "airpods")}
            className="promo-real-image"
          />
        </Link>
        <Link
          to="/category/chargers-cables"
          className="promo-card promo-charcoal"
        >
          <div>
            <p>THE EVERYDAY ESSENTIALS</p>
            <h2>
              A little extra.
              <br />A lot more useful.
            </h2>
            <span>
              Shop accessories
            </span>
          </div>
          <ProductImage
            product={products.find((p) => p.id === "charger-20")}
            className="promo-real-image"
          />
        </Link>
      </section>
      <section className="section container categories-section">
        <SectionTitle
          eyebrow="A LITTLE SOMETHING FOR EVERYONE"
          title="Find your kind of upgrade."
          link="All categories"
        />
        <div className="categories-row">
          {categories.map((c, i) => {
            const Icon = icons[i];
            return (
              <Link
                className="category-card"
                key={c.slug}
                to={`/category/${c.slug}`}
              >
                <span className="category-art">
                  <Icon size={32} strokeWidth={1.3} />
                </span>
                <strong>{c.name}</strong>
                <small>
                  {products.filter((p) => p.category === c.slug).length}{" "}
                  products
                </small>
              </Link>
            );
          })}
        </div>
      </section>
      <motion.section
        className="section container best-section"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45 }}
      >
        <SectionTitle
          eyebrow="THE ONES EVERYONE’S TALKING ABOUT"
          title="Good choices. Great favourites."
        >
          <div className="tabs" role="tablist" aria-label="Featured products">
            {["New Arrivals", "Best Deals", "Top Brands"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </SectionTitle>
        <div className="product-grid">
          {best.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      </motion.section>
      <section className="section latest-section">
        <div className="container">
          <SectionTitle
            eyebrow="FRESH FINDS. FAMILIAR FAVOURITES."
            title="A phone for every you."
            link="Shop all phones"
            to="/category/smartphones"
          />
          <div className="brand-chips" aria-label="Filter phones by brand">
            {["All", ...brands].map((b) => (
              <button
                key={b}
                aria-pressed={brand === b}
                className={brand === b ? "active" : ""}
                onClick={() => setBrand(b)}
              >
                {b === "All" ? "All brands" : b}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {latest.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </div>
      </section>
      <section className="container">
        <div className="visit-banner">
          <div>
            <p className="eyebrow">YOUR FIRST VISIT. A LITTLE MORE SPECIAL.</p>
            <h2>
              A warm welcome.
              <br />
              And a little <span>something extra.</span>
            </h2>
            <p>
              Discover a special discount on your first purchase.
              <br />
              Drop in, explore, and let’s find your perfect match.
            </p>
            <Link className="button" to="/contact">
              Visit the shop
            </Link>
            <small>Ask in store for current offers. Terms apply.</small>
          </div>
          <div className="visit-art">
            <div className="offer-seal">
              GOOD
              <br />
              THINGS
              <br />
              <span>START HERE</span>
            </div>
            <ProductImage
              product={products.find((p) => p.id === "vivo-v30")}
              className="visit-real-image"
            />
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionTitle
          eyebrow="THE SMALL THINGS THAT DO MORE"
          title="Meet your phone’s plus-ones."
          link="All accessories"
          to="/shop?accessories=1"
        />
        <div className="accessories-row">
          {products
            .filter((p) => !["smartphones", "tablets"].includes(p.category))
            .slice(0, 6)
            .map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
        </div>
      </section>
      <section className="section reviews-preview">
        <div className="container">
          <SectionTitle
            eyebrow="YOUR TRUST. OUR FAVOURITE REWARD."
            title="Local love. Honest words."
            link="All reviews"
            to="/reviews"
          />
          <div className="review-preview-grid">
            {reviews
              .filter((r) => r.rating === 5)
              .slice(0, 3)
              .map((r) => (
                <article className="review-card" key={r.id}>
                  <div className="review-top">
                    <Stars rating={r.rating} />
                  </div>
                  <p>“{r.text}”</p>
                  <div className="review-author">
                    <span className="avatar">
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <strong>{r.name}</strong>
                      <small>
                        {r.demo ? "Sample customer review" : "Community review"}
                      </small>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
      <VideoReviewCarousel />
    </>
  );
}
