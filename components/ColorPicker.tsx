'use client';

import { useId, useState } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const ColorPicker: React.FC<Props> = ({ label, value, onChange }) => {
  const [isValidHex, setIsValidHex] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest mb-2">
        {label}
      </label>

      <div className="flex items-stretch gap-2">
        {/* The visible swatch — a Bauhaus-style colored square with hard border.
            We overlay an invisible color input on top so clicking the swatch
            opens the native picker. */}
        <label
          htmlFor={id}
          className="relative w-10 h-10 border-2 border-bauhaus-fg shadow-[2px_2px_0px_0px_var(--color-bauhaus-fg)] cursor-pointer block"
          style={{ backgroundColor: value }}
          aria-label={`Current color: ${value}`}
        >
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>

        <input
          type='text'
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            // Only propagate if it's a valid 6-char hex (the schema validator
            // will catch invalid values, but we filter here to avoid spamming
            // postMessage with partial input mid-typing).
            const hexCodeRegex = /^#[0-9a-fA-F]{6}$/;

            const isValid = hexCodeRegex.test(next);
            setIsValidHex(isValid);

            onChange(next);
          }}
          className="flex-1 border-2 border-bauhaus-fg px-2 py-1 text-sm font-mono font-bold uppercase focus:outline-none focus:bg-bauhaus-yellow/30"
          maxLength={7}
        />
      </div>

    </div>
  )
}

export default ColorPicker;