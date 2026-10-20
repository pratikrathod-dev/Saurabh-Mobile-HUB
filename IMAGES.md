# Product image guide

The catalog now contains **11 products and 26 model-specific photos / feature images**. No generated product artwork, random image services, or remote image URLs are used at runtime. Products without verified photos have been removed from the active catalog.

## Files and naming

Drop product files in **`public/images/products/`**. Use lowercase model slugs and hyphens:

```text
iphone-15-1.png                 # Main product view
iphone-15-2.png                 # Additional view / colour lineup
samsung-galaxy-s24-1.webp       # WebP is also supported and preferred
samsung-galaxy-s24-2.webp
```

A single `slug.png` or `slug.webp` also works when explicitly listed in `images`; use the numbered format for new products so additional views are easy to add. Do not rename a different model's photo to fit a listing. Match the exact model, camera layout, and pictured colour. Colour-lineup gallery photos may show multiple manufacturer colour options; the selectable demo colour describes the primary photo.

## Image requirements

- **800 × 800 px**, square canvas; show the entire product with breathing room.
- **Transparent PNG or a clean white background. WebP is preferred** for new optimized files; match the actual file extension in the catalog.
- **Under 150 KB per file**, with correct orientation and no stretching or cropping of the device.
- Use genuine manufacturer/supplier product photography or your own product photos. No AI-generated images or random placeholders.
- Keep a record of the original source and obtain appropriate permission for any public/commercial use. Local inclusion does not grant redistribution rights.

The eight iPhone 18 Pro images were supplied by the user, with the model launch checked against the linked Apple Newsroom announcement. Local pricing and availability are enquiry-only, with no invented price. The other imported phone/iPad images are official product views displayed in GSMArena's model galleries; the charger and AirPods images come from Apple's product image CDN. See [`public/images/products/sources.json`](public/images/products/sources.json) for every source page, direct image URL, original dimensions, and optimized file size. Some originals are smaller than 800 px and were fitted onto an 800 px canvas; this does not add original photographic detail. No watermarks were removed.

## Connect photos to a product

Edit `src/data/products.js`:

```js
{
  id: "samsung-s24", // Stable ID preserves existing links and saved bags
  slug: "samsung-galaxy-s24",
  name: "Samsung Galaxy S24",
  brand: "Samsung",
  images: [
    "/images/products/samsung-galaxy-s24-1.png",
    "/images/products/samsung-galaxy-s24-2.png",
  ],
  imageAlts: [
    "Samsung Galaxy S24, Onyx Black front, rear and side views",
    "Samsung Galaxy S24, Marble Gray and Onyx Black rear views",
  ],
  // …other catalog fields
}
```

Keep `images` and `imageAlts` in the same order and of equal length. Describe the actual image rather than a generic “phone image”. Add products only after the files exist and match the listing. Retired products are automatically removed from persisted bags and wishlists.

## Shared component

`src/components/product/ProductImage.jsx` is used by product cards, quick view, wishlist cards, cart page/drawer, search suggestions, detail main images/thumbnails, and home promotions. It reserves a 1:1 frame, uses `object-fit: contain`, 16 px padding, and background `#F7F7F7`. Images are lazy-loaded by default (hero photos use eager loading), show a skeleton while decoding, and reset correctly when switching gallery images.

On a missing or failed file, the broken `<img>` is replaced by an accessible branded panel showing the brand initial, product name, and a phone icon in black/amber. This is an error state, not a substitute catalog product photo. Reduced-motion preferences disable the shimmer.

```jsx
<ProductImage product={product} />
<ProductImage product={product} index={1} />
```

Run `npm test` and `npm run build` after changes. Tests validate paths, file presence, source records, PNG/WebP dimensions, unique primary images, and the file-size cap. Preview locally with `npm run dev`. Do not deploy without the user's explicit approval.
