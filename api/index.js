// Web2Zip API — single endpoint: /copy?url=<website>
// Submits URL → polls status → returns download link
// Owner: @zade4everbot

const UPSTREAM = 'https://copier.saveweb2zip.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export default async function handler(req) {
  const url = new URL(req.url);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const path = url.pathname;

  // ── GET /copy?url=https://example.com ──
  // One-shot: submit → poll → return { downloadUrl, status }
  if (path === '/copy') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return json({ error: 'Missing ?url= parameter', example: '/copy?url=https://example.com' }, 400);
    }

    const startTime = Date.now();

    try {
      // Step 1: Submit URL to upstream
      const submitRes = await fetch(`${UPSTREAM}/api/copySite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const submitData = await submitRes.json();

      if (!submitData.success && submitData.errorText) {
        return json({
          success: false,
          error: submitData.errorText,
          timeTaken: `${Date.now() - startTime}ms`,
        }, 400);
      }

      const hash = submitData.md5;
      if (!hash) {
        return json({ success: false, error: 'No hash returned from upstream' }, 500);
      }

      // Step 2: Poll until finished (max 60s)
      let status;
      for (let i = 0; i < 40; i++) {
        await sleep(1500);
        const statusRes = await fetch(`${UPSTREAM}/api/getStatus/${hash}`);
        status = await statusRes.json();
        if (status.isFinished) break;
      }

      if (!status || !status.isFinished) {
        return json({
          success: false,
          error: 'Timeout — site took too long to copy',
          hash,
          timeTaken: `${Date.now() - startTime}ms`,
        }, 504);
      }

      if (!status.success) {
        return json({
          success: false,
          error: status.errorText || 'Copy failed',
          timeTaken: `${Date.now() - startTime}ms`,
        }, 400);
      }

      // Step 3: Return download link
      const downloadUrl = `${UPSTREAM}/api/downloadArchive/${hash}`;

      return json({
        success: true,
        url: targetUrl,
        files: status.copiedFilesAmount,
        downloadUrl,
        hash,
        timeTaken: `${Date.now() - startTime}ms`,
        owner: '@zade4everbot',
      });

    } catch (err) {
      return json({ success: false, error: err.message }, 500);
    }
  }

  // ── GET /api/download?id=<hash> — direct ZIP stream ──
  if (path === '/api/download') {
    const hash = url.searchParams.get('id');
    if (!hash) return json({ error: 'Missing ?id= parameter' }, 400);

    const upstream = await fetch(`${UPSTREAM}/api/downloadArchive/${hash}`);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="site-${hash.slice(0, 8)}.zip"`,
        ...CORS,
      },
    });
  }

  // ── GET /api/status?id=<hash> — manual status check ──
  if (path === '/api/status') {
    const hash = url.searchParams.get('id');
    if (!hash) return json({ error: 'Missing ?id= parameter' }, 400);

    const statusRes = await fetch(`${UPSTREAM}/api/getStatus/${hash}`);
    const data = await statusRes.json();
    return json({ ...data, owner: '@zade4everbot' });
  }

  // ── GET / — docs ──
  return json({
    name: 'Web2Zip API',
    version: '1.0.0',
    owner: '@zade4everbot',
    endpoints: {
      'GET /copy?url=<site>': 'One-shot: submit → poll → return download link',
      'GET /api/download?id=<hash>': 'Download ZIP by hash',
      'GET /api/status?id=<hash>': 'Check copy status',
    },
    example: '/copy?url=https://numberpanel.tech',
    note: 'Free, no auth required. Scrapes via SaveWeb2ZIP upstream.',
  });
}
