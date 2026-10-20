import { Component } from "react";
import { BrandIcon } from "./Logo";
import { shopInfo } from "../../data/shopInfo";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error("The shop could not start.", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="brand-loading brand-error" role="alert">
      <BrandIcon />
      <strong>{shopInfo.name}</strong>
      <h1>We couldn’t open the shop.</h1>
      <p>Please reload the page to try again.</p>
      <button type="button" className="button" onClick={() => window.location.reload()}>Reload</button>
    </main>;
  }
}
