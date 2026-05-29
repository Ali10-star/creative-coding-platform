'use client';

import { useSketchMessenger } from '@/lib/hooks/useSketchMessenger';
import { BASE_IMPORT_MAPS } from '@/lib/runtimeTemplates';
import { Runtime } from '@/lib/schemas/parameterSchmea';
import { useRef, useState } from 'react';

interface Props {
  code: string;
  runtime: Runtime;
  extraImports?: Record<string, string>;
}

type Status = 'loading' | 'running' | 'error';

const SketchEmbed: React.FC<Props> = ({ code, runtime, extraImports = {} }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<Status>('loading');
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
        params: {},
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

  return (
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
  );
};

export default SketchEmbed;
