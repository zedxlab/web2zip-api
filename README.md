# Web2Zip API

Download any website as a ZIP archive. Free, no auth required.

Two engines, same base URL:

| Endpoint | Engine | How it works |
|----------|--------|-------------|
| `/copy?url=` | Node.js proxy (45 LOC) | Submits to SaveWeb2ZIP upstream, polls, returns download link |
| `/copy2?url=` | Python self-hosted (725 LOC) | Full crawl — parses HTML, downloads CSS/JS/images/fonts, zips, uploads to tmpfiles.org |

## Usage

### `GET /copy?url=https://example.com`

Proxy via SaveWeb2ZIP. Simple and fast (~2s).

```json
{
  "success": true,
  "url": "https://example.com",
  "files": 1,
  "downloadUrl": "https://copier.saveweb2zip.com/api/downloadArchive/...",
  "timeTaken": "2062ms",
  "owner": "@zade4everbot"
}
```

### `GET /copy2?url=https://example.com`

Self-hosted Python scraper. Downloads everything (HTML, CSS, JS, images, fonts, media), zips it, uploads to tmpfiles.org.

```json
{
  "success": true,
  "file_id": "a422f342fb87473185e7787a79a76969",
  "download_url": "https://tmpfiles.org/dl/wRwJdqkf4vqf/tmpw0coo8k1.zip",
  "tmpfiles_url": "https://tmpfiles.org/dl/wRwJdqkf4vqf/tmpw0coo8k1.zip",
  "local_download_url": "https://web2zip-api.vercel.app/download/a422f342fb87473185e7787a79a76969",
  "domain": "example.com",
  "file_size_mb": 0.0,
  "file_count": 1,
  "time_taken_seconds": 0.35,
  "expires_in_seconds": 300,
  "owner": "@zade4everbot"
}
```

### `GET /download/{file_id}`

Direct ZIP download (local fallback, expires in 5 minutes).

## `/copy2` vs `/copy`

| Feature | `/copy` (Node.js) | `/copy2` (Python) |
|---------|-------------------|---------------------|
| Dependencies | Zero (fetch only) | aiohttp, bs4, lxml, aiofiles |
| Scraper | Upstream (SaveWeb2ZIP) | Self-hosted, full crawl |
| Assets | Whatever upstream grabs | CSS, JS, images, fonts, media, inline URLs |
| Upload | Upstream's link | tmpfiles.org (permanent) |
| Local fallback | No | Yes (`/download/{id}`) |
| Speed | ~2s | ~0.3s |
| Size limit | Upstream decides | 19MB |
| Reliability | Depends on upstream | Self-contained |

## Owner

[@zade4everbot](https://t.me/zade4everbot)

## License

MIT
