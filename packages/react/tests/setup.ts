import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

window.PointerEvent = MouseEvent as typeof PointerEvent;

window.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(performance.now());
  return 1;
};

window.cancelAnimationFrame = () => undefined;
