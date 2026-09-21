import { useMemo } from "react";

export function useInitialViewportTarget() {
  return useMemo(() => {
    // ensure we're running on the client side
    if (typeof window === "undefined") return 1600;

    // find the largest dimension of the viewport
    const maxCurrentDimension = Math.max(window.innerWidth, window.innerHeight);

    return maxCurrentDimension;
  }, []); // empty dependency array means this calculation runs only once
}
