'use client';

import { cn } from "@/lib/cn";
import { useId } from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (_v: boolean) => void;
}

const Switch: React.FC<Props> = ({ label, checked, onChange }) => {
  const id = useId();

  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest cursor-pointer">
        {label}
      </label>

      {/* The visible toggle. We use a real <button> for native focus/keyboard support;
          the hidden <input> behind it carries the form value if this is ever in a form. */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-block w-12 h-6 border-2 border-bauhaus-fg rounded-none transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-bauhaus-yellow focus-visible:ring-offset-2',
          checked ? 'bg-bauhaus-blue' : 'bg-bauhaus-muted'
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-0 left-0 w-5 h-5 bg-bauhaus-fg rounded-none transition-transform duration-150',
            checked && 'translate-x-[22px]'
          )}
        />
      </button>
    </div>
  )
}

export default Switch;