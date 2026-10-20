import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, ChevronDown, ArrowUp, Instagram, MapPin, ArrowRight, ShieldCheck, Truck, Gift, Headphones, Home, LayoutGrid, Phone } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { products } from "../../data/products";
import { categories } from "../../data/categories";
import { shopInfo } from "../../data/shopInfo";
import { useDebounce } from "../../hooks/useDebounce";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { formatPrice } from "../../utils/formatPrice";
import { WhatsAppButton } from "../ui/Common";
import Modal from "../ui/Modal";
import ProductImage from "../product/ProductImage";
import Logo from "../ui/Logo";
function SearchBox({ onNavigate = () => {}, autoFocus = false }) {
  const [query, setQuery] = useState(""), [open, setOpen] = useState(false);
  const [recent, setRecent] = useLocalStorage("smh-recent-searches", []);
  const delayed = useDebounce(query), navigate = useNavigate();
  const remember = (value) => setRecent(old => [value, ...old.filter(x => x !== value)].slice(0, 5));
  const run = (value) => {
    if (!value.trim()) return;
    remember(value.trim());
    navigate("/shop?q=" + encodeURIComponent(value.trim()));
    setOpen(false); onNavigate();
  };
  const results = products.filter(p => p.name.toLowerCase().includes(delayed.toLowerCase())).slice(0, 5);
  return <div className="search-wrap">
    <form className="search-box" onSubmit={e => { e.preventDefault(); run(query); }}>
      <Search size={18} />
      <input type="search" autoFocus={autoFocus} data-autofocus={autoFocus} autoComplete="off" aria-label="Search phones and accessories" placeholder="Search phones, brands, accessories"
        value={query} onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={e => { if (e.key === "Escape") setOpen(false); }} />
      <button type="submit" aria-label="Submit search"><ArrowRight size={18} /></button>
    </form>
    {open && <div className="search-results">
      {delayed.trim() ? results.length ? results.map(p =>
        <Link key={p.id} to={"/product/" + p.id} onClick={() => { remember(query); setOpen(false); onNavigate(); }}>
          <ProductImage product={p} className="search-product-image" /><span>{p.name}<small>{formatPrice(p.price)}</small></span><ArrowRight size={16} />
        </Link>) : <p>No matches. Try Samsung or earbuds.</p> : <>
          <strong>Recent searches</strong>
          {recent.length ? recent.map(value => <button type="button" key={value} onClick={() => run(value)}><Search size={16} />{value}</button>) : <p>Your recent searches will appear here.</p>}
        </>}
      {query.trim() && <button type="button" onClick={() => run(query)}>See all results <ArrowRight size={16} /></button>}
    </div>}
  </div>;
}
export function Header() {
  const { cart, wishlist, setDrawer } = useStore();
  const [menu, setMenu] = useState(false), [search, setSearch] = useState(false);
  const location = useLocation();
  useEffect(() => { setMenu(false); setSearch(false); }, [location.pathname, location.search]);
  const links = <>
    <NavLink to="/" end>Home</NavLink><NavLink to="/shop">Shop</NavLink>
    <details className="category-menu"><summary>Categories <ChevronDown size={16} /></summary>
      <div>{categories.map(c => <Link key={c.slug} to={"/category/" + c.slug}>{c.name}</Link>)}</div>
    </details>
    <NavLink to="/reviews">Reviews</NavLink><NavLink to="/contact">Contact</NavLink>
  </>;
  const count = cart.reduce((n,x) => n + x.qty, 0);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement"><div className="container"><span>Open Mon–Sat, 10am–9pm</span><span>Free screen guard with every phone</span></div></div>
    <header className="header"><div className="container nav-main">
      <button className="icon-button mobile-menu-button" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={21} /></button>
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
      <div className="desktop-search"><SearchBox /></div>
      <div className="nav-actions">
        <button className="icon-button mobile-search-button" aria-label="Open search" onClick={() => setSearch(true)}><Search size={20} /></button>
        <Link to="/wishlist" className="icon-button" aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={20} />{wishlist.length > 0 && <b key={wishlist.length}>{wishlist.length}</b>}</Link>
        <button className="icon-button" onClick={() => setDrawer(true)} aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={20} /><b key={count}>{count}</b></button>
      </div>
    </div></header>
    {menu && <Modal title={`Explore ${shopInfo.name}`} drawer side="left" animated onClose={() => setMenu(false)}>
      <div className="drawer-brand" onClick={() => setMenu(false)}><Logo showTagline /></div>
      <SearchBox onNavigate={() => setMenu(false)} />
      <nav className="mobile-nav" aria-label="Mobile navigation">{links}</nav>
      <div className="drawer-social"><WhatsAppButton /><a className="button outline" href={shopInfo.instagram} target="_blank" rel="noreferrer"><Instagram size={18} />Instagram</a></div>
    </Modal>}
    {search && <Modal title="Find your next upgrade" fullScreen animated onClose={() => setSearch(false)}><SearchBox autoFocus onNavigate={() => setSearch(false)} /></Modal>}
  </>;
}
export function BottomNavigation() {
  const location = useLocation(), { cart, wishlist } = useStore();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  useEffect(() => setCategoriesOpen(false), [location.pathname]);
  const product = location.pathname.startsWith("/product/");
  return <>
    {!product && <nav className="bottom-tabs" aria-label="Mobile shortcuts">
      <NavLink to="/" end><Home size={21} /><span>Home</span></NavLink>
      <NavLink to="/shop"><ShoppingBag size={21} /><span>Shop</span></NavLink>
      <button aria-label="Browse categories" className={location.pathname.startsWith("/category/") ? "active" : ""} onClick={() => setCategoriesOpen(true)}><LayoutGrid size={21} /><span>Categories</span></button>
      <NavLink to="/wishlist"><Heart size={21} /><span>Wishlist</span>{wishlist.length > 0 && <b>{wishlist.length}</b>}</NavLink>
      <NavLink to="/cart"><ShoppingBag size={21} /><span>Cart</span>{cart.length > 0 && <b>{cart.reduce((n,x)=>n+x.qty,0)}</b>}</NavLink>
    </nav>}
    {categoriesOpen && <Modal title="Browse categories" bottomSheet animated onClose={() => setCategoriesOpen(false)}>
      <nav className="category-sheet-links">{categories.map(c => <Link key={c.slug} to={"/category/"+c.slug}>{c.name}<ArrowRight size={18} /></Link>)}</nav>
    </Modal>}
  </>;
}
export function Features() {
  return <section className="features container">{[[ShieldCheck,"Genuine products","Authentic. Always."],[Gift,"A little extra","Free screen guard with every phone"],[Truck,"Local service","Help before and after your purchase"],[Headphones,"Here for you","Friendly advice, every visit"]].map(([Icon,title,text])=>
    <div key={title}><Icon size={26} strokeWidth={1.5}/><span><strong>{title}</strong><small>{text}</small></span></div>)}</section>;
}
export function Footer() {
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => document.querySelectorAll(".footer-section").forEach((section,index) => { section.open = media.matches || index === 0; });
    update();
    media.addEventListener("change",update);
    return () => media.removeEventListener("change",update);
  }, []);
  const phone = shopInfo.phone.replace(/\D/g, "");
  return <><Features /><footer>
    <div className="container footer-grid">
      <details className="footer-section" open><summary>About the hub</summary><div><Logo variant="dark" showTagline /><p className="footer-brand-line">{shopInfo.tagline}</p><p className="brand-marathi" lang="mr">{shopInfo.marathiName}</p><p>Your friendly neighbourhood mobile store in Digras.</p><a className="social-link" href={shopInfo.instagram} target="_blank" rel="noreferrer"><Instagram size={20}/>Follow our everyday stories</a></div></details>
      <details className="footer-section"><summary>Quick links</summary><div><Link to="/shop">Shop all</Link><Link to="/wishlist">Wishlist</Link><Link to="/reviews">Customer reviews</Link><Link to="/contact">Visit the store</Link></div></details>
      <details className="footer-section"><summary>Categories</summary><div>{categories.map(c=><Link key={c.slug} to={"/category/"+c.slug}>{c.name}</Link>)}</div></details>
      <details className="footer-section"><summary>Contact</summary><div><p><MapPin size={17}/>{shopInfo.address}</p><p>{shopInfo.hours}</p>{phone.length >= 10 ? <a className="button outline" href={"tel:+"+phone}><Phone size={18}/>Call the shop</a> : <Link className="button outline" to="/contact">Contact the shop</Link>}<WhatsAppButton /></div></details>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} {shopInfo.name}</span><span>Frontend demo · Confirm prices and availability in store.</span></div>
  </footer></>;
}
export function FloatingActions() {
  const [show, setShow] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const scroll = () => setShow(window.scrollY > 650);
    window.addEventListener("scroll",scroll,{passive:true}); return () => window.removeEventListener("scroll",scroll);
  }, []);
  return <div className={`floating-actions ${location.pathname.startsWith("/product/") ? "above-product" : ""}`}>
    {show && <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}><ArrowUp size={20}/></button>}
    <WhatsAppButton className="whatsapp-float" children={<span className="sr-only">Contact on WhatsApp</span>} />
  </div>;
}

