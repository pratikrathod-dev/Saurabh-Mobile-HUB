/** Shared playback arbitration across every carousel on the page. No media data is stored. */
export function createPlaybackCoordinator() {
  const entries = new Map();
  let mobile = false,
    hidden = false,
    suspensions = 0,
    current = null;
  function reconcile() {
    const eligible = [...entries.entries()].filter(
      ([, entry]) => entry.eligible && entry.ratio >= 0.6,
    );
    let selected = [];
    if (!hidden && !suspensions) {
      if (mobile) {
        eligible.sort(
          ([a, x], [b, y]) =>
            y.ratio - x.ratio || Number(b === current) - Number(a === current),
        );
        selected = eligible.slice(0, 1).map(([key]) => key);
        current = selected[0] || null;
      } else selected = eligible.map(([key]) => key);
    }
    const wanted = new Set(selected);
    // Pause losers synchronously before allowing another card to start.
    for (const [key, entry] of entries)
      if (!wanted.has(key)) entry.notify(false);
    for (const key of selected) entries.get(key).notify(true);
  }
  return {
    register(notify) {
      const key = Symbol("video");
      entries.set(key, { notify, ratio: 0, eligible: false });
      notify(false);
      return {
        update(ratio, eligible) {
          const entry = entries.get(key);
          if (entry) {
            Object.assign(entry, { ratio, eligible });
            reconcile();
          }
        },
        remove() {
          const entry = entries.get(key);
          if (entry) {
            entry.notify(false);
            entries.delete(key);
            reconcile();
          }
        },
      };
    },
    setEnvironment(isMobile, isHidden) {
      mobile = isMobile;
      hidden = isHidden;
      reconcile();
    },
    suspend() {
      suspensions++;
      reconcile();
      let released = false;
      return () => {
        if (!released) {
          released = true;
          suspensions--;
          reconcile();
        }
      };
    },
  };
}
export const videoPlayback = createPlaybackCoordinator();
