'use client';

import { useEffect, useState } from 'react';
import { Button } from '../Button';

const CONFIRM_WINDOW_MS = 3000;

const DeleteSketchButton: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isConfirming) return;

    const timeoutId = setTimeout(() => {
      setIsConfirming(false);
    }, CONFIRM_WINDOW_MS);

    return () => clearTimeout(timeoutId);
  }, [isConfirming]);

  if (!isConfirming) {
    return (
      <Button
        type="button"
        variant="red"
        size="sm"
        onClick={() => setIsConfirming(true)}
      >
        Delete
      </Button>
    );
  }

  return (
    <Button type="submit" variant="red" size="sm">
      Confirm Delete
    </Button>
  );
};

export default DeleteSketchButton;
