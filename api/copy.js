// GET /copy?url=https://example.com → { downloadUrl, files, timeTaken }
// Owner: @zade4everbot

const UPSTREAM = 'https://copier.saveweb2zip.com';

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  if (!targetUrl) return json({ error: '?url= required' }, 400);

  const t = Date.now();

  // submit
  const sub = await fetch(`${UPSTREAM}/api/copySite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl }),
  }).then(r => r.json());

  if (!sub.md5) return json({ success: false, error: sub.errorText || 'failed' }, 400);

  // poll
  let st;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 1500));
    st = await fetch(`${UPSTREAM}/api/getStatus/${sub.md5}`).then(r => r.json());
    if (st.isFinished) break;
  }

  if (!st?.isFinished) return json({ success: false, error: 'timeout', hash: sub.md5 }, 504);
  if (!st.success) return json({ success: false, error: st.errorText }, 400);

  return json({
    success: true,
    url: targetUrl,
    files: st.copiedFilesAmount,
    downloadUrl: `${UPSTREAM}/api/downloadArchive/${sub.md5}`,
    timeTaken: `${Date.now() - t}ms`,
    owner: '@zade4everbot',
  });
}
