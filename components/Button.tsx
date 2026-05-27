// components/bauhaus/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "red" | "blue" | "yellow" | "outline" | "ghost";
type Shape = "square" | "pill";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  shape?: Shape;
  size?: Size;
}

// Variant → color classes. Yellow keeps black text; red/blue invert.
const VARIANTS: Record<Variant, string> = {
  red: "bg-bauhaus-red text-white border-2 border-bauhaus-fg shadow-bauhaus hover:bg-bauhaus-red/90",
  blue: "bg-bauhaus-blue text-white border-2 border-bauhaus-fg shadow-bauhaus hover:bg-bauhaus-blue/90",
  yellow: "bg-bauhaus-yellow text-bauhaus-fg border-2 border-bauhaus-fg shadow-bauhaus hover:bg-bauhaus-yellow/90",
  outline: "bg-white text-bauhaus-fg border-2 border-bauhaus-fg shadow-bauhaus hover:bg-bauhaus-muted",
  ghost: "border-0 text-bauhaus-fg hover:bg-bauhaus-muted shadow-none",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "red", shape = "square", size = "md", className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        // Base: uppercase, bold, tracked — every Bauhaus button looks like this
        "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider",
        // Press effect — utility defined in globals.css
        variant !== "ghost" && "bauhaus-press",
        shape === "pill" ? "rounded-full" : "rounded-none",
        VARIANTS[variant],
        SIZES[size],
        // Disabled state — washed out, no shadow, no press
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
