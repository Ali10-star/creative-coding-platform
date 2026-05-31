'use client';

import { useEffect, useRef, useCallback, type RefObject } from 'react';

type ParentMessage =
  | {
      type: 'init';
      code: string;
      params: Record<string, unknown>;
      importMap?: object;
    }
  | { type: 'updateParam'; name: string; value: unknown }
  | { type: 'action'; name: string };

type SketchMessage =
  | { type: 'ready' }
  | { type: 'heartbeat' }
  | { type: 'error'; message: string; stack?: string };

interface Options {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  onReady: () => void;
  onError: (err: { message: string; stack?: string }) => void;
  onHeartbeat: () => void;
}

export function useSketchMessenger({ iframeRef, onReady, onError, onHeartbeat }: Options) {
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const onHeartbeatRef = useRef(onHeartbeat);

  useEffect(() => {
    onHeartbeatRef.current = onHeartbeat;
  }, [onHeartbeat]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    function handle(e: MessageEvent<SketchMessage>) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === 'ready') onReadyRef.current();
      if (e.data?.type === 'heartbeat') onHeartbeatRef.current?.();
      if (e.data?.type === 'error')
        onErrorRef.current({ message: e.data.message, stack: e.data.stack });
    }

    window.addEventListener('message', handle);
    return () => {
      window.removeEventListener('message', handle);
    };
  }, [iframeRef]);

  const post = useCallback(
    (msg: ParentMessage) => {
      iframeRef.current?.contentWindow?.postMessage(msg, '*');
    },
    [iframeRef],
  );

  return { post };
}
