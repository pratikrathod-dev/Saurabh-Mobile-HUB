import { shopInfo, brandDescription } from "../data/shopInfo.js";
import { products } from "../data/products.js";
import { categories } from "../data/categories.js";

export function pageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const pages = { "/": "Home", "/shop": "Shop", "/cart": "Cart", "/wishlist": "Wishlist", "/reviews": "Reviews", "/contact": "Contact" };
  let label = pages[path];
  if (path.startsWith("/product/")) label = products.find(p => path === `/product/${p.id}`)?.name;
  if (path.startsWith("/category/")) label = categories.find(c => path === `/category/${c.slug}`)?.name;
  return { title: `${label || "Page not found"} | ${shopInfo.name}`, description: brandDescription };
}
