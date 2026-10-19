import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seedReviews } from "../data/reviews";
const Store = createContext(null);
export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage("smh-cart", []),
    [wishlist, setWishlist] = useLocalStorage("smh-wishlist", []),
    [reviews, setReviews] = useLocalStorage("smh-reviews", seedReviews),
    [drawer, setDrawer] = useState(false),
    [toast, setToast] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const notify = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3500);
  };
  const add = (product, qty = 1, color = product.colors[0]) => {
    if (!product.inStock) return;
    setCart((items) => {
      const found = items.find((x) => x.id === product.id && x.color === color);
      return found
        ? items.map((x) =>
            x === found ? { ...x, qty: Math.min(10, x.qty + qty) } : x,
          )
        : [...items, { id: product.id, qty, color }];
    });
    notify(`${product.name} added to your bag`);
    setDrawer(true);
  };
  const toggleWishlist = (id) => {
    setWishlist((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id],
    );
    notify(
      wishlist.includes(id)
        ? "Removed from wishlist"
        : "Saved to your wishlist",
    );
  };
  const updateQty = (id, color, qty) =>
    setCart((items) =>
      items.map((x) =>
        x.id === id && x.color === color
          ? { ...x, qty: Math.max(1, Math.min(10, qty)) }
          : x,
      ),
    );
  const remove = (id, color) =>
    setCart((items) =>
      items.filter((x) => !(x.id === id && x.color === color)),
    );
  return (
    <Store.Provider
      value={{
        cart,
        setCart,
        wishlist,
        reviews,
        setReviews,
        drawer,
        setDrawer,
        toast,
        notify,
        add,
        toggleWishlist,
        updateQty,
        remove,
      }}
    >
      {children}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        {toast}
      </div>
    </Store.Provider>
  );
}
export const useStore = () => useContext(Store);
