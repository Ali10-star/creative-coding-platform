'use client';

import { Action, Parameter } from '@/lib/schemas/parameterSchema';
import Slider from './Slider';
import Switch from './Switch';
import ColorPicker from './ColorPicker';
import Select from './Select';
import { ActionButton } from './ActionButton';

const DEFAULT_ACTION_COOLDOWN_MS = 150;

interface Props {
  schema: Parameter[];
  values: Record<string, unknown>;
  actions: Action[];
  onChange: (name: string, value: unknown) => void;
  onAction: (name: string) => void;
}

const ParameterControls: React.FC<Props> = ({
  schema,
  values,
  actions,
  onChange,
  onAction,
}) => {
  return (
    <div className="border-bauhaus-fg shadow-bauhaus- lg min-w-[260px] space-y-4 border-4 bg-white p-5">
      <p className="border- b-2 border-bauhaus-fg pb-2 text-xs font-bold tracking-widest uppercase">
        Controls
      </p>

      {schema.map((p) => {
        switch (p.type) {
          case 'number':
            return (
              <Slider
                key={p.name}
                label={p.label ?? p.name}
                value={values[p.name] as number}
                min={p.min ?? 0}
                max={p.max ?? 100}
                step={p.step ?? 1}
                onChange={(v) => onChange(p.name, v)}
              />
            );
          case 'boolean':
            return (
              <Switch
                key={p.name}
                label={p.label ?? p.name}
                checked={values[p.name] as boolean}
                onChange={(v) => onChange(p.name, v)}
              />
            );
          case 'color':
            return (
              <ColorPicker
                key={p.name}
                label={p.label ?? p.name}
                value={values[p.name] as string}
                onChange={(v) => onChange(p.name, v)}
              />
            );
          case 'select':
            return (
              <Select
                key={p.name}
                label={p.label ?? p.name}
                value={values[p.name] as string}
                options={p.options}
                onChange={(v) => onChange(p.name, v)}
              />
            );
          default:
            return null;
        }
      })}

      {actions.length > 0 && (
        <div className="border-bauhaus-fg flex flex-wrap gap-2 border-t-2 pt-3">
          {actions.map((act) => (
            <ActionButton
              key={act.name}
              name={act.name}
              label={act.label || act.name}
              onTrigger={onAction}
              cooldownMs={act.cooldownMs ?? DEFAULT_ACTION_COOLDOWN_MS}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParameterControls;
