const IMPORT_MAP = JSON.stringify({
  imports: {
    'p5': 'https://esm.sh/p5@1.9.4',
    'three': 'https://esm.sh/three@0.160.0',
    'pixi.js': 'https://esm.sh/pixi.js@8.6.0',
    "tone": "https://esm.sh/tone@15.0.4"
  },
});

const RUNNER_HTML = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body { margin: 0; padding: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
  <script type="importmap" id="sketch-importmap">${IMPORT_MAP}</script>
</head>
<body>
  <script type="module">
    // Resolve the parent's origin. Falls back to '*' if document.referrer is empty
    // (rare; happens in some embedded contexts). Tighten this when the runner
    // moves to a separate domain in production.
    const parentOrigin = document.referrer ? new URL(document.referrer).origin : '*';

    let params = {};
    const actionHandlers = [];

    // Expose a tiny API to admin code
    window.params = new Proxy({}, {
      get(_, key) { return params[key]; }
    });

    window.onAction = (name, fn) => { actionHandlers[name] = fn; };

    window.reportError = (err) => {
      parent.postMessage(
        { type: 'error', message: err.message, stack: err.stack },
        parentOrigin
      );
    };

    // Catch uncaught errors
    window.addEventListener('error', (e) => window.reportError(e.error || new Error(e.message)));
    window.addEventListener('unhandledrejection', (e) => window.reportError(e.reason));

    let initReceived = false;

    // Message handler — receives init/updateParam/action from parent
    window.addEventListener('message', async (e) => {
      // Origin check: when parentOrigin is '*' we trust same-window; otherwise verify.
      if (parentOrigin !== '*' && e.origin !== parentOrigin) return;

      const msg = e.data;
      if (msg.type === 'init') {
        if (initReceived) {
          console.warn('[runner] ignoring duplicate init');
          return;
        }
        initReceived = true;

        console.log('[runner] init received', msg);
        params = { ...msg.params };

        // inject the import maps BEFORE the code runs
        if (msg.importMap) {
          document.getElementById('sketch-importmap').textContent = JSON.stringify(msg.importMap);
          console.log('[runner] import map injected');
        }

        try {
          const blob = new Blob([msg.code], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);

          console.log('[runner] about to import', url);
          await import(url);
          console.log('[runner] import succeeded');
        } catch (err) {
          console.error('[runner] import failed', err);
          window.reportError(err);
        }
      }

      if (msg.type === 'updateParam') {
        params[msg.name] = msg.value;
      }

      if (msg.type === 'action' && actionHandlers[msg.name]) {
        try { actionHandlers[msg.name](); }
        catch (err) { window.reportError(err); }
      }
    });

    // Heartbeat — pings the parent every ~60 frames (≈1s at 60fps) so the
    // parent's watchdog knows the sketch is alive. If we stop sending these,
    // the watchdog will kill the iframe.
    let frameCount = 0;

    function tick() {
      if (++frameCount % 60 === 0) {
        parent.postMessage({ type: 'heartbeat' }, parentOrigin);
      }

      requestAnimationFrame(tick);
    }

    tick();

    // Tell parent we're ready for init.
    // We retry because the parent's listener may not be attached yet
    // (especially in React/Next.js where listeners attach after hydration).
    let initialized = false;
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'init') initialized = true;
    });

    let attempts = 0;
    const readyInterval = setInterval(() => {
      if (initialized || attempts > 100) {
        clearInterval(readyInterval);
        return;
      }
      parent.postMessage({ type: 'ready' }, parentOrigin);
      attempts++;
    }, 50);

    // Also fire one immediately, in case the listener IS already attached.
    parent.postMessage({ type: 'ready' }, parentOrigin);
  </script>
</body>
</html>
`;

export async function GET() {
  // const url = new URL(request.url);
  // const runtime = url.searchParams.get('runtime') ?? 'vanilla';

  // const IMPORT_MAPS: Record<string, Record<string, string>> = {
  //   p5: { p5: 'https://esm.sh/p5@1.11.13' },
  //   three: { three: 'https://esm.sh/three' },
  //   pixi: { pixi: 'https://esm.sh/pixi.js@8.11.0' },
  //   vanilla: {},
  // };

  // const importMap = JSON.stringify({ imports: IMPORT_MAPS[runtime] ?? {} });

  // const RUNNER_HTML = getRunnerHtml(importMap);

  return new Response(RUNNER_HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh blob:",
        "script-src-elem 'self' 'unsafe-inline' https://esm.sh blob:",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        'connect-src https://esm.sh',
        'font-src data:',
        'worker-src blob:',
        "base-uri 'none'",
        "form-action 'none'",
      ].join('; '),
      //! Caching disabled during development
      'Cache-Control': 'no-store',
    },
  });
}
