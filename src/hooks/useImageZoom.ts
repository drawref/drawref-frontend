import { useCallback, useEffect, useRef, useState } from "react";

// minimum and maximum zoom levels for the session image
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 8;
// how much each mouse-wheel notch changes the zoom level
const WHEEL_ZOOM_STEP = 0.0025;
// total pointer travel (px) beyond which a gesture counts as a drag, not a tap
const DRAG_THRESHOLD = 6;

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface Point {
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

function touchMidpoint(touches: TouchList): Point {
  const [a, b] = [touches[0], touches[1]];
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
}

/** Position of a single touch, used for one-finger panning. */
function touchMidpointSingle(touches: TouchList): Point {
  return { x: touches[0].clientX, y: touches[0].clientY };
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
  // active mouse pointers, and active touches, keyed by identifier
  const pointers = useRef<Map<number, Point>>(new Map());
  const touches = useRef<Map<number, Point>>(new Map());
  const pinchStart = useRef<{ distance: number; midpoint: Point; transform: Transform } | null>(null);
  const panStart = useRef<{ midpoint: Point; transform: Transform } | null>(null);
  // total travel for the current gesture, used to tell taps from drags
  const dragDistance = useRef(0);
  const suppressClick = useRef(false);

  const applyTransform = useCallback(
    (next: Transform, gesture?: { start: Transform; startMidpoint: Point; midpoint: Point }) => {
      const element = ref.current;
      const rect = element?.getBoundingClientRect();
      const width = rect?.width ?? 0;
      const height = rect?.height ?? 0;

      const clampedScale = clamp(next.scale, MIN_ZOOM, MAX_ZOOM);
      let { x, y } = next;

      if (gesture && element) {
        // Keep the image point that sat under the gesture midpoint pinned to the
        // midpoint's current position. For a pure zoom this keeps the pivot under
        // the fingers; for a two-finger drag it also moves the image along.
        const centreX = rect!.left + width / 2;
        const centreY = rect!.top + height / 2;
        const ratio = clampedScale / gesture.start.scale;

        // offset of the anchor from the container centre, in image space
        const startOffsetX = gesture.startMidpoint.x - centreX - gesture.start.x;
        const startOffsetY = gesture.startMidpoint.y - centreY - gesture.start.y;

        x = gesture.midpoint.x - centreX - startOffsetX * ratio;
        y = gesture.midpoint.y - centreY - startOffsetY * ratio;
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

  // Raw touch handling: this is what actually works on iPadOS. Safari claims an
  // unhandled pinch for its own page zoom before pointer events reach us, so a
  // two-finger pinch/drag is driven from touchstart/touchmove/touchend directly.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const beginTwoFingerGesture = (list: TouchList) => {
      pinchStart.current = {
        distance: touchDistance(list),
        midpoint: touchMidpoint(list),
        transform: transformRef.current,
      };
      panStart.current = { midpoint: touchMidpoint(list), transform: transformRef.current };
    };

    const snapshotTouches = (list: TouchList) => {
      touches.current = new Map(
        Array.from(list).map((touch) => [touch.identifier, { x: touch.clientX, y: touch.clientY }]),
      );
    };

    // Re-baseline a one-finger pan whenever the number of active touches changes
    // (e.g. lifting one finger out of a pinch must not jump the image). Uses the
    // latest known touch point so the delta starts from zero.
    let lastTouchCount = 0;
    const refreshPanOrigin = (list: TouchList) => {
      if (list.length === 1) {
        panStart.current = { midpoint: touchMidpointSingle(list), transform: transformRef.current };
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      snapshotTouches(event.touches);
      lastTouchCount = event.touches.length;
      if (event.touches.length >= 2) {
        // prevent the very first move being claimed by native page zoom
        event.preventDefault();
        dragDistance.current = 0;
        suppressClick.current = true;
        beginTwoFingerGesture(event.touches);
      } else {
        // one finger only pans once we're zoomed in; at default zoom it is left
        // alone so taps and page gestures still work normally
        panStart.current = { midpoint: touchMidpointSingle(event.touches), transform: transformRef.current };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      snapshotTouches(event.touches);

      // the finger count changed (e.g. pinch -> one finger); restart the baseline
      if (event.touches.length !== lastTouchCount) {
        lastTouchCount = event.touches.length;
        refreshPanOrigin(event.touches);
      }

      // one finger: pan only while zoomed in, otherwise ignore it entirely
      if (event.touches.length < 2) {
        if (event.touches.length === 1 && transformRef.current.scale > MIN_ZOOM) {
          // keep the page from scroll-flicking under the finger while panning
          event.preventDefault();
          dragDistance.current += 1;
          if (dragDistance.current > DRAG_THRESHOLD) {
            suppressClick.current = true;
          }

          const midpoint = touchMidpointSingle(event.touches);
          const pan = panStart.current;
          if (pan) {
            applyTransform(
              { ...transformRef.current, x: pan.transform.x, y: pan.transform.y },
              { start: pan.transform, startMidpoint: pan.midpoint, midpoint },
            );
          }
        }
        return;
      }

      // stop iPadOS hijacking the pinch/drag for its own page gestures
      event.preventDefault();
      suppressClick.current = true;
      if (!pinchStart.current) {
        beginTwoFingerGesture(event.touches);
      }

      const distance = touchDistance(event.touches);
      const midpoint = touchMidpoint(event.touches);
      const pinch = pinchStart.current!;

      // pinch scales around the fingers; dragging the midpoint moves the image
      const scale = clamp(pinch.transform.scale * (distance / pinch.distance), MIN_ZOOM, MAX_ZOOM);
      applyTransform(
        { scale, x: pinch.transform.x, y: pinch.transform.y },
        { start: pinch.transform, startMidpoint: pinch.midpoint, midpoint },
      );
    };

    const onTouchEnd = (event: TouchEvent) => {
      snapshotTouches(event.touches);
      lastTouchCount = event.touches.length;
      if (event.touches.length < 2) {
        pinchStart.current = null;
        panStart.current = null;
      }
      // if a finger remains after a pinch, restart panning from where it is now
      refreshPanOrigin(event.touches);
    };

    element.addEventListener("touchstart", onTouchStart, { passive: false });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd);
    element.addEventListener("touchcancel", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [ref, applyTransform]);

  // Desktop-only handling: mouse wheel zooms, mouse drag pans. Touch is dealt
  // with by the raw touch listeners above, so touch pointers are ignored here.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const start = transformRef.current;
      const nextScale = start.scale * (1 - event.deltaY * WHEEL_ZOOM_STEP);
      const pointer = { x: event.clientX, y: event.clientY };
      applyTransform(
        { scale: nextScale, x: start.x, y: start.y },
        { start, startMidpoint: pointer, midpoint: pointer },
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (pointers.current.size === 0) {
        dragDistance.current = 0;
        suppressClick.current = false;
      }
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const previous = pointers.current.get(event.pointerId);
      if (!previous) return;
      const next = { x: event.clientX, y: event.clientY };
      pointers.current.set(event.pointerId, next);

      // accumulate travel so a real drag can be distinguished from a tap
      dragDistance.current += Math.hypot(next.x - previous.x, next.y - previous.y);
      if (dragDistance.current > DRAG_THRESHOLD) {
        suppressClick.current = true;
      }

      // mouse drag pans; there is nothing to pan until we're zoomed in
      if (transformRef.current.scale > MIN_ZOOM) {
        applyTransform({
          scale: transformRef.current.scale,
          x: transformRef.current.x + (next.x - previous.x),
          y: transformRef.current.y + (next.y - previous.y),
        });
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      pointers.current.delete(event.pointerId);
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove, { passive: false });
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    element.addEventListener("pointerleave", onPointerUp);

    // swallow the click that finishes a drag/zoom so it isn't treated as a tap
    const onClickCapture = (event: MouseEvent) => {
      if (suppressClick.current) {
        event.stopPropagation();
        event.preventDefault();
        suppressClick.current = false;
      }
    };
    element.addEventListener("click", onClickCapture, true);

    return () => {
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.removeEventListener("pointerleave", onPointerUp);
      element.removeEventListener("click", onClickCapture, true);
    };
  }, [ref, applyTransform]);

  // true once per gesture if the previous gesture was a drag/zoom, so callers
  // can ignore the trailing click that follows it
  const consumeSuppressedClick = useCallback(() => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return true;
    }
    return false;
  }, []);

  return { transform, zoomed: transform.scale > MIN_ZOOM, consumeSuppressedClick };
}
