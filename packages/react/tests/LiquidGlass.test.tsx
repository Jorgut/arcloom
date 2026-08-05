import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LiquidGlass, LiquidGlassButton } from "../src/LiquidGlass";

describe("LiquidGlass", () => {
  it("renders arbitrary content without inventing button semantics", () => {
    render(<LiquidGlass data-testid="surface">Status panel</LiquidGlass>);

    expect(screen.getByTestId("surface")).toHaveTextContent("Status panel");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an accessible native button", () => {
    const onClick = vi.fn();
    render(<LiquidGlassButton onClick={onClick}>Continue</LiquidGlassButton>);

    const button = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(button);

    expect(button).toHaveAttribute("type", "button");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("preserves the disabled state", () => {
    render(<LiquidGlassButton disabled>Unavailable</LiquidGlassButton>);

    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });

  it("updates pointer CSS variables without a React render cycle", () => {
    render(<LiquidGlass data-testid="surface" interactive>Panel</LiquidGlass>);
    const surface = screen.getByTestId("surface");
    vi.spyOn(surface, "getBoundingClientRect").mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 210,
      bottom: 120,
      width: 200,
      height: 100,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(surface, {
      clientX: 160,
      clientY: 45,
      pointerType: "mouse",
    });

    expect(surface.style.getPropertyValue("--lg-pointer-x")).toBe("75%");
    expect(surface.style.getPropertyValue("--lg-pointer-y")).toBe("25%");
  });
});
