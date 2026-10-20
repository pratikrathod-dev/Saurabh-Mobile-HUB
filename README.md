# Saurabh-Mobile-HUB

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

- Responsive home with a three-slide, swipe-enabled hero, promotions, categories, featured tabs, brand chips, accessories, reviews, and four local customer videos.
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
public/images/products/   Real model-specific product photos and source records
scripts/                 One-time real product photo importer
src/components/layout/   Header, footer, logo, features, floating actions
src/components/ui/       Accessible modal, stars, empty/loading states
src/components/product/  Product cards, cart drawer, reusable bag items
src/components/reviews/  Review form, video carousel, native video modal
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
2. **Catalog:** edit `src/data/products.js`. The 11 retained products have real model-specific photos, with illustrative pricing, ratings, specifications, and availability. See `IMAGES.md` for image naming, sources, and replacement instructions. Confirm each real variant's specs, price, warranty, stock, and colour. Replace `images[]` with local file paths under `public/`. Prices are numeric INR and formatted with `Intl.NumberFormat('en-IN')`.
3. **Reviews:** edit `src/data/reviews.js`. Seed entries are clearly labelled samples. Only publish authentic customer feedback with permission. Browser reviews are stored under `smh-reviews`, cart under `smh-cart`, and wishlist under `smh-wishlist` in localStorage. Clear these keys in browser devtools to reset the demo.
4. **Map:** replace the labelled map placeholder in `src/pages/Contact.jsx` with a confirmed Google Maps iframe embed, using a descriptive title and `loading="lazy"`. The current link searches Digras generally, not a verified shop location.

### Customer videos: self-hosted MP4s

All four owner-supplied clips from Downloads/reels are included under
`public/videos/`: `aarav.mp4`, `rohan.mp4`, `aditya.mp4`, and `kunal.mp4`.
Each original is under 5 MB. Originals in Downloads are untouched.
The display names were assigned at the owner's request; they do not establish
the customers' real identities. Verification badges and Instagram players
have been removed.

`src/data/videoReviews.js` is the catalog. Cards show actual video frames.
Only the centered, 60%-visible card plays, muted, looping and inline; side
cards pause. Leaving the section, hiding the tab, or opening the modal pauses
previews. Reduced motion disables autoplay. Clicking play opens a native
video with controls; closing unmounts it. No Instagram iframe is loaded.

Optional JPG/WebP covers can be added under `public/images/reels/` and assigned
to each entry's `poster`. To replace a clip, copy the MP4 into `public/videos/`
and update `videoSrc`; prefer portrait H.264/AAC fast-start MP4 under 5 MB.
See both asset-directory README files for the filenames and source mapping.

**Feedback upload demo:** Share Your Feedback accepts an optional `.mp4` / `.mov` file up to 30 MB and 30 seconds. The file is checked locally, including readable duration, and previewed with a blob URL. Only this deliberately chosen local file uses `preload="metadata"` to measure duration. Submission adds the video to a **pending session-only queue**, displays the approval toast, and does not publish it in the verified carousel. Normal written feedback still persists locally. No file or blob URL is stored in localStorage or sent to a server. The queue disappears on refresh, and unused blob URLs are revoked. A backend is required for real uploads, durable storage, and shop moderation; the demo queue does not notify the shop.

### Change branding

Tailwind tokens live in `tailwind.config.js`. Component CSS lives in `src/index.css`, including `--amber`, `--muted`, and `--border` variables and matching colour values. Change both the token values and matching component colours for a complete rebrand. Amber button states use dark text for contrast. Outfit is requested from Google Fonts with Arial as fallback; the application works without the font request. All product photos are local optimized WebPs. `ProductImage` provides consistent square frames, skeleton loading, and a branded error state. See `IMAGES.md`.

## Demo boundaries

Checkout displays the requested sample “Order request received” message, followed by an explicit notice that nothing was sent. Contact and review forms similarly explain local-only behaviour. No payment is taken. The page makes no product/backend API calls; Google Fonts loads typography. Customer videos play from local MP4 files without Instagram embeds. External links open the relevant website when selected.

Opening hours are displayed as Monday–Saturday. Seven-day support refers to online enquiries and does not promise the physical store is open Sunday. The owner should confirm all claims and offers before a real launch.

## Deploy

### Vercel

Import the repository, select **Vite**, use `npm run build`, and set output to `dist`. `vercel.json` supplies a history-route fallback so direct visits to `/product/...`, `/reviews`, etc. work.

### Netlify

Import the repository, use `npm run build` and publish `dist`. `public/_redirects` is copied into the build and supplies the SPA fallback. `netlify.toml` includes these settings.

This app is static. Do not add backend secrets or environment variables for this demo. Data is browser-local and will not sync between devices.

## Validation and dependency notes

The video catalog includes four real local MP4 assets. Browser checks confirmed muted autoplay for all four centered videos, paused side cards, native modal playback, and player removal on close, with no recorded console errors or warnings. Responsive carousel checks cover mobile and desktop. The modal is fullscreen on phones and capped at 448px on desktop.

`npm test` covers catalog and asset integrity, cart totals, coupon rounding, combined filters, mobile-number validation, video file/duration limits, and playback arbitration (visibility threshold, mobile exclusivity, hidden tabs, and modal suspension). `npm run build` produces the static bundle for validation; publication still requires the owner's explicit approval. Lighthouse is unavailable here, so performance/accessibility scores have not been measured. Mobile overhaul interaction QA is tracked separately in `MOBILE_AUDIT.md`.

The dependency audit at delivery reports 9 entries (5 high, 4 moderate): Tailwind 3 development tooling accounts for 7, and the explicitly requested React Router 6 accounts for 2 moderate entries. The reported fixes require major-version migration. This app has no SSR hydration and constructs internal route paths itself; it never passes a user-supplied destination to navigation. Reassess advisories and migrate dependencies before a public production launch. Run `npm audit` for current details.





