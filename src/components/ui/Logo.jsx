import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { shopInfo } from "../../data/shopInfo";

export function BrandIcon({ className = "" }) {
  return <svg className={`brand-icon ${className}`} width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#C79100" />
    <rect x="13" y="8" width="14" height="24" rx="2.5" stroke="#111111" strokeWidth="2" />
    <path d="M18 11h4" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="20" cy="28" r="1" fill="#111111" />
  </svg>;
}

/** Light surfaces use light; dark surfaces use dark (white wordmark). */
export default function Logo({ variant = "light", showTagline = false, className = "" }) {
  const [wordmark, ...submark] = shopInfo.name.split(" ");
  return <Link to="/" className={`brand-logo brand-logo--${variant} ${className}`} aria-label={`${shopInfo.name} home`}>
    <span className="brand-lockup">
      <BrandIcon />
      <span className="brand-copy">
        <strong>{wordmark}<span className="brand-dot">.</span></strong>
        <span className="brand-submark">{submark.join(" ").toUpperCase()}</span>
      </span>
    </span>
    {showTagline && <span className="brand-tagline">{shopInfo.tagline}</span>}
  </Link>;
}

export function BrandLoading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(timer);
  }, []);
  return <div className="brand-loading" role="status" aria-live="polite">
    <BrandIcon />
    <span>Loading {shopInfo.name}…</span>
    {slow && <button type="button" className="button" onClick={() => window.location.reload()}>Reload</button>}
  </div>;
}
