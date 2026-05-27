// components/bauhaus/Accordion.tsx
"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface Item {
  question: string;
  answer: ReactNode;
}

interface Props {
  items: Item[];
}

// Simple, controlled-internally accordion. For a real app you may swap this
// for @radix-ui/react-accordion wrapped in Bauhaus styles.
export function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={i}
            className="border-4 border-bauhaus-fg shadow-bauhaus bg-white rounded-none"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className={cn(
                "w-full flex items-center justify-between gap-4 p-5 text-left",
                "font-bold uppercase tracking-wider transition-colors duration-200",
                open ? "bg-bauhaus-red text-white" : "bg-white text-bauhaus-fg hover:bg-bauhaus-muted"
              )}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-6 w-6 shrink-0 transition-transform duration-200",
                  open && "rotate-180"
                )}
                strokeWidth={3}
              />
            </button>

            {open && (
              <div className="bg-bauhaus-cream text-bauhaus-fg border-t-4 border-bauhaus-fg p-5 font-medium leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
