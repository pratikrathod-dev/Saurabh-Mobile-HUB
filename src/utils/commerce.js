export const cartSubtotal = (cart, products) =>
  cart.reduce(
    (sum, item) =>
      sum + (products.find((p) => p.id === item.id)?.price || 0) * item.qty,
    0,
  );
export const couponDiscount = (subtotal, coupon) =>
  coupon.trim().toUpperCase() === "SAURABH10" ? Math.round(subtotal * 0.1) : 0;
export const validPhone = (value) =>
  /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, ""));
export function filterProducts(
  products,
  {
    category = "",
    brand = "",
    max = 150000,
    rating = 0,
    stock = false,
    search = "",
    sort = "relevance",
  } = {},
) {
  let list = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!brand || p.brand === brand) &&
      p.price <= Number(max) &&
      p.rating >= Number(rating) &&
      (!stock || p.inStock) &&
      `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase()),
  );
  return [...list].sort((a, b) =>
    sort === "low"
      ? a.price - b.price
      : sort === "high"
        ? b.price - a.price
        : sort === "rating"
          ? b.rating - a.rating
          : sort === "newest"
            ? Number(b.tags.includes("new")) - Number(a.tags.includes("new"))
            : 0,
  );
}
