import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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
  assert.ok(products.length >= 24);
  for (const p of products) {
    assert.ok(categories.some((c) => c.slug === p.category));
    assert.ok(p.price > 0 && p.oldPrice >= p.price);
    for (const image of p.images)
      assert.ok(existsSync(`public${image}`), image);
  }
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
