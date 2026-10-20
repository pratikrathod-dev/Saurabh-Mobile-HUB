import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, Instagram, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { shopInfo } from "../data/shopInfo";
import { useStore } from "../context/StoreContext";
import { validPhone } from "../utils/commerce";
import { WhatsAppButton } from "../components/ui/Common";
export default function Contact() {
  const { notify } = useStore();
  const [errors, setErrors] = useState({});
  const [mapOpen, setMapOpen] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget),
      next = {};
    if (data.get("name").trim().length < 2)
      next.name = "Please enter your name.";
    if (!validPhone(data.get("phone")))
      next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (data.get("message").trim().length < 10)
      next.message = "Please write at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    notify("Thank you! Demo form validated — no message was sent.");
    e.currentTarget.reset();
  };
  return (
    <div className="container inner-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>Contact
      </div>
      <div className="page-heading">
        <p className="eyebrow">GOOD CONVERSATIONS START HERE</p>
        <h1>Your neighbourhood. Your hub.</h1>
        <p>
          Drop by for a new phone, some honest advice, or just a friendly hello.
        </p>
      </div>
      <div className="contact-layout">
        <section className="contact-details">
          <h2>Come say hello.</h2>
          <p className="muted">Find your next favourite at {shopInfo.name}.</p>
          {[
            [MapPin, "Visit us", shopInfo.address],
            [Clock, "Our doors are open", shopInfo.hours],
            [Phone, "Give us a call", shopInfo.phone],
          ].map(([Icon, title, text]) => (
            <div className="contact-row" key={title}>
              <span>
                <Icon size={22} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <p className="demo-notice">
            Exact address and phone number are placeholders. Add confirmed shop
            details before sharing publicly.
          </p>
          <WhatsAppButton />
          {shopInfo.contactConfigured && <a className="button outline" href={"tel:+" + shopInfo.phone.replace(/\D/g, "")}><Phone size={18}/>Call the shop</a>}
          <a
            className="text-link"
            href={shopInfo.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={18} />
            {shopInfo.instagramHandle}
            <ArrowUpRight size={16} />
          </a>
        </section>
        <form className="contact-form" noValidate onSubmit={submit}>
          <h2>Let’s talk about your next upgrade.</h2>
          <p className="muted">
            A frontend contact form preview. No message will be sent.
          </p>
          <div className="form-grid">
            <label>
              Your name *
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
              Phone number *
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <span className="form-error" role="alert">
                  {errors.phone}
                </span>
              )}
            </label>
          </div>
          <label>
            How can we help? *
            <textarea
              name="message"
              rows="5"
              placeholder="I’m looking for a phone that…"
              required
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <span className="form-error" role="alert">
                {errors.message}
              </span>
            )}
          </label>
          <button className="button" type="submit">
            Preview your enquiry
            <ArrowUpRight size={17} />
          </button>
        </form>
      </div>
      <section className="contact-map" aria-label="Digras area map">
          <h2>Find us in Digras.</h2>
          <p>Area map. The exact shop pin is still to be confirmed.</p>
          {mapOpen ? <iframe title="Digras, Maharashtra area map" loading="lazy" src="https://maps.google.com/maps?q=Digras%20Maharashtra&output=embed" referrerPolicy="no-referrer-when-downgrade"/> : <button className="button outline" onClick={() => setMapOpen(true)}><MapPin size={20}/>Load area map</button>}
          <a
            className="button outline"
            href="https://www.google.com/maps/search/?api=1&query=Digras+Maharashtra"
            target="_blank"
            rel="noreferrer"
          >
            Get directions to Digras
            <ArrowUpRight size={16} />
          </a>
      </section>
    </div>
  );
}
