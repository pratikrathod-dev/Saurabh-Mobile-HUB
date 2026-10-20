import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { StoreProvider } from "./context/StoreContext";
import App from "./App";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import "./index.css";
import "./product-images.css";
import "./video-reviews.css";
import "./responsive.css";
import "./branding.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <MotionConfig reducedMotion="user">
        <StoreProvider>
          <App />
        </StoreProvider>
      </MotionConfig>
    </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
