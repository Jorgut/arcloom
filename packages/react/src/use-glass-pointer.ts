import { type PointerEvent, type RefObject, useCallback, useEffect, useRef } from "react";

type GlassElement = HTMLDivElement | HTMLButtonElement;

interface GlassPointerHandlers<T extends GlassElement> {
  onPointerMove: (event: PointerEvent<T>) => void;
  onPointerLeave: () => void;
}

export function useGlassPointer<T extends GlassElement>(
  ref: RefObject<T | null>,
  enabled: boolean,
): GlassPointerHandlers<T> {
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: 0.5, y: 0.5 });

  const applyPoint = useCallback(() => {
    frameRef.current = null;
    const element = ref.current;
    if (!element) return;

    const { x, y } = pointRef.current;
    element.style.setProperty("--lg-pointer-x", `${x * 100}%`);
    element.style.setProperty("--lg-pointer-y", `${y * 100}%`);
    element.style.setProperty("--lg-shift-x", String((x - 0.5) * 2));
    element.style.setProperty("--lg-shift-y", String((y - 0.5) * 2));
  }, [ref]);

  const schedulePoint = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(applyPoint);
    }
  }, [applyPoint]);

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (!enabled || event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      pointRef.current = {
        x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
        y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
      };
      schedulePoint();
    },
    [enabled, schedulePoint],
  );

  const onPointerLeave = useCallback(() => {
    if (!enabled) return;
    pointRef.current = { x: 0.5, y: 0.5 };
    schedulePoint();
  }, [enabled, schedulePoint]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return { onPointerMove, onPointerLeave };
}
