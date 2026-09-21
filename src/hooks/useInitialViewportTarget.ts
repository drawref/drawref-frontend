import { useMemo } from "react";

export function useInitialViewportTarget() {
  return useMemo(() => {
    // ensure we're running on the client side
    if (typeof window === "undefined") return 1600;

    // find the largest dimension of the viewport
    const maxCurrentDimension = Math.max(window.innerWidth, window.innerHeight);

    // detect devices with touch screens / pinch-to-zoom (e.g. tablets, phones)
    const canEasilyZoom =
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
      "ontouchstart" in window ||
      window.matchMedia?.("(any-pointer: coarse)")?.matches;

    // serve double size for devices that can easily zoom
    const scale = (window.devicePixelRatio || 1) * (canEasilyZoom ? 2 : 1);

    return Math.round(maxCurrentDimension * scale);
  }, []); // empty dependency array means this calculation runs only once
}
