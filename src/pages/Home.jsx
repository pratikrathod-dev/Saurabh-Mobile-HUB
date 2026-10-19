import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Smartphone,
  Tablet,
  Headphones,
  Plug,
  Zap,
  Layers,
  AudioLines,
  Quote,
} from "lucide-react";
import { products, brands } from "../data/products";
import { categories } from "../data/categories";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/product/ProductCard";
import { SectionTitle, Stars } from "../components/ui/Common";
import InstagramReviews from "../components/reviews/InstagramReviews";
const slides = [
  {
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    title: (
      <>
        A little upgrade.
        <br />A lot more <span>possibilities.</span>
      </>
    ),
    description:
      "The phones you love. The prices you’ll love even more.\nDiscover your perfect match at your neighbourhood mobile hub.",
    cta: "Find your next phone",
    to: "/category/smartphones",
    image: "/assets/phone-stone.svg",
    image2: "/assets/phone-blue.svg",
    label: "An upgrade worth making.",
    tag: "The latest. The greatest.",
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
    image: "/assets/earbuds-stone.svg",
    image2: "/assets/headphones-stone.svg",
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
      "Fast chargers, dependable power banks, and everyday extras.\nEverything your phone needs, all in one place.",
    cta: "Explore accessories",
    to: "/category/power-banks",
    image: "/assets/powerbank-mint.svg",
    image2: "/assets/charger-stone.svg",
    label: "Ready for the everyday.",
    tag: "Stay connected.",
  },
];
function Hero() {
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const [touch, setTouch] = useState(null);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [paused, reduced]);
  const s = slides[index];
  const move = (n) => setIndex((i) => (i + n + slides.length) % slides.length);
  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
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
          <Link className="button" to={s.to}>
            {s.cta}
            <ArrowUpRight size={18} />
          </Link>
          <div className="hero-proof">
            <div className="avatar-stack">
              <span>RP</span>
              <span>SD</span>
              <span>AJ</span>
              <span>+</span>
            </div>
            <span>
              <Stars />
              <small>Your local store. A personal touch.</small>
            </span>
          </div>
        </div>
        <div className={`hero-art slide-${index}`}>
          <span className="hero-orbit orbit-one" />
          <span className="hero-orbit orbit-two" />
          <span className="art-word">UPGRADE</span>
          <img
            className="hero-phone back"
            src={s.image2}
            alt="Explore our collection"
          />
          <img
            className="hero-phone front"
            src={s.image}
            alt={
              index === 0
                ? "Premium smartphone in natural titanium"
                : index === 1
                  ? "Wireless earbuds"
                  : "Portable power bank"
            }
          />
          <div className="hero-note">
            <span className="note-icon">
              <ShieldCheck size={22} />
            </span>
            <span>
              <strong>{s.label}</strong>
              <small>Genuine products. Honest advice.</small>
            </span>
          </div>
          <span className="hero-art-label">
            {s.tag}
            <span>↗</span>
          </span>
          <span className="sparkle sparkle-one">✳</span>
          <span className="sparkle sparkle-two">+</span>
        </div>
        <div className="hero-controls">
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
          <MapPin size={14} />
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
              <ArrowUpRight size={16} />
            </span>
          </div>
          <img src="/assets/phone-blue.svg" alt="Blue smartphone" />
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
              <ArrowUpRight size={16} />
            </span>
          </div>
          <img src="/assets/earbuds-stone.svg" alt="Wireless earbuds" />
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
              <ArrowUpRight size={16} />
            </span>
          </div>
          <img src="/assets/charger-stone.svg" alt="Compact charger" />
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
              <ArrowUpRight size={17} />
            </Link>
            <small>Ask in store for current offers. Terms apply.</small>
          </div>
          <div className="visit-art">
            <div className="offer-seal">
              GOOD
              <br />
              THINGS
              <br />
              <span>START HERE ↗</span>
            </div>
            <img src="/assets/phone-peach.svg" alt="Your next phone awaits" />
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
                    <Quote size={25} strokeWidth={1} />
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
      <InstagramReviews />
    </>
  );
}
