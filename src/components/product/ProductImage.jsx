import { useState } from "react";
import { Smartphone } from "lucide-react";
import { shopInfo } from "../../data/shopInfo";

/** One image contract for cards, galleries, promotions, and compact bag rows. */
export default function ProductImage({
  product,
  index = 0,
  src,
  alt,
  className = "",
  loading = "lazy",
}) {
  const source = src ?? product?.images?.[index];
  const description =
    alt ||
    product?.imageAlts?.[index] ||
    `${product?.name || "Product"}, product photo`;
  // Changing a gallery URL remounts the loading state, including after an error.
  return (
    <ImageState
      key={source || "missing"}
      src={source}
      alt={description}
      product={product}
      className={className}
      loading={loading}
    />
  );
}

function ImageState({ src, alt, product, className, loading }) {
  const [status, setStatus] = useState(src ? "loading" : "error");
  return (
    <div
      className={`product-image ${status === "loading" ? "is-loading" : ""} ${className}`}
      aria-busy={status === "loading"}
    >
      {status === "error" ? (
        <div
          className="product-image-fallback"
          role="img"
          aria-label={`${product?.name || "Product"}. Product photo unavailable.`}
        >
          <span className="fallback-brand" aria-hidden="true">
            {product?.brand?.[0] || "S"}
            <Smartphone size={24} />
          </span>
          <strong aria-hidden="true">
            {product?.name || shopInfo.name}
          </strong>
          <small aria-hidden="true">
            Photo coming soon · {shopInfo.name}
          </small>
        </div>
      ) : (
        <>
          {status === "loading" && (
            <span className="product-image-skeleton" aria-hidden="true" />
          )}
          <img
            src={src}
            alt={alt}
            width="800"
            height="800"
            loading={loading}
            decoding="async"
            fetchpriority={loading === "eager" ? "high" : "auto"}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        </>
      )}
    </div>
  );
}
