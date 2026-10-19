import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck, Tag } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import { formatPrice } from "../utils/formatPrice";
import { cartSubtotal, couponDiscount, validPhone } from "../utils/commerce";
import { Empty } from "../components/ui/Common";
import Modal from "../components/ui/Modal";
import CartItems from "../components/product/CartItems";
export default function Cart() {
  const { cart, setCart, notify } = useStore();
  const [coupon, setCoupon] = useState(""),
    [applied, setApplied] = useState(""),
    [couponError, setCouponError] = useState(""),
    [checkout, setCheckout] = useState(false),
    [done, setDone] = useState(false),
    [errors, setErrors] = useState({});
  const subtotal = cartSubtotal(cart, products),
    discount = couponDiscount(subtotal, applied);
  const apply = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "SAURABH10") {
      setApplied("SAURABH10");
      setCouponError("");
      notify("A little extra: 10% discount applied.");
    } else {
      setApplied("");
      setCouponError("That code isn’t valid. Try SAURABH10.");
    }
  };
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget),
      next = {};
    if (data.get("name").trim().length < 2)
      next.name = "Please enter your full name.";
    if (!validPhone(data.get("phone")))
      next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (data.get("address").trim().length < 10)
      next.address = "Enter your address with at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setDone(true);
    setCart([]);
    setApplied("");
  };
  return (
    <div className="container inner-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>Your bag
      </div>
      <div className="page-heading">
        <p className="eyebrow">A FEW GOOD CHOICES</p>
        <h1>Your bag.</h1>
        <p>Your next upgrade is one step closer.</p>
      </div>
      {cart.length ? (
        <div className="cart-layout">
          <div>
            <CartItems />
            <Link className="text-link" to="/shop">
              ← Keep exploring the shop
            </Link>
          </div>
          <aside className="order-summary">
            <h2>A little overview.</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div>
              <span>Store pickup</span>
              <strong className="green">Free</strong>
            </div>
            {discount > 0 && (
              <div>
                <span>SAURABH10 · 10% off</span>
                <strong className="green">−{formatPrice(discount)}</strong>
              </div>
            )}
            <form className="coupon-form" onSubmit={apply}>
              <label htmlFor="coupon">
                <Tag size={15} />
                Have a little discount code?
              </label>
              <div>
                <input
                  id="coupon"
                  placeholder="Try SAURABH10"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button type="submit">Apply</button>
              </div>
              {couponError && (
                <span className="form-error" role="alert">
                  {couponError}
                </span>
              )}
            </form>
            <div className="total">
              <span>Estimated total</span>
              <strong>{formatPrice(subtotal - discount)}</strong>
            </div>
            <button
              className="button full"
              onClick={() => {
                setCheckout(true);
                setDone(false);
              }}
            >
              Checkout
              <ArrowRight size={17} />
            </button>
            <p className="checkout-note">
              <ShieldCheck size={16} />
              Demo checkout. No payment or real order.
            </p>
          </aside>
        </div>
      ) : (
        <Empty title="Your bag is waiting for a good find." />
      )}
      {checkout && (
        <Modal
          title={
            done ? "Your demo request is complete" : "One last little step."
          }
          onClose={() => {
            setCheckout(false);
            setErrors({});
          }}
        >
          {done ? (
            <div className="checkout-success">
              <span>
                <Check size={35} />
              </span>
              <h2>Order request received!</h2>
              <p>The shop will contact you on WhatsApp.</p>
              <p className="demo-notice">
                Demo confirmation only: no request was sent and no personal
                details were saved. In a live version, this is where the shop
                would receive your order.
              </p>
              <Link
                className="button"
                to="/shop"
                onClick={() => setCheckout(false)}
              >
                Keep discovering
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="checkout-form" noValidate>
              <p className="demo-notice">
                This is a frontend demo. Your details are validated locally and
                are never submitted or stored.
              </p>
              <label>
                Full name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span className="form-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </label>
              <label>
                Mobile number
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="10-digit Indian mobile number"
                  required
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <span className="form-error" role="alert">
                    {errors.phone}
                  </span>
                )}
              </label>
              <label>
                Address
                <textarea
                  name="address"
                  autoComplete="street-address"
                  rows="3"
                  required
                  aria-invalid={!!errors.address}
                />
                {errors.address && (
                  <span className="form-error" role="alert">
                    {errors.address}
                  </span>
                )}
              </label>
              <div className="checkout-total">
                <span>Estimated total</span>
                <strong>{formatPrice(subtotal - discount)}</strong>
              </div>
              <button type="submit" className="button full">
                Complete demo request
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
