import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, brands } from "../data/products";
import { categories } from "../data/categories";
import { filterProducts } from "../utils/commerce";
import { formatPrice } from "../utils/formatPrice";
import ProductCard from "../components/product/ProductCard";
import { Empty, Skeletons } from "../components/ui/Common";
import Modal from "../components/ui/Modal";
export default function Shop() {
  const { slug } = useParams(),
    [params, setParams] = useSearchParams();
  const [mobile, setMobile] = useState(false),
    [sortOpen, setSortOpen] = useState(false),
    [loading, setLoading] = useState(true),
    [count, setCount] = useState(12);
  const category = categories.find((c) => c.slug === slug);
  const filters = {
    category: slug || params.get("category") || "",
    brand: params.get("brand") || "",
    max: params.get("max") || 150000,
    rating: params.get("rating") || 0,
    stock: params.get("stock") === "1",
    search: params.get("q") || "",
    sort: params.get("sort") || "relevance",
  };
  const isAccessories = params.get("accessories") === "1";
  const list = filterProducts(
    isAccessories
      ? products.filter((p) => !["smartphones", "tablets"].includes(p.category))
      : products,
    filters,
  );
  useEffect(() => {
    setLoading(true);
    setCount(12);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [slug, params]);
  const change = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };
  const clear = () => setParams({});
  const filterUI = (
    <>
      <div className="filter-heading">
        <h3>Refine your finds</h3>
        <button onClick={clear}>Reset</button>
      </div>
      <fieldset>
        <legend>Categories</legend>
        <label>
          <input
            type="radio"
            name="category"
            checked={!filters.category}
            onChange={() => change("category", "")}
            disabled={!!slug}
          />
          All products
        </label>
        {categories.map((c) => (
          <label key={c.slug}>
            <input
              type="radio"
              name="category"
              checked={filters.category === c.slug}
              onChange={() => change("category", c.slug)}
              disabled={!!slug}
            />
            {c.name}
            <small>
              {products.filter((p) => p.category === c.slug).length}
            </small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Brand</legend>
        <select
          aria-label="Filter by brand"
          value={filters.brand}
          onChange={(e) => change("brand", e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
          <option>Everyday</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Price range</legend>
        <input
          aria-label="Maximum price"
          type="range"
          min="200"
          max="150000"
          step="100"
          value={filters.max}
          onChange={(e) => change("max", e.target.value)}
        />
        <div className="range-labels">
          <span>₹0</span>
          <strong>{formatPrice(filters.max)}</strong>
        </div>
      </fieldset>
      <fieldset>
        <legend>Customer rating</legend>
        <select
          aria-label="Minimum rating"
          value={filters.rating}
          onChange={(e) => change("rating", e.target.value)}
        >
          <option value="0">All ratings</option>
          <option value="4">4 stars & up</option>
          <option value="4.5">4.5 stars & up</option>
          <option value="4.8">4.8 stars & up</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Availability</legend>
        <label>
          <input
            type="checkbox"
            checked={filters.stock}
            onChange={(e) => change("stock", e.target.checked ? "1" : "")}
          />
          In stock only
        </label>
      </fieldset>
    </>
  );
  if (slug && !category) return <Empty title="Category not found" />;
  return (
    <div className="container inner-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{category?.name || "Shop"}</span>
      </div>
      <div className="page-heading">
        <p className="eyebrow">YOUR NEXT FAVOURITE IS HERE</p>
        <h1>{category?.name || "Find your next upgrade."}</h1>
        <p>Good products. Honest prices. A little something for everyone.</p>
      </div>
      <div className="shop-layout">
        <aside className="filter-sidebar">{filterUI}</aside>
        <div>
          <div className="shop-toolbar">
            <span>
              <strong>{list.length}</strong> products to explore
            </span>
            <button
              className="button outline filter-toggle"
              onClick={() => setMobile(true)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <button className="button outline mobile-sort-button" onClick={() => setSortOpen(true)}>Sort <ChevronDown size={16}/></button>
            <label className="sort-label desktop-sort">
              <span>Sort by:</span>
              <select
                aria-label="Sort products"
                value={filters.sort}
                onChange={(e) => change("sort", e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
          {params.size > 0 && (
            <div className="active-filters">
              {Array.from(params.entries())
                .filter(([k]) => k !== "sort")
                .map(([k, v]) => (
                  <button key={k} onClick={() => change(k, "")}>
                    {k === "max"
                      ? `Under ${formatPrice(v)}`
                      : k === "stock"
                        ? "In stock"
                        : k === "accessories"
                          ? "Accessories"
                          : v}
                    <X size={13} />
                  </button>
                ))}
              <button className="clear-filters" onClick={clear}>
                Clear all
              </button>
            </div>
          )}
          {loading ? (
            <Skeletons />
          ) : list.length ? (
            <>
              <div className="product-grid shop-product-grid">
                {list.slice(0, count).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {count < list.length && (
                <div className="load-more">
                  <p>
                    Showing {Math.min(count, list.length)} of {list.length}
                  </p>
                  <button
                    className="button outline"
                    onClick={() => setCount((n) => n + 12)}
                  >
                    A few more good finds
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <Empty
              title="No matches this time."
              text="Try a different brand or a wider price range."
              action="Reset your search"
              to={slug ? `/category/${slug}` : "/shop"}
            />
          )}
        </div>
      </div>
      {mobile && (
        <Modal
          title="Find your perfect match"
          bottomSheet
          animated
          onClose={() => setMobile(false)}
        >
          {filterUI}
          <div className="sheet-footer"><button className="button outline" onClick={clear}>Clear all</button><button className="button" onClick={() => setMobile(false)}>Show {list.length} results</button></div>
        </Modal>
      )}
      {sortOpen && <Modal title="Sort products" bottomSheet animated onClose={() => setSortOpen(false)}>
        <fieldset className="sort-options"><legend className="sr-only">Sort order</legend>
          {[["relevance","Recommended"],["low","Price: low to high"],["high","Price: high to low"],["newest","Newest arrivals"],["rating","Top rated"]].map(([value,label]) =>
            <label key={value}><input type="radio" name="sort-order" value={value} checked={filters.sort === value} onChange={() => { change("sort",value); setSortOpen(false); }}/>{label}</label>)}
        </fieldset>
      </Modal>}
    </div>
  );
}
