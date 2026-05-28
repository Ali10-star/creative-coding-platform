const RUNNER_HTML = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body { margin: 0; padding: 0; overflow: hidden; background: #fff; }
    canvas { display: block; }
  </style>
  <script type="importmap" id="sketch-importmap"></script>
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

    // Message handler — receives init/updateParam/action from parent
    window.addEventListener('message', async (e) => {
      // Origin check: when parentOrigin is '*' we trust same-window; otherwise verify.
      if (parentOrigin !== '*' && e.origin !== parentOrigin) return;

      const msg = e.data;
      if (msg.type === 'init') {
        console.log('[runner] init received', msg);
        params = { ...msg.params };

        // inject the import maps BEFORE the code runs
        if (msg.importMap) {
          document.getElementById('sketch-importmap').textContent = JSON.stringify(msg.importmap);
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

    // Tell parent we're ready for init
    parent.postMessage({ type: 'ready' }, parentOrigin);
  </script>
</body>
</html>
`;

export async function GET() {
  return new Response(RUNNER_HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': [
        "default-src 'none'",
        "script-src 'unsafe-inline' https://esm.sh blob:",
        "style-src 'unsafe-inline'",
        'img-src data: blob:',
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
