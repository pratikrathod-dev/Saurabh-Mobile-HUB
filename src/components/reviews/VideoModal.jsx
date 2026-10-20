import Modal from "../ui/Modal";
import ReviewPlayer from "./ReviewPlayer";
import { useIsPresent } from "framer-motion";
import { useEffect, useRef } from "react";

export default function VideoModal({ review, onClose }) {
  const present = useIsPresent();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const token = crypto.randomUUID();
    let installed = false;
    const back = () => closeRef.current();
    const timer = setTimeout(() => {
      history.pushState({ ...history.state, smhVideoModal: token }, "");
      installed = true;
      window.addEventListener("popstate", back);
    }, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", back);
      if (installed && history.state?.smhVideoModal === token) history.back();
    };
  }, []);
  return (
    <Modal title={`Video review · ${review.customerName}`} onClose={onClose} animated>
      <div className="video-modal-content">
        {present && <ReviewPlayer key={review.id} review={review} />}
        <p className="video-modal-caption">{review.caption}</p>
      </div>
    </Modal>
  );
}
