'use client';

import { useBatchedPost } from '@/lib/hooks/useBatchedPost';
import { useSketchMessenger } from '@/lib/hooks/useSketchMessenger';
import { BASE_IMPORT_MAPS } from '@/lib/runtimeTemplates';
import { Action, Parameter, Runtime } from '@/lib/schemas/parameterSchema';
import { useCallback, useEffect, useRef, useState } from 'react';
import ParameterControls from './ParameterControls';

interface Props {
  code: string;
  runtime: Runtime;
  extraImports?: Record<string, string>;
  parameters: Parameter[];
  actions: Action[];
}

type Status = 'loading' | 'running' | 'error';

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
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(parameters.map((p) => [p.name, p.default])),
  );

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
        params: values,
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

  const updateParam = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      queueUpdate(name, value);
    },
    [queueUpdate],
  );

  const triggerAction = useCallback(
    (name: string) => {
      post({ type: 'action', name });
    },
    [post],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-full">
      <div className="border-bauhaus-fg relative h-full w-full border-4 bg-white">
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
          <div className="bg-bauhaus-red border-bauhaus-fg shadow-bauhaus-sm text- sm absolute right-4 bottom-4 left-4 border-2 px-3 py-2 font-bold tracking-wider text-white uppercase">
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
      />
    </div>
  );
};

export default SketchEmbed;
