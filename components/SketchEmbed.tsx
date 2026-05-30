'use client';

import { useBatchedPost } from '@/lib/hooks/useBatchedPost';
import { useSketchMessenger } from '@/lib/hooks/useSketchMessenger';
import { BASE_IMPORT_MAPS } from '@/lib/runtimeTemplates';
import { Action, Parameter, Runtime } from '@/lib/schemas/parameterSchema';
import { useCallback, useRef, useState } from 'react';
import ParameterControls from './ParameterControls';

interface Props {
  code: string;
  runtime: Runtime;
  extraImports?: Record<string, string>;
  parameters: Parameter[];
  actions: Action[];
}

type Status = 'loading' | 'running' | 'error';

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

  const { post } = useSketchMessenger({
    iframeRef,
    onReady: () => {
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
  });

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
          // sandbox="allow-scripts"
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
