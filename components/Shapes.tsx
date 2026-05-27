// components/bauhaus/Shapes.tsx
// Pure geometric primitives — circle, square, triangle.
// Used both as decorative elements and as the building blocks of the logo
// and any "constructed" composition.

import { cn } from "@/lib/cn";

type Color = "red" | "blue" | "yellow" | "black" | "white";

const COLOR_CLASS: Record<Color, string> = {
  red: "bg-bauhaus-red",
  blue: "bg-bauhaus-blue",
  yellow: "bg-bauhaus-yellow",
  black: "bg-bauhaus-fg",
  white: "bg-white",
};

interface ShapeProps {
  size?: number;        // pixel size — defaults to 48
  color?: Color;
  bordered?: boolean;   // adds 2px black border
  className?: string;
}

export function Circle({ size = 48, color = "red", bordered = true, className }: ShapeProps) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "inline-block rounded-full",
        COLOR_CLASS[color],
        bordered && "border-2 border-bauhaus-fg",
        className
      )}
    />
  );
}

export function Square({ size = 48, color = "blue", bordered = true, className }: ShapeProps) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "inline-block",
        COLOR_CLASS[color],
        bordered && "border-2 border-bauhaus-fg",
        className
      )}
    />
  );
}

export function Triangle({ size = 48, color = "yellow", className }: ShapeProps) {
  // Triangles use clip-path; borders on clipped shapes don't render the way
  // people usually expect, so we skip the `bordered` prop here.
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn("inline-block bauhaus-triangle", COLOR_CLASS[color], className)}
    />
  );
}

// ---------------------------------------------------------------------------
// GeometricLogo — circle + square + triangle, as specified for the nav brand.
// ---------------------------------------------------------------------------
export function GeometricLogo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-end gap-1.5" aria-label="Logo">
      <Circle size={size} color="red" />
      <Square size={size} color="blue" />
      <Triangle size={size} color="yellow" />
    </span>
  );
}
