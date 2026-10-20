import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import config from "../vite.config.js";
import { products } from "../src/data/products.js";
import { videoReviews } from "../src/data/videoReviews.js";

const base = config.base;
assert.match(base, /^\/.+\/$/, "Pages needs the exact repository base.");
const html = readFileSync("dist/index.html", "utf8");
assert.ok(!html.includes("{{"), "Built HTML contains an unreplaced placeholder.");
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
assert.ok(scripts.length > 0, "Built HTML has no JavaScript entry.");
assert.ok(scripts.every(src => src.startsWith(`${base}assets/`) && src.endsWith(".js")), "Publish dist, not the JSX source HTML.");

function exactFile(root, relative) {
  let directory = root;
  for (const segment of relative.split("/")) {
    assert.ok(segment && segment !== "..", `Invalid asset path: ${relative}`);
    assert.ok(readdirSync(directory).includes(segment), `Missing or wrong-case asset: ${relative}`);
    directory = path.join(directory, segment);
  }
}
const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
for (const reference of references) {
  const url = new URL(reference, `https://example.invalid${base}`);
  assert.ok(url.pathname.startsWith(base), `Asset escapes repository base: ${reference}`);
  exactFile("dist", decodeURIComponent(url.pathname.slice(base.length)));
}
const assets = ["favicon.svg", ...products.flatMap(product => product.images), ...videoReviews.flatMap(review => [review.videoSrc, review.poster]).filter(Boolean)];
for (const asset of assets) exactFile("dist", asset.replace(/^\/+/, ""));
assert.ok(!existsSync("CNAME") && !existsSync("public/CNAME") && !existsSync("dist/CNAME"), "This site does not use a custom domain.");
console.log(`Pages artifact verified: ${base}, compiled JavaScript, no placeholders, ${assets.length} correctly cased public assets.`);
