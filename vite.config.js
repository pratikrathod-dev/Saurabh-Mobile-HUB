import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { shopInfo, brandDescription } from "./src/data/shopInfo.js";
const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
// Inject the shared brand into HTML for the initial response and production build.
export default defineConfig({ plugins: [react(), {
  name: "shared-brand-metadata",
  transformIndexHtml(html) {
    const tokens = { BRAND_NAME: shopInfo.name, BRAND_DESCRIPTION: brandDescription };
    return html.replace(/\{\{(BRAND_NAME|BRAND_DESCRIPTION)\}\}/g, (_, key) => escapeHtml(tokens[key]));
  },
}] });
