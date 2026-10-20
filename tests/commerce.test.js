import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { products } from "../src/data/products.js";
import { categories } from "../src/data/categories.js";
import {
  cartSubtotal,
  couponDiscount,
  validPhone,
  filterProducts,
} from "../src/utils/commerce.js";
test("catalog IDs, relationships, prices and all local gallery assets are valid", () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  assert.equal(products.length, 11);
  const sources = JSON.parse(
    readFileSync("public/images/products/sources.json", "utf8"),
  );
  const primaryHashes = new Set();
  for (const p of products) {
    assert.ok(categories.some((c) => c.slug === p.category));
    assert.ok(
      p.enquiryOnly
        ? p.price === null && p.oldPrice === null
        : p.price > 0 && p.oldPrice >= p.price,
    );
    assert.equal(p.images.length, p.imageAlts.length);
    assert.ok(sources[p.slug] && !sources[p.slug].error);
    for (const image of p.images) {
      assert.match(image, /^\/images\/products\/[a-z0-9-]+-\d+\.(png|webp)$/);
      assert.ok(existsSync(`public${image}`), image);
      assert.ok(
        statSync(`public${image}`).size < 150_000,
        `${image} must stay under 150 KB`,
      );
      const bytes = readFileSync(`public${image}`);
      if (image.endsWith(".png")) {
        assert.equal(bytes.subarray(1, 4).toString(), "PNG");
        assert.equal(bytes.readUInt32BE(16), 800);
        assert.equal(bytes.readUInt32BE(20), 800);
      } else {
        assert.equal(bytes.subarray(0, 4).toString(), "RIFF");
        assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
        // Lossy VP8 frames store 14-bit dimensions after the frame signature.
        const signature = bytes.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
        assert.ok(signature > 0, "Expected an optimized VP8 WebP frame");
        assert.equal(bytes.readUInt16LE(signature + 3) & 0x3fff, 800);
        assert.equal(bytes.readUInt16LE(signature + 5) & 0x3fff, 800);
      }
    }
    primaryHashes.add(
      createHash("sha256")
        .update(readFileSync(`public${p.images[0]}`))
        .digest("hex"),
    );
  }
  assert.equal(
    primaryHashes.size,
    products.length,
    "Every product needs its own distinct main photo",
  );
});
test("the supplied iPhone gallery is enquiry-only and not sold for an invented price", () => {
  const iphone = products.find((p) => p.id === "iphone-18-pro");
  assert.equal(iphone.images.length, 8);
  assert.equal(iphone.enquiryOnly, true);
  assert.equal(iphone.price, null);
  const priced = filterProducts(products, { sort: "high" });
  assert.equal(priced.at(-1).id, iphone.id);
  assert.ok(
    !filterProducts(products, { stock: true }).some((p) => p.id === iphone.id),
  );
});
test("bag totals handle variants, quantities and removed catalog products", () => {
  const bag = [
    { id: "apple-15", qty: 2, color: "Blue" },
    { id: "apple-15", qty: 1, color: "Midnight" },
    { id: "missing", qty: 1 },
  ];
  assert.equal(cartSubtotal(bag, products), 62900 * 3);
  assert.equal(cartSubtotal([], products), 0);
});
test("coupon is case-insensitive, rounds to INR, rejects unrecognised codes", () => {
  assert.equal(couponDiscount(999, " saurabh10 "), 100);
  assert.equal(couponDiscount(999, "INVALID"), 0);
  assert.equal(couponDiscount(0, "SAURABH10"), 0);
});
test("combined catalog filters and price ordering do not mutate source", () => {
  const before = products.map((p) => p.id);
  const found = filterProducts(products, {
    category: "smartphones",
    brand: "Apple",
    max: 70000,
    stock: true,
    rating: 4,
    search: "15",
    sort: "low",
  });
  assert.deepEqual(
    found.map((p) => p.id),
    ["apple-15"],
  );
  const sorted = filterProducts(products, { sort: "high" });
  assert.equal(sorted[0].id, "apple-15-pro");
  assert.deepEqual(
    products.map((p) => p.id),
    before,
  );
  assert.equal(
    filterProducts(products, { search: "no-such-product" }).length,
    0,
  );
});
test("Indian mobile validation accepts common spacing and rejects bad numbers", () => {
  assert.ok(validPhone("98765 43210"));
  assert.ok(validPhone("98765-43210"));
  assert.ok(!validPhone("1234567890"));
  assert.ok(!validPhone("98765"));
  assert.ok(!validPhone("98765432100"));
});
