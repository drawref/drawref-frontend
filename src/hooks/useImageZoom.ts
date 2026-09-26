import { useCallback, useEffect, useRef, useState } from "react";

// minimum and maximum zoom levels for the session image
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 8;
// how much each mouse-wheel notch changes the zoom level
const WHEEL_ZOOM_STEP = 0.0025;

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface PointerInfo {
  x: number;
  y: number;
}

const IDENTITY: Transform = { scale: MIN_ZOOM, x: 0, y: 0 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Distance between two touch points, used to derive the pinch scale.
 */
function touchDistance(touches: TouchList) {
  const [a, b] = [touches[0], touches[1]];
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function touchMidpoint(touches: TouchList): PointerInfo {
  const [a, b] = [touches[0], touches[1]];
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
}

/**
 * Keeps a zoomed image from being dragged entirely out of view. When the image
 * is larger than the viewport we allow panning within the overflow; when it is
 * smaller we keep it centred on the given axis.
 */
function clampTranslation(transform: Transform, width: number, height: number): Transform {
  const { scale } = transform;
  // only allow panning along an axis once the scaled image overflows the viewport
  const maxX = Math.max(0, (width * (scale - 1)) / 2);
  const maxY = Math.max(0, (height * (scale - 1)) / 2);

  return {
    scale,
    x: clamp(transform.x, -maxX, maxX),
    y: clamp(transform.y, -maxY, maxY),
  };
}

/**
 * Provides pan-and-zoom behaviour for a single image inside a container.
 *
 * Both mouse-wheel scrolling (desktop) and pinch-to-zoom (touch devices) drive
 * the zoom level. Because only the image element is transformed, any sibling UI
 * (timers, buttons, labels) is left untouched.
 *
 * @param ref   ref to the container element that clips the image
 * @param resetKey value that, when changed, snaps the image back to its default
 *                 zoom/position (e.g. when the session moves to a new image)
 */
export function useImageZoom(ref: React.RefObject<HTMLElement | null>, resetKey?: unknown) {
  const [transform, setTransform] = useState<Transform>(IDENTITY);
  // mutable copies of gesture state so event listeners don't need re-binding
  const transformRef = useRef<Transform>(IDENTITY);
  const pointers = useRef<Map<number, PointerInfo>>(new Map());
  const pinchStart = useRef<{ distance: number; midpoint: PointerInfo; transform: Transform } | null>(null);

  const applyTransform = useCallback(
    (next: Transform, anchor?: PointerInfo) => {
      const element = ref.current;
      const rect = element?.getBoundingClientRect();
      const width = rect?.width ?? 0;
      const height = rect?.height ?? 0;

      const clampedScale = clamp(next.scale, MIN_ZOOM, MAX_ZOOM);
      // keep the point under the anchor (cursor / pinch midpoint) fixed on screen
      let { x, y } = next;
      if (anchor && element) {
        const centreX = rect!.left + width / 2;
        const centreY = rect!.top + height / 2;
        const ratio = clampedScale / transformRef.current.scale;
        x = anchor.x - centreX - ratio * (anchor.x - centreX - x);
        y = anchor.y - centreY - ratio * (anchor.y - centreY - y);
      }

      const resolved =
        clampedScale <= MIN_ZOOM ? IDENTITY : clampTranslation({ scale: clampedScale, x, y }, width, height);
      transformRef.current = resolved;
      setTransform(resolved);
    },
    [ref],
  );

  // snap back to the default view on a new image
  useEffect(() => {
    transformRef.current = IDENTITY;
    setTransform(IDENTITY);
  }, [resetKey]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // desktop: mouse-wheel scrolling zooms toward the cursor
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const nextScale = transformRef.current.scale * (1 - event.deltaY * WHEEL_ZOOM_STEP);
      applyTransform({ ...transformRef.current, scale: nextScale }, { x: event.clientX, y: event.clientY });
    };

    const onPointerDown = (event: PointerEvent) => {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.current.size === 2) {
        const touches = {
          length: 2,
          0: pointers.current.values().next().value!,
          1: [...pointers.current.values()][1]!,
        } as unknown as TouchList;
        pinchStart.current = {
          distance: touchDistance(touches),
          midpoint: touchMidpoint(touches),
          transform: transformRef.current,
        };
      }
    };

    // track the first pointer so a single mouse drag can pan a zoomed image
    let panning = false;
    const onPointerMove = (event: PointerEvent) => {
      const previous = pointers.current.get(event.pointerId);
      if (!previous) return;
      const next = { x: event.clientX, y: event.clientY };
      pointers.current.set(event.pointerId, next);

      if (pointers.current.size >= 2 && pinchStart.current) {
        // touch: pinch-to-zoom around the midpoint of the two fingers
        event.preventDefault();
        const values = [...pointers.current.values()];
        const touches = { length: 2, 0: values[0], 1: values[1] } as unknown as TouchList;
        const distance = touchDistance(touches);
        const midpoint = touchMidpoint(touches);
        const start = pinchStart.current;
        applyTransform(
          { scale: start.transform.scale * (distance / start.distance), x: start.transform.x, y: start.transform.y },
          midpoint,
        );
      } else if (pointers.current.size === 1 && (panning || transformRef.current.scale > MIN_ZOOM)) {
        // mouse: dragging pans the zoomed image
        panning = true;
        applyTransform({
          ...transformRef.current,
          x: transformRef.current.x + (next.x - previous.x),
          y: transformRef.current.y + (next.y - previous.y),
        });
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      pointers.current.delete(event.pointerId);
      if (pointers.current.size < 2) {
        pinchStart.current = null;
      }
      if (pointers.current.size === 0) {
        panning = false;
      }
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove, { passive: false });
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    element.addEventListener("pointerleave", onPointerUp);

    return () => {
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.removeEventListener("pointerleave", onPointerUp);
    };
  }, [ref, applyTransform]);

  // Safari on iOS still fires non-standard gesture events for pinch-to-zoom
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let gestureStartScale = 1;
    const onGestureStart = (event: Event) => {
      event.preventDefault();
      gestureStartScale = transformRef.current.scale;
    };
    const onGestureChange = (event: Event) => {
      event.preventDefault();
      const scaleEvent = event as Event & { scale: number; clientX: number; clientY: number };
      applyTransform(
        { ...transformRef.current, scale: gestureStartScale * scaleEvent.scale },
        { x: scaleEvent.clientX, y: scaleEvent.clientY },
      );
    };
    const onGestureEnd = (event: Event) => event.preventDefault();

    element.addEventListener("gesturestart", onGestureStart);
    element.addEventListener("gesturechange", onGestureChange);
    element.addEventListener("gestureend", onGestureEnd);

    return () => {
      element.removeEventListener("gesturestart", onGestureStart);
      element.removeEventListener("gesturechange", onGestureChange);
      element.removeEventListener("gestureend", onGestureEnd);
    };
  }, [ref, applyTransform]);

  return { transform, zoomed: transform.scale > MIN_ZOOM };
}
