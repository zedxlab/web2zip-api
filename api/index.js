/**
 * SaveWeb2ZIP API Proxy
 * POST /api/copy — Submit URL for copying
 * GET /api/status?id=hash — Check copy progress
 * GET /api/download?id=hash — Download ZIP
 */

const API_BASE = 'https://copier.saveweb2zip.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default async function handler(req) {
  const { pathname, searchParams } = new URL(req.url);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // POST /api/copy — submit URL
  if (pathname === '/api/copy' && req.method === 'POST') {
    const body = await req.json();
    const { url, renameAssets, saveStructure, alternativeAlgorithm, mobileVersion } = body;

    if (!url) return json(res, { error: 'url is required' }, 400);

    const startTime = Date.now();

    try {
      const upstream = await fetch(`${API_BASE}/api/copySite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          renameAssets: renameAssets || false,
          saveStructure: saveStructure || false,
          alternativeAlgorithm: alternativeAlgorithm || false,
          mobileVersion: mobileVersion || false,
        }),
      });

      const data = await upstream.json();

      return json(res, {
        ...data,
        timeTaken: `${Date.now() - startTime}ms`,
        owner: '@zade4everbot',
        source: 'zadesh-web2zip-api',
      });
    } catch (err) {
      return json(res, { error: err.message }, 500);
    }
  }

  // GET /api/status?id=hash
  if (pathname === '/api/status' && req.method === 'GET') {
    const id = searchParams.get('id');
    if (!id) return json(res, { error: 'id (hash) is required' }, 400);

    const startTime = Date.now();

    try {
      const upstream = await fetch(`${API_BASE}/api/getStatus/${id}`);
      const data = await upstream.json();

      return json(res, {
        ...data,
        timeTaken: `${Date.now() - startTime}ms`,
        owner: '@zade4everbot',
        source: 'zadesh-web2zip-api',
      });
    } catch (err) {
      return json(res, { error: err.message }, 500);
    }
  }

  // GET /api/download?id=hash
  if (pathname === '/api/download' && req.method === 'GET') {
    const id = searchParams.get('id');
    if (!id) return json(res, { error: 'id (hash) is required' }, 400);

    try {
      const upstream = await fetch(`${API_BASE}/api/downloadArchive/${id}`);

      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="web2zip-${id.slice(0, 8)}.zip"`,
          ...CORS_HEADERS,
        },
      });
    } catch (err) {
      return json(res, { error: err.message }, 500);
    }
  }

  // GET / — API docs
  if (pathname === '/' || pathname === '/api') {
    return json(res, {
      name: 'Web2Zip API',
      version: '1.0.0',
      owner: '@zade4everbot',
      description: 'Proxy API for SaveWeb2ZIP — download any website as a ZIP archive',
      endpoints: {
        'POST /api/copy': {
          description: 'Submit a URL for copying',
          body: {
            url: 'string (required)',
            renameAssets: 'boolean (default: false)',
            saveStructure: 'boolean (default: false)',
            alternativeAlgorithm: 'boolean (default: false)',
            mobileVersion: 'boolean (default: false)',
          },
          response: 'Returns { md5, isFinished, success, copiedFilesAmount, timeTaken, owner, source }',
        },
        'GET /api/status?id=<hash>': {
          description: 'Check copy progress (poll every 1.5s until isFinished=true)',
          response: 'Returns { md5, isFinished, success, copiedFilesAmount, errorText, timeTaken, owner, source }',
        },
        'GET /api/download?id=<hash>': {
          description: 'Download the ZIP archive',
          response: 'ZIP file stream',
        },
      },
      errors: {
        dns_not_resolved: 'Website is not available',
        url_is_not_valid: 'Website address is invalid',
        protocol_is_not_valid: 'Only http and https protocols are supported',
        localhost_is_not_supported: 'Downloading local websites is not supported',
        too_many_attempts: 'Too many attempts to copy this website',
        not_found: 'Website not found',
        website_size_is_too_large_for_downloading_in_few_minutes: 'Website is too large (>180s)',
        wrong_captcha: 'Robot check failed',
      },
      status: 'free — no auth required',
      repo: 'https://github.com/zade911786/web2zip-api',
    });
  }

  return json(res, { error: 'Not found' }, 404);
}

export const config = {
  path: '/api/*',
};
