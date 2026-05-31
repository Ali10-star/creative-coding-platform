'use client';

import { useBatchedPost } from '@/lib/hooks/useBatchedPost';
import { cn } from '@/lib/cn';
import { useSketchMessenger } from '@/lib/hooks/useSketchMessenger';
import { BASE_IMPORT_MAPS } from '@/lib/runtimeTemplates';
import { Action, Parameter, Runtime } from '@/lib/schemas/parameterSchema';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import ParameterControls from './ParameterControls';

interface Props {
  code: string;
  runtime: Runtime;
  extraImports?: Record<string, string>;
  parameters: Parameter[];
  actions: Action[];
}

type Status = 'loading' | 'running' | 'error';
type ViewMode = 'split' | 'full-width';

// How long the iframe can go without a heartbeat before we consider it dead.
// Tuning notes:
//   - Should comfortably exceed the heartbeat interval (60 frames ≈ 1s at 60fps).
//   - Should be long enough that a slow first-load (Three.js, large CDN libs) doesn't trip it.
const WATCHDOG_TIMEOUT_MS = 10_000; // 10 seconds
const WATCHDOG_CHECK_INTERVAL_MS = 1000; // 1 second interval

const SketchEmbed: React.FC<Props> = ({
  code,
  runtime,
  extraImports = {},
  parameters = [],
  actions = [],
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(parameters.map((p) => [p.name, p.default])),
  );
  const valuesRef = useRef(values);
  const pendingUiUpdatesRef = useRef<Map<string, unknown>>(new Map());
  const uiRafRef = useRef<number | null>(null);

  const [error, setError] = useState<{
    message: string;
    stack?: string;
  } | null>(null);

  // Last time we heard from the iframe. Updated by every heartbeat AND by
  // 'ready', so the watchdog doesn't trip during slow first loads.
  const lastHeartbeatRef = useRef<number>(0);

  // Guard against double-init from React Strict Mode + retry-ready loop.
  const initSentRef = useRef(false);

  const markAlive = useCallback(() => {
    lastHeartbeatRef.current = Date.now();
  }, []);

  const { post } = useSketchMessenger({
    iframeRef,
    onReady: () => {
      markAlive();

      if (initSentRef.current) return;
      initSentRef.current = true;

      post({
        type: 'init',
        code,
        params: { ...valuesRef.current },
        importMap: {
          imports: { ...BASE_IMPORT_MAPS[runtime], ...extraImports },
        },
      });
      setStatus('running');
    },
    onError: (err) => {
      setError(err);
      setStatus('error');
    },
    onHeartbeat: () => {
      lastHeartbeatRef.current = Date.now();
    }
  });

  //! Watchdog: kills the iframe if it goes silent for too long.
  // Only runs while the sketch is actively running — not during loading or after error.
  useEffect(() => {
    if (status !== 'running') return;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - lastHeartbeatRef.current;
      if (elapsed > WATCHDOG_TIMEOUT_MS) {
        setError({
          message: `Sketch became unresponsive after ${Math.round(elapsed / 1000)}s and was stopped.`,
        });
        setStatus('error');

        if (iframeRef.current) {
          iframeRef.current.src = 'about:blank';
        }
      }

    }, WATCHDOG_CHECK_INTERVAL_MS);


    return () => clearInterval(intervalId);
  }, [status]);

  const queueUpdate = useBatchedPost(post);

  const flushUiUpdates = useCallback(() => {
    uiRafRef.current = null;
    if (pendingUiUpdatesRef.current.size === 0) return;

    const updates = Object.fromEntries(pendingUiUpdatesRef.current.entries());
    pendingUiUpdatesRef.current.clear();

    setValues((prev) => ({ ...prev, ...updates }));
  }, []);

  const queueUiUpdate = useCallback(
    (name: string, value: unknown) => {
      valuesRef.current[name] = value;
      pendingUiUpdatesRef.current.set(name, value);

      if (uiRafRef.current === null) {
        uiRafRef.current = requestAnimationFrame(flushUiUpdates);
      }
    },
    [flushUiUpdates],
  );

  useEffect(
    () => () => {
      if (uiRafRef.current !== null) {
        cancelAnimationFrame(uiRafRef.current);
      }
    },
    [],
  );

  const updateParam = useCallback(
    (name: string, value: unknown) => {
      queueUiUpdate(name, value);
      queueUpdate(name, value);
    },
    [queueUiUpdate, queueUpdate],
  );

  const triggerAction = useCallback(
    (name: string) => {
      post({ type: 'action', name });
    },
    [post],
  );

  const isFullWidth = viewMode === 'full-width';

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant={isFullWidth ? 'outline' : 'yellow'}
          size="sm"
          onClick={() => setViewMode('split')}
        >
          Split View
        </Button>
        <Button
          variant={isFullWidth ? 'yellow' : 'outline'}
          size="sm"
          onClick={() => setViewMode('full-width')}
        >
          Full-Width Sketch
        </Button>
      </div>

      <div
        className={cn(
          'h-full',
          isFullWidth
            ? 'flex min-h-0 flex-col gap-4'
            : 'grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]',
        )}
      >
        <div className="border-bauhaus-fg relative h-full min-h-[360px] w-full border-4 bg-white">
          <iframe
            ref={iframeRef}
            src="/sketch-runner"
            className="block h-full w-full border-0"
            sandbox="allow-scripts"
            allow=""
            referrerPolicy="no-referrer"
            title="Sketch"
          />
          {status === 'loading' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white">
              <span className="text-sm font-bold tracking-widest uppercase">
                Initializing Sketch...
              </span>
            </div>
          )}

          {error && (
            <div className="bg-bauhaus-red border-bauhaus-fg shadow-bauhaus-sm absolute right-4 bottom-4 left-4 border-2 px-3 py-2 text-sm font-bold tracking-wider text-white uppercase">
              {error.message}
            </div>
          )}
        </div>

        <ParameterControls
          schema={parameters}
          values={values}
          actions={actions}
          onChange={updateParam}
          onAction={triggerAction}
          layout={isFullWidth ? 'horizontal' : 'vertical'}
          className={
            isFullWidth
              ? 'w-full flex-none overflow-y-auto'
              : 'h-[520px] max-h-full self-start overflow-y-auto'
          }
        />
      </div>
    </div>
  );
};

export default SketchEmbed;
