import test from "node:test";
import assert from "node:assert/strict";
import { reviewSlots, reviewIndex, reviewDotDelta } from "../src/utils/reviewCarousel.js";

test("wrap-around keeps each visible card identity and moves next right-to-left", () => {
  const before = reviewSlots(3, 4);
  const after = reviewSlots(4, 4);
  for (const old of before.filter((slot) => Math.abs(slot.offset) <= 1)) {
    const next = after.find((slot) => slot.slot === old.slot);
    assert.equal(next.index, old.index);
    assert.equal(next.offset, old.offset - 1);
  }
  assert.equal(after.find((slot) => slot.offset === 0).index, 0);
  assert.equal(reviewSlots(-1, 4).find((slot) => slot.offset === 0).index, 3);
});
test("pagination takes the shortest circular path and handles a single review", () => {
  assert.equal(reviewDotDelta(3, 0, 4), 1);
  assert.equal(reviewDotDelta(0, 3, 4), -1);
  assert.equal(reviewDotDelta(8, 1, 4), 1);
  assert.equal(reviewIndex(-5, 4), 3);
  assert.deepEqual(reviewSlots(0, 0), []);
  assert.deepEqual(reviewSlots(0, 1), [{ slot: 0, index: 0, offset: 0 }]);
});
