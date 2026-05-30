'use client';

import { useId } from 'react';
import ReactSelect, { type StylesConfig } from 'react-select';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

// react-select's option shape — its API works in {label, value} objects,
// while our schema uses plain strings. We adapt at the boundary.
type Opt = { label: string; value: string };

// Bauhaus colors as JS values, since react-select's style API runs at JS time
// (it can't read CSS variables directly without a helper).
const C = {
  fg: '#121212',
  bg: '#FFFFFF',
  red: '#D02020',
  yellow: '#F0C020',
  muted: '#E0E0E0',
};

// Style overrides. react-select renders ~10 internal components; we restyle
// each one to match Bauhaus. The pattern is: spread `base` to keep functional
// styles, then override visual properties.
const bauhausStyles: StylesConfig<Opt, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: C.bg,
    border: `2px solid ${C.fg}`,
    borderRadius: 0,
    boxShadow: state.isFocused ? `2px 2px 0px 0px ${C.fg}` : 'none',
    minHeight: '36px',
    cursor: 'pointer',
    transition: 'box-shadow 100ms ease-out',
    '&:hover': { borderColor: C.fg },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  singleValue: (base) => ({
    ...base,
    color: C.fg,
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: C.fg,
    padding: '4px 6px',
    '&:hover': { color: C.fg },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: C.bg,
    border: `2px solid ${C.fg}`,
    borderRadius: 0,
    boxShadow: `4px 4px 0px 0px ${C.fg}`,
    marginTop: 4,
    overflow: 'hidden',
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? C.red
      : state.isFocused
        ? C.yellow
        : C.bg,
    color: state.isSelected ? C.bg : C.fg,
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    padding: '8px 12px',
    borderBottom: `2px solid ${C.fg}`,
    '&:last-of-type': { borderBottom: 'none' },
    '&:active': { backgroundColor: C.red, color: C.bg },
  }),
  input: (base) => ({
    ...base,
    color: C.fg,
    fontWeight: 700,
    textTransform: 'uppercase',
  }),
};

const Select: React.FC<Props> = ({ label, value, options, onChange }) => {
  const id = useId();
  const opts: Opt[] = options.map((o) => ({ label: o, value: o }));
  const selected = opts.find((o) => o.value === value) ?? null;

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest mb-2">
        {label}
      </label>
      <ReactSelect<Opt>
        inputId={id}
        value={selected}
        onChange={(opt) => opt && onChange(opt.value)}
        options={opts}
        styles={bauhausStyles}
        isSearchable={options.length > 8}  // searchable only when meaningful
        menuPlacement="auto"
      />
    </div>
  )
}

export default Select;