import { useState } from "react";
import { Play, Instagram, ArrowUpRight } from "lucide-react";
import { instaReviews } from "../../data/instaReviews";
import { shopInfo } from "../../data/shopInfo";
import Modal from "../ui/Modal";
import { SectionTitle } from "../ui/Common";
export default function InstagramReviews() {
  const [active, setActive] = useState(null),
    [failed, setFailed] = useState(false);
  const reel =
    active?.instagramUrl &&
    /^https:\/\/(www\.)?instagram\.com\/reel\/[\w-]+\/?$/.test(
      active.instagramUrl,
    )
      ? active.instagramUrl.replace(/\/?$/, "/")
      : null;
  return (
    <section className="section instagram-section">
      <div className="container">
        <SectionTitle
          eyebrow="REAL PEOPLE. HAPPY UPGRADES."
          title="What our customers say"
        >
          <a
            href={shopInfo.instagram}
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={17} />
            Follow us on Instagram
            <ArrowUpRight size={16} />
          </a>
        </SectionTitle>
        <div className="reel-grid">
          {instaReviews.map((r, i) => (
            <button
              className="reel-card"
              key={r.id}
              onClick={() => {
                setActive(r);
                setFailed(false);
              }}
              aria-label={`Play ${r.customerName}`}
            >
              <img
                src={r.thumbnail}
                alt={`Illustrated preview: ${r.customerName}`}
                loading="lazy"
              />
              <span className="reel-top">
                <Instagram size={20} />
                <span>FROM THE HUB</span>
              </span>
              <span className="play">
                <Play size={24} fill="currentColor" />
              </span>
              <span className="reel-bottom">
                <strong>{r.customerName}</strong>
                <small>{r.caption}</small>
              </span>
              <span className="reel-demo">
                Sample story {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        <p className="caption">
          A glimpse of the experience. Sample stories — real customer reels
          coming soon.
        </p>
      </div>
      {active && (
        <Modal title={active.customerName} onClose={() => setActive(null)}>
          {reel && !failed ? (
            <>
              <iframe
                className="instagram-embed"
                title={`Instagram reel: ${active.customerName}`}
                src={`${reel}embed/`}
                onError={() => setFailed(true)}
                allow="autoplay; encrypted-media; fullscreen"
                loading="lazy"
              />
              <p className="muted">
                Video not loading? Instagram may require sign-in or block
                embeds.
              </p>
            </>
          ) : (
            <div className="reel-placeholder">
              <img src={active.thumbnail} alt="Sample story illustration" />
              <p>
                {reel
                  ? "This video could not be loaded."
                  : "This is a sample story. The shop’s real customer video will appear here once a Reel URL is added."}
              </p>
            </div>
          )}
          <a
            className="button"
            href={reel || shopInfo.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={17} />
            {reel ? "Watch on Instagram" : "Visit our Instagram"}
            <ArrowUpRight size={16} />
          </a>
        </Modal>
      )}
    </section>
  );
}
