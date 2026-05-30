'use client';

import { useId } from "react";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (_v: number) => void;
}

const Slider: React.FC<Props> = ({ label, value, min, max, step, onChange }) => {
  const id = useId();

  // Compute the "fill" percentage so we can color the active part of the track.
  // CSS variables would be cleaner long-term; inline style keeps it self-contained.
  const fillPercentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between ">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest">
          {label}
        </label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isNaN(next)) onChange(next);
          }}
          className="w-20 text-right text-xs font-mono font-bold border-2 border-bauhaus-fg px-1 py-0.5 focus:outline-none focus:bg-bauhaus-yellow/30"
        />
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right,
            var(--color-bauhaus-red) 0%,
            var(--color-bauhaus-red) ${fillPercentage}%,
            var(--color-bauhaus-fg) ${fillPercentage}%,
            var(--color-bauhaus-fg) 100%)`,
        }}
        className="
          w-full h-2 appearance-none cursor-pointer border-2 border-bauhaus-fg
          focus:outline-none focus-visible:ring-2 focus-visible:ring-bauhaus-yellow

          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bauhaus-fg
          [&::-webkit-slider-thumb]:rounded-none
          [&::-webkit-slider-thumb]:shadow-[2px_2px_0px_0px_var(--color-bauhaus-fg)]
          [&::-webkit-slider-thumb]:cursor-grab
          [&::-webkit-slider-thumb]:active:cursor-grabbing

          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bauhaus-fg
          [&::-moz-range-thumb]:rounded-none
          [&::-moz-range-thumb]:shadow-[2px_2px_0px_0px_var(--color-bauhaus-fg)]
          [&::-moz-range-thumb]:cursor-grab
        "
      />
    </div>
  )
};

export default Slider;