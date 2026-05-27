// components/bauhaus/Card.tsx
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CornerShape = "circle" | "square" | "triangle" | "none";
type CornerColor = "red" | "blue" | "yellow";

interface Props extends HTMLAttributes<HTMLDivElement> {
  cornerShape?: CornerShape;
  cornerColor?: CornerColor;
  lift?: boolean;             // enable hover lift
  children: ReactNode;
}

const CORNER_COLOR: Record<CornerColor, string> = {
  red: "bg-bauhaus-red",
  blue: "bg-bauhaus-blue",
  yellow: "bg-bauhaus-yellow",
};

function CornerDecoration({ shape, color }: { shape: CornerShape; color: CornerColor }) {
  if (shape === "none") return null;
  const base = "absolute top-3 right-3 w-4 h-4 border-2 border-bauhaus-fg";
  const shapeClass =
    shape === "circle" ? "rounded-full" :
    shape === "triangle" ? "bauhaus-triangle border-0" :
    "rounded-none";
  return <span aria-hidden className={cn(base, shapeClass, CORNER_COLOR[color])} />;
}

export function Card({
  cornerShape = "none",
  cornerColor = "red",
  lift = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "relative bg-white border-4 border-bauhaus-fg shadow-bauhaus-lg p-6 rounded-none",
        lift && "bauhaus-lift",
        className
      )}
      {...rest}
    >
      <CornerDecoration shape={cornerShape} color={cornerColor} />
      {children}
    </div>
  );
}

// Convenience subcomponents to keep card content visually consistent.
// (Not enforced — you can put any markup inside <Card>.)
export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-2xl mb-3", className)}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-base leading-relaxed font-medium", className)}>
      {children}
    </p>
  );
}
