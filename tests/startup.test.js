import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { readStoredState } from "../src/utils/storedState.js";

const stored = value => ({ getItem: () => value });
test("missing, malformed and blocked storage fall back without crashing startup", () => {
  const initial = ["fallback"];
  for (const value of [null, "{broken", "null", "42", '{}']) assert.equal(readStoredState("smh-wishlist", initial, stored(value)), initial);
  assert.equal(readStoredState("smh-cart", initial, { getItem() { throw new Error("Storage blocked"); } }), initial);
  assert.deepEqual(readStoredState("smh-wishlist", initial, stored("[]")), []);
});
test("corrupt array entries cannot crash cart, review or recent-search rendering", () => {
  const cart = { id: "apple-15", color: "Pink", qty: 2 };
  assert.deepEqual(readStoredState("smh-cart", [], stored(JSON.stringify([null, false, {}, { ...cart, qty: "2" }, cart]))), [cart]);
  assert.deepEqual(readStoredState("smh-recent-searches", [], stored('[null,42,{},"Samsung"]')), ["Samsung"]);
  const review = { id: "r1", name: "Test", text: "A review", rating: 5, date: "2026-10-21" };
  assert.deepEqual(readStoredState("smh-reviews", [], stored(JSON.stringify([null, {}, { ...review, rating: 100 }, review]))), [review]);
});

function bootHarness() {
  const html = readFileSync("index.html", "utf8");
  const source = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(source, "Independent boot fallback script must exist.");
  let mounted = false, callback, delay, mutation, disconnected = false, cleared = false, reloaded = false;
  const reload = { hidden: true, addEventListener(type, handler) { if (type === "click") callback = handler; } };
  const context = {
    document: { getElementById(id) { return id === "root" ? {} : id === "boot-reload" ? reload : mounted ? null : {}; } },
    window: { location: { reload() { reloaded = true; } } },
    setTimeout(handler, milliseconds) { delay = milliseconds; context.timeout = handler; return 1; },
    clearTimeout() { cleared = true; },
    MutationObserver: class { constructor(handler) { mutation = handler; } observe() {} disconnect() { disconnected = true; } },
  };
  vm.runInNewContext(source, context);
  return { reload, delay, timeout: () => context.timeout(), click: () => callback(), mount() { mounted = true; mutation(); }, state: () => ({ cleared, disconnected, reloaded }) };
}
test("boot screen uses inline SVG and offers reload after eight seconds if the bundle fails", () => {
  const html = readFileSync("index.html", "utf8");
  assert.ok(!html.includes("{{"));
  assert.match(html, /<svg[^>]*viewBox="0 0 40 40"/);
  assert.ok(!html.includes("<img"));
  const boot = bootHarness();
  assert.equal(boot.delay, 8000);
  assert.equal(boot.reload.hidden, true);
  boot.timeout();
  assert.equal(boot.reload.hidden, false);
  boot.click();
  assert.equal(boot.state().reloaded, true);
});
test("successful React mounting cancels the boot timeout and observer", () => {
  const boot = bootHarness();
  boot.mount();
  assert.equal(boot.state().cleared, true);
  assert.equal(boot.state().disconnected, true);
});
