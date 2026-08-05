import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PointerEvent,
  useRef,
} from "react";
import { useGlassPointer } from "./use-glass-pointer";

export type GlassIntensity = "subtle" | "standard" | "strong";

interface GlassProps {
  intensity?: GlassIntensity;
  interactive?: boolean;
}

export interface LiquidGlassProps
  extends HTMLAttributes<HTMLDivElement>, GlassProps {}

export interface LiquidGlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, GlassProps {}

function glassClassName(className: string | undefined): string {
  return ["liquid-glass", className].filter(Boolean).join(" ");
}

export function LiquidGlass({
  children,
  className,
  intensity = "standard",
  interactive = false,
  onPointerMove,
  onPointerLeave,
  ...props
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glassPointer = useGlassPointer(ref, interactive);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    glassPointer.onPointerMove(event);
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    glassPointer.onPointerLeave();
    onPointerLeave?.(event);
  }

  return (
    <div
      {...props}
      ref={ref}
      className={glassClassName(className)}
      data-intensity={intensity}
      data-interactive={interactive || undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="liquid-glass__content">{children}</span>
    </div>
  );
}

export function LiquidGlassButton({
  children,
  className,
  intensity = "standard",
  interactive = true,
  type = "button",
  disabled,
  onPointerMove,
  onPointerLeave,
  ...props
}: LiquidGlassButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const glassPointer = useGlassPointer(ref, interactive && !disabled);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    glassPointer.onPointerMove(event);
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: PointerEvent<HTMLButtonElement>) {
    glassPointer.onPointerLeave();
    onPointerLeave?.(event);
  }

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      className={glassClassName(className)}
      data-intensity={intensity}
      data-interactive={interactive && !disabled ? true : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="liquid-glass__content">{children}</span>
    </button>
  );
}
