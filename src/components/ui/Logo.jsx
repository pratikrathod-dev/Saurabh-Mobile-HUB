import { Link } from "react-router-dom";
import { shopInfo } from "../../data/shopInfo";
import { publicAsset } from "../../utils/publicAsset";

export function BrandIcon({ className = "" }) {
  return <img className={`brand-icon ${className}`} src={publicAsset("favicon.svg")} width="40" height="40" alt="" aria-hidden="true" />;
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
  return <div className="brand-loading" role="status" aria-live="polite">
    <BrandIcon />
    <span>Loading {shopInfo.name}…</span>
  </div>;
}
