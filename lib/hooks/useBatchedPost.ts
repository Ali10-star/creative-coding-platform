'use client';

import { useEffect, useRef, useCallback } from 'react';

type Post = (msg: { type: 'updateParam'; name: string; value: unknown }) => void;

/**
 ** Coalesces parameter updates so we post at most **once** per animation frame.
 *
 * - If the same `name` is set multiple times within a frame, only the latest
 *   value is sent (older ones are discarded — they'd be overwritten anyway).
 * - If different `name`s are set within a frame, each is sent as its own
 *   message on the next frame.
 * - Pending updates flush automatically; no manual flush needed.
 * - Cleanup cancels any pending frame on unmount.
 */
export function useBatchedPost(post: Post) {
  // Pending updates, keyed by param name — last value wins per frame.
  const pending = useRef<Map<string, unknown>>(new Map());
  const rafId = useRef<number | null>(null);

  const flush = useCallback(() => {
    rafId.current = null;

    for (const [name, value] of pending.current) {
      post({ type: 'updateParam', name, value });
    }

    pending.current.clear();
  }, [post]);

  const queueUpdate = useCallback((name: string, value: unknown) => {
    pending.current.set(name, value);

    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  // Cancel pending frame if the component unmounts mid-batch.
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return queueUpdate;
}