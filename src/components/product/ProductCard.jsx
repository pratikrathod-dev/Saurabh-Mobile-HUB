import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { formatPrice } from "../../utils/formatPrice";
import { Stars } from "../ui/Common";
import Modal from "../ui/Modal";
import ProductImage from "./ProductImage";
export default function ProductCard({ product: p }) {
  const { add, wishlist, toggleWishlist } = useStore();
  const [quick, setQuick] = useState(false), [added, setAdded] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const addProduct = () => {
    add(p, 1, p.colors[0], { openDrawer: false });
    setAdded(true); clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  };
  return <>
    <article className="product-card">
      <div className={`product-visual tone-${p.tone}`}>
        <Link to={"/product/"+p.id} aria-label={"View "+p.name}><ProductImage product={p}/></Link>
        <span className={`product-badge ${p.tags.includes("new") ? "badge-new" : ""}`}>{p.tags.includes("new") ? "NEW" : "−"+Math.round((1-p.price/p.oldPrice)*100)+"%"}</span>
        <div className="product-actions">
          <button aria-label={`${wishlist.includes(p.id)?"Remove":"Save"} ${p.name} ${wishlist.includes(p.id)?"from":"to"} wishlist`}
            aria-pressed={wishlist.includes(p.id)} className={wishlist.includes(p.id)?"selected":""} onClick={() => toggleWishlist(p.id)}>
            <Heart size={18} fill={wishlist.includes(p.id)?"currentColor":"none"}/>
          </button>
          <button aria-label={"Quick view "+p.name} onClick={() => setQuick(true)}><Eye size={18}/></button>
        </div>
      </div>
      <div className="product-info">
        <span className="brand-label">{p.brand}</span>
        <Link className="product-name" to={"/product/"+p.id}>{p.name}</Link>
        {p.reviewCount > 0 ? <div className="rating-line"><Stars rating={p.rating}/><span>{p.rating} ({p.reviewCount})</span></div> : <p className="unrated-product">New arrival</p>}
        <div className="price">{formatPrice(p.price)}{p.oldPrice != null && <del>{formatPrice(p.oldPrice)}</del>}</div>
      </div>
      {p.enquiryOnly ? <Link className="card-add" to={"/product/"+p.id}>Explore <ArrowRight size={16}/></Link>
        : <button disabled={!p.inStock} className={`card-add ${added?"is-added":""}`} onClick={addProduct}>
          {added?"Added":p.inStock?"Add to Cart":"Out of stock"}
        </button>}
    </article>
    {quick && <Modal title="A closer look" bottomSheet animated onClose={() => setQuick(false)}>
      <div className="quick-view"><ProductImage product={p}/><div><p className="eyebrow">{p.brand}</p><h2>{p.name}</h2>
        <p className="price">{formatPrice(p.price)}</p><p>{p.description}</p>
        {p.enquiryOnly ? <Link className="button" to={"/product/"+p.id} onClick={()=>setQuick(false)}>Check availability</Link> :
          <button className="button" disabled={!p.inStock} onClick={()=>{setQuick(false);add(p);}}>Add to Cart</button>}
        <Link className="text-link" to={"/product/"+p.id} onClick={()=>setQuick(false)}>All the details<ArrowRight size={16}/></Link>
      </div></div>
    </Modal>}
  </>;
}

