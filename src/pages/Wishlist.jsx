import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import { Empty } from "../components/ui/Common";
export default function Wishlist() {
  const { wishlist, toggleWishlist, add } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container inner-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>Wishlist
      </div>
      <div className="page-heading">
        <p className="eyebrow">THE ONES YOU’VE GOT YOUR EYE ON</p>
        <h1>Saved for a little later.</h1>
        <p>
          Your favourites, all in one place. {list.length} saved{" "}
          {list.length === 1 ? "find" : "finds"}.
        </p>
      </div>
      {list.length ? (
        <div className="product-grid">
          {list.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
              <button
                className="button outline full move-cart"
                disabled={!p.inStock || p.enquiryOnly}
                onClick={() => {
                  toggleWishlist(p.id);
                  add(p);
                }}
              >
                Move to bag
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="Let’s find something you’ll love."
          text="Tap the heart on any product to keep it here for later."
        />
      )}
    </div>
  );
}
