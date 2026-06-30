import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    __GA_MEASUREMENT_ID__?: string;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GaPageTracker() {
  const [location] = useLocation();

  useEffect(() => {
    if (!window.__GA_MEASUREMENT_ID__ || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location,
    });
  }, [location]);

  return null;
}
