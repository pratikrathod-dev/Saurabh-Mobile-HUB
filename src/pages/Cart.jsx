import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { products } from "../data/products";
import { formatPrice } from "../utils/formatPrice";
import { cartSubtotal, couponDiscount, validPhone } from "../utils/commerce";
import { Empty } from "../components/ui/Common";
import Modal from "../components/ui/Modal";
import CartItems from "../components/product/CartItems";
import Logo from "../components/ui/Logo";
export default function Cart() {
  const { cart, setCart, notify } = useStore();
  const [coupon,setCoupon]=useState(""), [applied,setApplied]=useState(""), [couponError,setCouponError]=useState("");
  const [checkout,setCheckout]=useState(false), [step,setStep]=useState("details"), [errors,setErrors]=useState({});
  const [details,setDetails]=useState({name:"",phone:"",address:""});
  const subtotal=cartSubtotal(cart,products), discount=couponDiscount(subtotal,applied);
  const [confirmedTotal,setConfirmedTotal]=useState(0);
  const apply=e=>{
    e.preventDefault();
    if(coupon.trim().toUpperCase()==="SAURABH10"){setApplied("SAURABH10");setCouponError("");notify("10% demo discount applied.");}
    else {setApplied("");setCouponError("Try SAURABH10.");}
  };
  const review=e=>{
    e.preventDefault(); const next={};
    if(details.name.trim().length<2) next.name="Please enter your full name.";
    if(!validPhone(details.phone)) next.phone="Enter a valid 10-digit Indian mobile number.";
    if(details.address.trim().length<10) next.address="Enter at least 10 characters.";
    setErrors(next);
    if(Object.keys(next).length) return;
    setStep("review");
  };
  const confirm=()=>{setConfirmedTotal(subtotal-discount);setCart([]);setApplied("");setStep("success");setDetails({name:"",phone:"",address:""});};
  const close=()=>{setCheckout(false);setErrors({});setDetails({name:"",phone:"",address:""});};
  return <div className="container inner-page">
    <div className="breadcrumb"><Link to="/">Home</Link><span>/</span>Your cart</div>
    <div className="page-heading"><p className="eyebrow">A FEW GOOD CHOICES</p><h1>Your cart.</h1><p>Your next upgrade is one step closer.</p></div>
    {cart.length ? <div className="cart-layout">
      <div><CartItems/><Link className="text-link" to="/shop">← Keep exploring</Link></div>
      <aside className="order-summary"><h2>Order summary</h2>
        <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        <div><span>Store pickup</span><strong className="green">Free</strong></div>
        {discount>0&&<div><span>SAURABH10</span><strong className="green">−{formatPrice(discount)}</strong></div>}
        <form className="coupon-form" onSubmit={apply}><label htmlFor="coupon">Have a discount code?</label><div>
          <input id="coupon" placeholder="Try SAURABH10" value={coupon} onChange={e=>setCoupon(e.target.value)}/><button type="submit">Apply</button></div>
          {couponError&&<span className="form-error" role="alert">{couponError}</span>}
        </form>
        <div className="total"><span>Estimated total</span><strong>{formatPrice(subtotal-discount)}</strong></div>
        <button className="button full" onClick={()=>{setCheckout(true);setStep("details");}}>Checkout<ArrowRight size={18}/></button>
        <p className="checkout-note"><ShieldCheck size={18}/>Demo checkout. No payment or real order.</p>
      </aside>
    </div>:<Empty title="Your cart is waiting for a good find."/>}
    {checkout&&<Modal title={step==="success"?"Demo complete":"Checkout"} fullScreen animated onClose={close}>
      <div className="checkout-brand"><Logo showTagline /></div>
      <ol className="checkout-steps" aria-label="Checkout steps">{["details","review","success"].map((label,i)=><li key={label} aria-current={step===label?"step":undefined}><span>{i+1}</span>{label.charAt(0).toUpperCase()+label.slice(1)}</li>)}</ol>
      {step==="details"?<form className="checkout-form" onSubmit={review} noValidate>
        <p className="demo-notice">Frontend demo. Details are used only in this open form and are never submitted or saved.</p>
        <label>Full name<input name="name" autoComplete="name" value={details.name} onChange={e=>setDetails({...details,name:e.target.value})} required aria-invalid={!!errors.name} aria-describedby={errors.name?"checkout-name-error":undefined}/>{errors.name&&<span id="checkout-name-error" className="form-error" role="alert">{errors.name}</span>}</label>
        <label>Mobile number<input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit Indian mobile number" value={details.phone} onChange={e=>setDetails({...details,phone:e.target.value})} required aria-invalid={!!errors.phone} aria-describedby={errors.phone?"checkout-phone-error":undefined}/>{errors.phone&&<span id="checkout-phone-error" className="form-error" role="alert">{errors.phone}</span>}</label>
        <label>Address<textarea name="address" autoComplete="street-address" rows="3" value={details.address} onChange={e=>setDetails({...details,address:e.target.value})} required aria-invalid={!!errors.address} aria-describedby={errors.address?"checkout-address-error":undefined}/>{errors.address&&<span id="checkout-address-error" className="form-error" role="alert">{errors.address}</span>}</label>
        <button type="submit" className="button full">Review your request<ArrowRight size={18}/></button>
      </form>:step==="review"?<div className="checkout-review">
        <h2>Review your details</h2><p>{details.name}</p><p>{details.phone}</p><p>{details.address}</p>
        <h3>Your items</h3>{cart.map(item=><p key={item.id+item.color}>{products.find(p=>p.id===item.id)?.name} × {item.qty}</p>)}
        <div className="checkout-total"><span>Estimated total</span><strong>{formatPrice(subtotal-discount)}</strong></div>
        <p className="demo-notice">Confirming completes this local demo only. No order or payment is sent.</p>
        <div className="sheet-footer"><button className="button outline" onClick={()=>setStep("details")}>Edit details</button><button className="button" onClick={confirm}>Complete demo</button></div>
      </div>:<div className="checkout-success"><span><Check size={36}/></span><h2>Demo request complete</h2><p>{formatPrice(confirmedTotal)} estimated total</p><p className="demo-notice">No request was sent. No payment was collected. Your personal details have been cleared.</p><Link className="button" to="/shop" onClick={close}>Keep exploring<ArrowRight size={18}/></Link></div>}
    </Modal>}
  </div>;
}

