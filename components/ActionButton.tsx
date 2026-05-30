'use client';

import { useState, useCallback } from 'react';
import { Button } from './Button';

interface Props {
  name: string;
  label: string;
  onTrigger: (name: string) => void;
  cooldownMs?: number;
}

export function ActionButton({
  name,
  label,
  onTrigger,
  cooldownMs = 150,
}: Props) {
  const [disabled, setDisabled] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled) return;

    onTrigger(name);
    setDisabled(true);

    const id = setTimeout(() => setDisabled(false), cooldownMs);

    return () => clearTimeout(id);
  }, [disabled, onTrigger, name, cooldownMs]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
