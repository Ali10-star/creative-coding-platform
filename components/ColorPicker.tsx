'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const ColorPicker: React.FC<Props> = ({ label, value, onChange }) => {
  const [textValue, setTextValue] = useState(value);
  const debounceTimerRef = useRef<number | null>(null);
  const id = useId();

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    },
    [],
  );

  const emitColor = (next: string) => {
    onChange(next);
  };

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
            onInput={(e) => {
              const next = e.currentTarget.value;
              setTextValue(next);
              emitColor(next);
            }}
            onChange={(e) => {
              const next = e.currentTarget.value;
              setTextValue(next);
              emitColor(next);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>

        <input
          type='text'
          value={textValue}
          onChange={(e) => {
            const next = e.target.value;
            setTextValue(next);

            // Only propagate complete hex values; this avoids sending partial
            // values while users are still typing.
            const hexCodeRegex = /^#[0-9a-fA-F]{6}$/;
            if (!hexCodeRegex.test(next)) return;

            if (debounceTimerRef.current !== null) {
              window.clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = window.setTimeout(() => {
              emitColor(next);
            }, 80);
          }}
          className="flex-1 border-2 border-bauhaus-fg px-2 py-1 text-sm font-mono font-bold uppercase focus:outline-none focus:bg-bauhaus-yellow/30"
          maxLength={7}
        />
      </div>

    </div>
  )
}

export default ColorPicker;