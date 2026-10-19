# Saurabh Mobile Hub

A responsive, frontend-only mobile shop demo for Digras, Maharashtra. Built with React 18, Vite, React Router 6, Tailwind CSS, Framer Motion, and Lucide icons. There is no backend, authentication, payment gateway, or real order submission.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```sh
npm test
npm run build
npm run preview
```

## Included

- Responsive home with a three-slide, swipe-enabled carousel, promotions, categories, featured tabs, brand chips, accessories, reviews, and Instagram story previews.
- Search suggestions, URL-based shop/category filters, sorting, simulated loading skeletons, and load more.
- Product gallery, hover zoom, colour selector, quantity, quick view, specifications, product reviews, and related products.
- Cart drawer and full bag page, local persistence, quantity updates, removal, and `SAURABH10` (10% off).
- Validated checkout demo with success state and cart clearing; personal information is never stored or sent.
- Wishlist with move-to-bag actions.
- Accessible star rating input, locally persisted reviews, rating distribution, and sorting/filtering.
- Contact form preview, shop details, map placeholder, Instagram links, and guarded WhatsApp actions.
- Focus-trapped dialogs, Escape dismissal, reduced motion, live toasts, skip link, lazy route loading, and lazy product images.

## Project structure

```text
public/assets/            Local SVG product illustrations and story thumbnails
scripts/                 Regenerates the illustrative SVG assets
src/components/layout/   Header, footer, logo, features, floating actions
src/components/ui/       Accessible modal, stars, empty/loading states
src/components/product/  Product cards, cart drawer, reusable bag items
src/components/reviews/  Review form, review card, Instagram modal
src/context/             Shared cart, wishlist, review state and toast actions
src/data/                Products, categories, reviews, Instagram stories, shop details
src/hooks/               Local persistence and debounced search
src/pages/               Lazy-loaded route pages
src/utils/               INR formatting and pure commerce/filter helpers
src/App.jsx              Routing and global layout
src/index.css            Responsive visual system and component styles
tests/                   Commerce/filter/data integrity checks
```

Shared state is kept in one `StoreContext` so cart, wishlist, and review actions use a consistent toast and persistence flow. Backend integration can replace these actions later.

## Replace demo content

1. **Shop details:** edit `src/data/shopInfo.js`. Replace phone and WhatsApp placeholders, add the confirmed address/hours, and set `contactConfigured: true` only after supplying the real WhatsApp number (digits including country code, no `+`). Until then, contact buttons show an explicit demo message.
2. **Catalog:** edit `src/data/products.js`. The 28 products have illustrative pricing, ratings, specifications, availability, and SVG imagery. Confirm each real variant's specs, price, warranty, stock, and colour. Replace `images[]` with local file paths under `public/`. Prices are numeric INR and formatted with `Intl.NumberFormat('en-IN')`.
3. **Reviews:** edit `src/data/reviews.js`. Seed entries are clearly labelled samples. Only publish authentic customer feedback with permission. Browser reviews are stored under `smh-reviews`, cart under `smh-cart`, and wishlist under `smh-wishlist` in localStorage. Clear these keys in browser devtools to reset the demo.
4. **Map:** replace the labelled map placeholder in `src/pages/Contact.jsx` with a confirmed Google Maps iframe embed, using a descriptive title and `loading="lazy"`. The current link searches Digras generally, not a verified shop location.

### Add Instagram customer reels

In `src/data/instaReviews.js`, set `instagramUrl` to a real canonical Reel URL such as `https://www.instagram.com/reel/REAL_REEL_ID/`. Add the customer's name, caption, and permission-cleared local thumbnail. `null` means sample story, so the UI links to the shop profile and makes no request to an invented reel. Clicking a configured card lazily creates an iframe pointing to the reel's `/embed/` endpoint. Instagram can require sign-in or block third-party embeds, so a **Watch on Instagram** link remains available. No Instagram API is used.

### Change branding

Tailwind tokens live in `tailwind.config.js`. Component CSS lives in `src/index.css`, including `--amber`, `--muted`, and `--border` variables and matching colour values. Change both the token values and matching component colours for a complete rebrand. Amber button states use dark text for contrast. Outfit is requested from Google Fonts with Arial as fallback; the application works without the font request. All product illustrations are local SVGs. Run `node scripts/generate-assets.mjs` to regenerate them.

## Demo boundaries

Checkout displays the requested sample “Order request received” message, followed by an explicit notice that nothing was sent. Contact and review forms similarly explain local-only behaviour. No payment is taken. The page makes no product/backend API calls; Google Fonts loads typography, and Instagram embeds load only after clicking a configured reel. External links open the relevant website when selected.

Opening hours are displayed as Monday–Saturday. Seven-day support refers to online enquiries and does not promise the physical store is open Sunday. The owner should confirm all claims and offers before a real launch.

## Deploy

### Vercel

Import the repository, select **Vite**, use `npm run build`, and set output to `dist`. `vercel.json` supplies a history-route fallback so direct visits to `/product/...`, `/reviews`, etc. work.

### Netlify

Import the repository, use `npm run build` and publish `dist`. `public/_redirects` is copied into the build and supplies the SPA fallback. `netlify.toml` includes these settings.

This app is static. Do not add backend secrets or environment variables for this demo. Data is browser-local and will not sync between devices.

## Validation and dependency notes

`npm test` covers catalog and image integrity, cart totals, coupon rounding, combined filters, and mobile-number validation. `npm run build` produces the static deployment bundle. Browser checks cover the desktop and 360px layouts, a two-item bag, coupon totals, and checkout validation/completion.

The dependency audit at delivery reports 9 entries (5 high, 4 moderate): Tailwind 3 development tooling accounts for 7, and the explicitly requested React Router 6 accounts for 2 moderate entries. The reported fixes require major-version migration. This app has no SSR hydration and constructs internal route paths itself; it never passes a user-supplied destination to navigation. Reassess advisories and migrate dependencies before a public production launch. Run `npm audit` for current details.
