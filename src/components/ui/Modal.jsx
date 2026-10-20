import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function Modal({
  title,
  children,
  onClose,
  drawer = false,
  bottomSheet = false,
  animated = false,
  side = "right",
  fullScreen = false,
}) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const start = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const initial = ref.current?.querySelector('[data-autofocus="true"]');
    (initial || ref.current)?.focus();
    const key = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const nodes = ref.current?.querySelectorAll(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea, summary, iframe, video[controls], [tabindex="0"]',
      );
      const first = nodes?.[0],
        last = nodes?.[nodes.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === ref.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return createPortal(
    <motion.div
      initial={animated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={animated ? { opacity: 0 } : undefined}
      transition={{ duration: 0.2 }}
      className={`modal-backdrop ${drawer ? "drawer-backdrop" : ""} ${bottomSheet ? "bottom-sheet" : ""} ${side === "left" ? "left-drawer-backdrop" : ""} ${fullScreen ? "fullscreen-backdrop" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        initial={animated ? { opacity: 0, scale: reduced ? 1 : 0.94 } : false}
        animate={{ opacity: 1, scale: 1 }}
        exit={animated ? { opacity: 0, scale: reduced ? 1 : 0.96 } : undefined}
        transition={{ duration: 0.2 }}
        onPointerDown={(event) => { start.current = event.clientX; }}
        onPointerUp={(event) => {
          if (side === "left" && start.current !== null && event.clientX - start.current < -60) onClose();
          start.current = null;
        }}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal ${drawer ? "drawer" : ""}`}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </motion.section>
    </motion.div>,
    document.body,
  );
}
