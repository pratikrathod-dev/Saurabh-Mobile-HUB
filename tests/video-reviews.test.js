import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { videoReviews } from "../src/data/videoReviews.js";
import {
  instagramEmbedUrl,
  cleanInstagramUrl,
  videoFileError,
  videoDurationError,
  MAX_VIDEO_BYTES,
} from "../src/utils/videoReviews.js";

test("all four supplied local videos exist, use display names and have no verification badge", () => {
  assert.deepEqual(
    videoReviews.map((r) => [r.customerName, r.videoSrc]),
    [
      ["Aarav", "/videos/aarav.mp4"],
      ["Rohan", "/videos/rohan.mp4"],
      ["Aditya", "/videos/aditya.mp4"],
      ["Kunal", "/videos/kunal.mp4"],
    ],
  );
  for (const r of videoReviews) {
    assert.equal(r.type, "mp4");
    assert.equal(r.instagramUrl, undefined);
    assert.equal(r.rating, 5);
    assert.equal(r.verified, false);
    const asset = new URL(`../public${r.videoSrc}`, import.meta.url);
    assert.ok(statSync(asset).size > 0 && statSync(asset).size < 5 * 1024 * 1024);
    assert.equal(readFileSync(asset).subarray(4, 8).toString(), "ftyp");
  }
});
test("embed builder strips tracking and rejects non-Instagram URLs", () => {
  assert.equal(
    instagramEmbedUrl("https://www.instagram.com/reel/Dc8bAhPNnLA"),
    "https://www.instagram.com/reel/Dc8bAhPNnLA/embed",
  );
  for (const url of [
    "https://example.com/reel/abc/",
    "javascript:alert(1)",
    "https://www.instagram.com.evil.test/reel/abc/",
  ])
    assert.equal(instagramEmbedUrl(url), null);
  assert.equal(
    instagramEmbedUrl("https://www.instagram.com/reel/abc?srtk=one&rpxt=two&dlrf=three#tracking"),
    "https://www.instagram.com/reel/abc/embed",
  );
  assert.equal(cleanInstagramUrl("https://instagram.com/reel/abc/?foo=1"), "https://www.instagram.com/reel/abc/");
});
test("video upload validates type, size, empty data and finite duration", () => {
  assert.equal(
    videoFileError({
      name: "review.mp4",
      type: "video/mp4",
      size: MAX_VIDEO_BYTES,
    }),
    "",
  );
  assert.equal(
    videoFileError({ name: "review.mov", type: "video/quicktime", size: 100 }),
    "",
  );
  assert.ok(
    videoFileError({
      name: "review.mp4",
      type: "video/mp4",
      size: MAX_VIDEO_BYTES + 1,
    }),
  );
  assert.ok(
    videoFileError({ name: "review.exe", type: "video/mp4", size: 100 }),
  );
  assert.ok(
    videoFileError({ name: "review.mp4", type: "text/plain", size: 100 }),
  );
  assert.ok(videoFileError({ name: "review.mp4", type: "video/mp4", size: 0 }));
  assert.equal(videoDurationError(30), "");
  for (const seconds of [30.01, 0, NaN, Infinity])
    assert.ok(videoDurationError(seconds));
});
