import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/formatPrice";
import ProductImage from "./ProductImage";
export default function CartItems({ onNavigate = () => {} }) {
  const { cart, updateQty, remove } = useStore();
  return (
    <div className="cart-items">
      {cart.map((item) => {
        const p = products.find((x) => x.id === item.id);
        if (!p) return null;
        return (
          <article className="cart-item" key={`${item.id}-${item.color}`}>
            <Link to={`/product/${p.id}`} onClick={onNavigate}>
              <ProductImage product={p} className="cart-product-image" />
            </Link>
            <div>
              <small className="brand-label">{p.brand}</small>
              <Link to={`/product/${p.id}`} onClick={onNavigate}>
                <strong>{p.name}</strong>
              </Link>
              <small className="muted">{item.color}</small>
              <div className="cart-item-bottom">
                <div className="quantity">
                  <button
                    aria-label={`Decrease ${p.name} quantity`}
                    disabled={item.qty <= 1}
                    onClick={() => updateQty(item.id, item.color, item.qty - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <span>{item.qty}</span>
                  <button
                    aria-label={`Increase ${p.name} quantity`}
                    disabled={item.qty >= 10}
                    onClick={() => updateQty(item.id, item.color, item.qty + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <strong>{formatPrice(p.price * item.qty)}</strong>
              </div>
            </div>
            <button
              className="remove-item icon-button"
              aria-label={`Remove ${p.name}`}
              onClick={() => remove(item.id, item.color)}
            >
              <Trash2 size={16} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
