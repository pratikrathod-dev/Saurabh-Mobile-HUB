import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ArrowUp,
  Instagram,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  Gift,
  Headphones,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { products } from "../../data/products";
import { categories } from "../../data/categories";
import { shopInfo } from "../../data/shopInfo";
import { useDebounce } from "../../hooks/useDebounce";
import { formatPrice } from "../../utils/formatPrice";
import { WhatsAppButton } from "../ui/Common";
import Modal from "../ui/Modal";
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Saurabh Mobile Hub home">
      <span className="logo-icon">
        <Smartphone size={24} />
      </span>
      <span>
        <strong>
          Saurabh<span className="logo-dot">.</span>
        </strong>
        <small>MOBILE HUB</small>
      </span>
    </Link>
  );
}
function SearchBox({ onNavigate = () => {} }) {
  const [query, setQuery] = useState(""),
    [open, setOpen] = useState(false);
  const delayed = useDebounce(query),
    navigate = useNavigate();
  const results = products
    .filter((p) => p.name.toLowerCase().includes(delayed.toLowerCase()))
    .slice(0, 5);
  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query)}`);
      setOpen(false);
      onNavigate();
    }
  };
  return (
    <div className="search-wrap">
      <form className="search-box" onSubmit={submit}>
        <Search size={17} />
        <input
          aria-label="Search phones and accessories"
          placeholder="Search for your next upgrade..."
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
        />
        <kbd>↵</kbd>
      </form>
      {open && delayed.trim() && (
        <div className="search-results">
          {results.length ? (
            results.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                onClick={() => {
                  setOpen(false);
                  onNavigate();
                }}
              >
                <img src={p.images[0]} alt="" />
                <span>
                  {p.name}
                  <small>{formatPrice(p.price)}</small>
                </span>
                <ArrowRight size={15} />
              </Link>
            ))
          ) : (
            <p>No matches. Try “Samsung” or “buds”.</p>
          )}
          <button
            className="text-link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submit}
          >
            See all results
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
export function Header() {
  const { cart, wishlist } = useStore(),
    [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => setMenu(false), [location]);
  const links = (
    <>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/shop">Shop</NavLink>
      <details className="category-menu">
        <summary>
          Categories
          <ChevronDown size={13} />
        </summary>
        <div>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              onClick={(e) =>
                e.currentTarget.closest("details")?.removeAttribute("open")
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </details>
      <NavLink to="/reviews">Reviews</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <div className="container">
          <span>
            <span className="open-dot" />
            Open: Mon–Sat 10am–9pm{" "}
            <span className="announcement-call">
              | Call / WhatsApp: {shopInfo.phone}
            </span>
          </span>
          <span>
            <Gift size={13} /> Free screen guard on every phone{" "}
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container nav-main">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links}
          </nav>
          <SearchBox />
          <div className="nav-actions">
            <Link
              to="/wishlist"
              className="icon-button"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart size={21} />
              {wishlist.length > 0 && <b>{wishlist.length}</b>}
            </Link>
            <Link
              to="/cart"
              className="icon-button"
              aria-label={`Shopping bag, ${cart.reduce((n, x) => n + x.qty, 0)} items`}
            >
              <ShoppingBag size={21} />
              <b>{cart.reduce((n, x) => n + x.qty, 0)}</b>
            </Link>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMenu(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      {menu && (
        <Modal title="Explore Saurabh" drawer onClose={() => setMenu(false)}>
          <SearchBox onNavigate={() => setMenu(false)} />
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links}
          </nav>
          <p className="muted">Your neighbourhood mobile store, in Digras.</p>
        </Modal>
      )}
    </>
  );
}
export function Features() {
  return (
    <section className="features container">
      {[
        [ShieldCheck, "Genuine products", "Authentic. Always."],
        [Gift, "A little extra, on us", "Free screen guard with every phone"],
        [Truck, "100% satisfaction", "Local service you can count on"],
        [Headphones, "Here when you need us", "Online enquiries 7 days a week"],
      ].map(([Icon, title, text]) => (
        <div key={title}>
          <Icon size={28} strokeWidth={1.4} />
          <span>
            <strong>{title}</strong>
            <small>{text}</small>
          </span>
        </div>
      ))}
    </section>
  );
}
export function Footer() {
  return (
    <>
      <Features />
      <footer>
        <div className="container footer-grid">
          <div>
            <Logo />
            <p>
              Your next phone. Your everyday essentials.
              <br />
              Your friendly neighbourhood mobile store.
            </p>
            <a
              href={shopInfo.instagram}
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <Instagram size={18} />
              <span>
                Follow our everyday stories
                <ArrowRight size={14} />
              </span>
            </a>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/shop">Shop all</Link>
            <Link to="/wishlist">Your wishlist</Link>
            <Link to="/reviews">Customer reviews</Link>
            <Link to="/contact">Visit the store</Link>
          </div>
          <div>
            <h3>Find your favourite</h3>
            {categories.slice(0, 4).map((c) => (
              <Link to={`/category/${c.slug}`} key={c.slug}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h3>Come say hello</h3>
            <p>
              <MapPin size={15} />
              {shopInfo.address}
            </p>
            <p>{shopInfo.hours}</p>
            <p>{shopInfo.phone}</p>
            <span className="footer-note">
              Made for our community. With care.
            </span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Saurabh Mobile Hub. All rights reserved.</span>
          <span>Frontend demo · Illustrative prices & reviews</span>
          <span>
            Made in Digras, for Digras <span className="amber">♡</span>
          </span>
        </div>
      </footer>
    </>
  );
}
export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const scroll = () => setShow(window.scrollY > 650);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  return (
    <div className="floating-actions">
      {show && (
        <button
          className="back-top"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ArrowUp size={18} />
        </button>
      )}
      <WhatsAppButton
        className="whatsapp-float"
        children={<span className="sr-only">Contact on WhatsApp</span>}
      />
    </div>
  );
}
