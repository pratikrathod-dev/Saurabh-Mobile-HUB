import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Footer, FloatingActions, BottomNavigation } from "./components/layout/Layout";
import CartDrawer from "./components/product/CartDrawer";
import { Empty } from "./components/ui/Common";
import Logo, { BrandLoading } from "./components/ui/Logo";
import { pageMetadata } from "./utils/pageMetadata";
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Contact = lazy(() => import("./pages/Contact"));
export default function App() {
  const location = useLocation();
  useEffect(() => {
    const metadata = pageMetadata(location.pathname);
    document.title = metadata.title;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    window.scrollTo(0, 0);
    document
      .querySelectorAll(".desktop-nav details[open]")
      .forEach((d) => d.removeAttribute("open"));
  }, [location.pathname]);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={<BrandLoading />}
        >
          <div key={location.pathname} className="page-enter">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="*"
                element={
                  <><div className="not-found-brand"><Logo showTagline /></div><Empty
                    title="This page took a wrong turn."
                    text="Let’s get you back to something good."
                    action="Back to home"
                    to="/"
                  /></>
                }
              />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
      <BottomNavigation />
    </>
  );
}
