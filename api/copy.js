// GET /api/copy?url=https://example.com → { downloadUrl, files, timeTaken }
// Owner: @zade4everbot

const UPSTREAM = 'https://copier.saveweb2zip.com';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { url: targetUrl } = req.query;
  if (!targetUrl) return res.status(400).json({ error: '?url= required' });

  const t = Date.now();

  try {
    // submit
    const sub = await fetch(`${UPSTREAM}/api/copySite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    }).then(r => r.json());

    if (!sub.md5) return res.status(400).json({ success: false, error: sub.errorText || 'failed' });

    // poll
    let st;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 1500));
      st = await fetch(`${UPSTREAM}/api/getStatus/${sub.md5}`).then(r => r.json());
      if (st.isFinished) break;
    }

    if (!st || !st.isFinished) return res.status(504).json({ success: false, error: 'timeout', hash: sub.md5 });
    if (!st.success) return res.status(400).json({ success: false, error: st.errorText });

    return res.json({
      success: true,
      url: targetUrl,
      files: st.copiedFilesAmount,
      downloadUrl: `${UPSTREAM}/api/downloadArchive/${sub.md5}`,
      timeTaken: `${Date.now() - t}ms`,
      owner: '@zade4everbot',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
