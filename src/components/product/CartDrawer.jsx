import { useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { products } from "../../data/products";
import { cartSubtotal } from "../../utils/commerce";
import { formatPrice } from "../../utils/formatPrice";
import Modal from "../ui/Modal";
import CartItems from "./CartItems";
export default function CartDrawer() {
  const { cart, drawer, setDrawer } = useStore();
  const close = useCallback(() => setDrawer(false), [setDrawer]);
  return drawer ? (
    <Modal
      title={`Your bag (${cart.reduce((n, x) => n + x.qty, 0)})`}
      drawer
      animated
      onClose={close}
    >
      {cart.length ? (
        <>
          <p className="muted">Good choices look good on you.</p>
          <CartItems onNavigate={close} />
          <div className="drawer-summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(cartSubtotal(cart, products))}</strong>
            </div>
            <p className="muted">Demo order request · No payment required</p>
            <Link className="button full" to="/cart" onClick={close}>
              View bag & checkout
              <ArrowRight size={17} />
            </Link>
            <button className="text-link" onClick={close}>
              Keep exploring
            </button>
          </div>
        </>
      ) : (
        <div className="empty">
          <ShoppingBag size={40} />
          <h2>A little room for something good.</h2>
          <Link to="/shop" className="button" onClick={close}>
            Explore the shop
          </Link>
        </div>
      )}
    </Modal>
  ) : null;
}
