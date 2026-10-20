export const reviewIndex = (position, length) => ((position % length) + length) % length;

// Unbounded slot identities keep incoming cards mounted across last/first.
// Only hidden slots are recycled; visible cards never jump across sides.
export function reviewSlots(position, length) {
  if (!length) return [];
  if (length === 1) return [{ slot: position, index: 0, offset: 0 }];
  return Array.from({ length: 5 }, (_, i) => {
    const slot = position + i - 2;
    return { slot, index: reviewIndex(slot, length), offset: slot - position };
  });
}
export function reviewDotDelta(current, target, length) {
  let delta = target - reviewIndex(current, length);
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

