import { shopInfo } from "../data/shopInfo";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Minus, Plus, Check, ZoomIn, Share2 } from "lucide-react";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { useStore } from "../context/StoreContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatPrice } from "../utils/formatPrice";
import { Empty, Stars, WhatsAppButton, SectionTitle } from "../components/ui/Common";
import ProductCard from "../components/product/ProductCard";
import ProductImage from "../components/product/ProductImage";
import Modal from "../components/ui/Modal";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewCard from "../components/reviews/ReviewCard";
import { videoReviews } from "../data/videoReviews";
import VideoReviewCarousel from "../components/reviews/VideoReviewCarousel";
export default function Product() {
  const { id } = useParams(), p = products.find(x => x.id === id);
  return p ? <ProductContent key={id} p={p}/> : <Empty title="That product is not in our collection."/>;
}
function ProductContent({ p }) {
  const { add, toggleWishlist, wishlist, reviews, notify } = useStore();
  const [image,setImage] = useState(0), [color,setColor] = useState(p.colors[0]), [qty,setQty] = useState(1);
  const [zoom,setZoom] = useState(false), [zoomed,setZoomed] = useState(false);
  const [recent,setRecent] = useLocalStorage("smh-recent-products", []);
  const gallery = useRef(null);
  useEffect(() => { setRecent(old => [p.id,...old.filter(id=>id!==p.id)].slice(0,8)); }, [p.id,setRecent]);
  const productReviews = reviews.filter(r=>r.productId===p.id), productVideos = videoReviews.filter(r=>r.productId===p.id);
  const category = categories.find(c=>c.slug===p.category);
  const viewImage = (index) => {
    setImage(index);
    gallery.current?.scrollTo({left:index*gallery.current.clientWidth,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  };
  const share = async () => {
    const data = { title:p.name, text:"Take a look at "+p.name+` at ${shopInfo.name}`, url:window.location.href };
    if (navigator.share) { try { await navigator.share(data); return; } catch(error) { if(error.name === "AbortError") return; } }
    window.open("https://wa.me/?text="+encodeURIComponent(data.text+" "+data.url),"_blank","noopener,noreferrer");
  };
  const addProduct = () => add(p,qty,color);
  const message = `Hi ${shopInfo.name}! Can you confirm price and availability for `+p.name+" ("+color+")?";
  return <div className="container inner-page product-page">
    <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to={"/category/"+p.category}>{category?.name}</Link><span>/</span><span>{p.name}</span></div>
    <div className="product-detail">
      <div className="product-gallery">
        <div ref={gallery} className="gallery-track" aria-label={"Images of "+p.name} onScroll={e=>setImage(Math.round(e.currentTarget.scrollLeft/e.currentTarget.clientWidth))}>
          {p.images.map((src,i)=><button key={src} className="gallery-slide" aria-label={`Zoom ${p.name}, image ${i+1}`} onClick={()=>{setImage(i);setZoom(true);}}>
            <ProductImage product={p} index={i}/><span className="gallery-zoom-hint"><ZoomIn size={17}/>Tap to zoom</span>
          </button>)}
        </div>
        <div className="gallery-dots">{p.images.map((src,i)=><button key={src} aria-label={`Go to product image ${i+1}`} aria-current={image===i?"true":undefined} className={image===i?"active":""} onClick={()=>viewImage(i)}><span/></button>)}</div>
        <div className="thumbnails">{p.images.map((src,i)=><button key={src} aria-label={`View product image ${i+1}`} aria-pressed={image===i} className={image===i?"active":""} onClick={()=>viewImage(i)}><ProductImage product={p} index={i}/></button>)}</div>
      </div>
      <div className="detail-copy">
        <p className="eyebrow">{p.brand} · SELECTED AT THE HUB</p><h1>{p.name}</h1>
        <div className="rating-line">{p.reviewCount>0 && <><Stars rating={p.rating}/><strong>{p.rating}</strong></>}<a className="subtle-link" href="#product-reviews" onClick={() => { const details = document.getElementById("product-reviews"); if(details) details.open = true; }}>Read reviews ({productReviews.length})</a></div>
        <div className="detail-price"><span>{formatPrice(p.price)}</span>{p.oldPrice!=null && <><del>{formatPrice(p.oldPrice)}</del><b>Save {Math.round((1-p.price/p.oldPrice)*100)}%</b></>}</div>
        <p className="demo-notice">{p.enquiryOnly?"Ask the shop about current pricing and variants.":"Demo price. Confirm current price in store."}</p>
        <p className={p.enquiryOnly?"enquiry-status":p.inStock?"stock-status":"out-stock"}>{p.enquiryOnly?"Check local availability":p.inStock?"In stock":"Currently unavailable"}</p>
        <p>{p.description}</p>
        <fieldset className="color-selector"><legend>Colour: <strong>{color}</strong></legend><div>{p.colors.map((c,i)=><button key={c} className={`color-swatch swatch-${i} ${c===color?"active":""}`} onClick={()=>setColor(c)} aria-label={"Select "+c} aria-pressed={c===color} style={p.colorValues?{background:p.colorValues[i],color:"#111"}:undefined}>{c===color&&<Check size={18}/>}</button>)}</div></fieldset>
        {!p.enquiryOnly && <div className="quantity"><button aria-label="Decrease quantity" disabled={qty<=1} onClick={()=>setQty(q=>q-1)}><Minus size={17}/></button><span>{qty}</span><button aria-label="Increase quantity" disabled={qty>=10} onClick={()=>setQty(q=>q+1)}><Plus size={17}/></button></div>}
        <div className="detail-desktop-actions">{p.enquiryOnly?<Link className="button" to="/contact">Check price & availability</Link>:<button className="button" disabled={!p.inStock} onClick={addProduct}>Add to Cart</button>}<WhatsAppButton message={message}/></div>
        <button className="button outline full product-share" onClick={share}><Share2 size={18}/>Share on WhatsApp</button>
      </div>
    </div>
    <section className="product-information">
      <details open><summary>Description</summary><div><h2>Made for your everyday.</h2><p>{p.description}</p></div></details>
      <details><summary>Specifications</summary><dl className="specs">{Object.entries(p.specs).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></details>
      <details id="product-reviews"><summary>Customer reviews ({productReviews.length})</summary><div>
        <div className="product-rating-summary"><Stars rating={p.rating||5}/><span>{productReviews.length} customer reviews</span></div>
        <div className="product-review-layout"><div>{productReviews.length?productReviews.map(r=><ReviewCard key={r.id} review={r}/>):<p>Be the first to share your experience.</p>}</div><ReviewForm productId={p.id}/></div>
      </div></details>
      {productVideos.length>0&&<details><summary>Customer videos</summary><VideoReviewCarousel contained items={productVideos}/></details>}
    </section>
    <section className="section"><SectionTitle title="You might also like" link="View all" to={"/category/"+p.category}/><div className="related-row">{products.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,6).map(x=><ProductCard key={x.id} product={x}/>)}</div></section>
    {recent.filter(id=>id!==p.id).length>0&&<section className="section"><SectionTitle title="Recently viewed"/><div className="related-row">{recent.filter(id=>id!==p.id).map(id=>products.find(x=>x.id===id)).filter(Boolean).map(x=><ProductCard key={x.id} product={x}/>)}</div></section>}
    <div className="product-mobile-actions">
      <button className="icon-button" aria-label="Toggle wishlist" aria-pressed={wishlist.includes(p.id)} onClick={()=>toggleWishlist(p.id)}><Heart size={21} fill={wishlist.includes(p.id)?"currentColor":"none"}/></button>
      {p.enquiryOnly?<Link className="button" to="/contact">Check availability</Link>:<button className="button" disabled={!p.inStock} onClick={addProduct}>Add to Cart</button>}
      <WhatsAppButton className="button outline" message={message}>Enquire</WhatsAppButton>
    </div>
    {zoom&&<Modal title={p.name+" — image "+(image+1)} fullScreen animated onClose={()=>{setZoom(false);setZoomed(false);}}>
      <div className={`zoom-viewer ${zoomed?"is-zoomed":""}`}><button aria-label={zoomed?"Zoom out":"Zoom in"} onClick={()=>setZoomed(v=>!v)}><ProductImage product={p} index={image}/></button></div>
      <div className="zoom-controls"><button className="button outline" onClick={()=>{setImage(i=>(i-1+p.images.length)%p.images.length);setZoomed(false);}}>Previous</button><button className="button outline" onClick={()=>{setImage(i=>(i+1)%p.images.length);setZoomed(false);}}>Next</button></div>
    </Modal>}
  </div>;
}

