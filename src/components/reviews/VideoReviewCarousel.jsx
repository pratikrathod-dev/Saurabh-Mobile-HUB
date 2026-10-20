import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Instagram, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { videoReviews } from "../../data/videoReviews";
import { shopInfo } from "../../data/shopInfo";
import { SectionTitle } from "../ui/Common";
import VideoReviewCard from "./VideoReviewCard";
import { videoPlayback } from "../../utils/videoPlayback";
import { reviewIndex, reviewSlots, reviewDotDelta } from "../../utils/reviewCarousel";
const VideoModal = lazy(() => import("./VideoModal"));

export default function VideoReviewCarousel({
  items = videoReviews, contained = false, title = "What Our Customers Say",
}) {
  const [position, setPosition] = useState(0);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [viewport, setViewport] = useState(() => ({ width: innerWidth, height: innerHeight }));
  const cardWidth = mobile ? Math.min(viewport.width * 0.68, 240) : Math.min(260, Math.max(180, (viewport.height - 380) * 9 / 16));
  const region = useRef(null);
  const opener = useRef(null);
  const touch = useRef(null);
  const swiped = useRef(false);
  const visible = useInView(region, { amount: 0.3 });
  const reduced = useReducedMotion();
  const current = items.length ? reviewIndex(position, items.length) : 0;
  const move = useCallback((delta) => setPosition((p) => p + delta), []);
  const open = useCallback((review, button) => {
    opener.current = button;
    setActive(review);
  }, []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const resize = () => {
      setMobile(media.matches);
      setViewport({ width: innerWidth, height: innerHeight });
    };
    const visibility = () => setHidden(document.hidden);
    media.addEventListener("change", resize);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", resize);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => (active ? videoPlayback.suspend() : undefined), [active]);
  useEffect(() => {
    if (items.length < 2 || hovered || focused || stopped || active || hidden || !visible || reduced) return;
    const timer = setTimeout(() => move(1), 5000);
    return () => clearTimeout(timer);
  }, [position, items.length, hovered, focused, stopped, active, hidden, visible, reduced, move]);

  if (!items.length) return null;
  return (
    <section className={`video-reviews-section ${contained ? "video-reviews-contained" : "section"}`} aria-label={title}>
      <div className={contained ? "" : "container"}>
        <SectionTitle eyebrow="REAL PEOPLE. THEIR OWN WORDS." title={title}>
          <a className="text-link video-follow" href={shopInfo.instagram} target="_blank" rel="noreferrer">
            <Instagram size={17} /> Follow us on Instagram <ArrowUpRight size={16} />
          </a>
        </SectionTitle>
        <div ref={region} className="video-carousel" role="region" aria-roledescription="carousel"
          aria-label="Customer video reviews" tabIndex={0}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
          onKeyDown={(event) => {
            if (event.target.closest("a")) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onPointerDown={(event) => {
            swiped.current = false;
            if (mobile || event.pointerType === "touch") touch.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!touch.current) return;
            const dx = event.clientX - touch.current.x;
            const dy = event.clientY - touch.current.y;
            if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
              swiped.current = true;
              move(dx < 0 ? 1 : -1);
            }
            touch.current = null;
          }}
          onPointerCancel={() => { touch.current = null; }}
          onClickCapture={(event) => {
            if (swiped.current) {
              event.preventDefault();
              event.stopPropagation();
              swiped.current = false;
            }
          }}
        >
          <div className="video-carousel-stage">
            {reviewSlots(position, items.length).map(({ slot, index, offset }) => {
              const shown = Math.abs(offset) <= (reduced ? 0 : 1);
              const centered = offset === 0;
              return (
                <motion.div key={slot} className="video-carousel-slot" data-offset={offset}
                  data-review-id={items[index].id} role="group" aria-roledescription="slide"
                  aria-label={`Review ${index + 1} of ${items.length}`} aria-hidden={!shown}
                  inert={!shown ? "" : undefined} initial={false}
                  animate={{
                    x: reduced ? 0 : offset * (cardWidth + (mobile ? 16 : 48)),
                    scale: reduced || centered ? 1 : mobile ? 0.92 : 0.84,
                    rotateY: reduced || mobile ? 0 : offset * -18,
                    opacity: shown ? (centered ? 1 : mobile ? 0.6 : 0.55) : 0,
                  }}
                  transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.32, 0.72, 0, 1] }}
                  style={{ zIndex: 10 - Math.abs(offset), pointerEvents: shown ? "auto" : "none" }}
                >
                  <VideoReviewCard review={items[index]} centered={centered} interactive={shown}
                    offset={offset} onSelect={move} onPlay={open} />
                </motion.div>
              );
            })}
          </div>
          {items.length > 1 && <>
            <button type="button" className="video-carousel-arrow is-prev" aria-label="Previous video review" onClick={() => move(-1)}>
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="video-carousel-arrow is-next" aria-label="Next video review" onClick={() => move(1)}>
              <ChevronRight size={22} />
            </button>
          </>}
          <div className="video-carousel-pagination">
            {items.map((review, index) => (
              <button type="button" key={review.id} className={current === index ? "active" : ""}
                aria-label={`Go to review ${index + 1}`} aria-current={current === index ? "true" : undefined}
                onClick={() => move(reviewDotDelta(position, index, items.length))} />
            ))}
            {!reduced && items.length > 1 && (
              <button type="button" className="video-carousel-pause"
                aria-label={stopped ? "Resume review rotation" : "Pause review rotation"}
                onClick={() => { setStopped((value) => !value); setFocused(false); }}>
                {stopped ? <Play size={14} /> : <Pause size={14} />}
              </button>
            )}
          </div>
          <span className="sr-only" aria-live={focused || stopped ? "polite" : "off"}>
            Review {current + 1} of {items.length}: {items[current].customerName}
          </span>
        </div>
      </div>
      <AnimatePresence onExitComplete={() => opener.current?.focus()}>
        {active && (
          <Suspense key="review-modal" fallback={<p className="video-opening" role="status">Opening video…</p>}>
            <VideoModal review={active} onClose={close} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}

