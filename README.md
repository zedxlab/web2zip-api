<div align="center">

# 🌐 Web2Zip API

### Download any website as a ZIP — free, no auth

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel&logoColor=white)](https://web2zip-api.vercel.app)
[![GitHub](https://img.shields.io/github/stars/zedxlab/web2zip-api?style=for-the-badge&logo=github&color=yellow)](https://github.com/zedxlab/web2zip-api)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open源initiative&logoColor=white)](#)
[![Owner](https://img.shields.io/badge/Owner-@zade4everbot-pink?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/zade4everbot)

---

**One link. One call. Full website zip.**

`GET /copy?url=https://any-site.com` → JSON with download link

</div>

---

## ⚡ Quick Start

```bash
# One-shot — get download link
curl https://web2zip-api.vercel.app/copy?url=https://example.com

# Self-hosted scraper (faster, full assets)
curl https://web2zip-api.vercel.app/copy2?url=https://example.com
```

---

## 🔌 Endpoints

### `GET /copy?url=<site>` — Proxy Engine

> Node.js · 45 LOC · Zero deps · ~2s

Submits URL → polls upstream → returns download link.

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

---

### `GET /copy2?url=<site>` — Self-Hosted Engine

> Python · 725 LOC · Full crawl · ~0.3s

Parses HTML → downloads CSS/JS/images/fonts/media → zips → uploads to tmpfiles.org.

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

---

### `GET /download/<file_id>` — Direct ZIP

> Local fallback · Instant · Expires in 5 min

---

## 📊 Engine Comparison

| | `/copy` | `/copy2` |
|---|---|---|
| **Language** | `Node.js` | `Python` |
| **Code** | 45 LOC | 725 LOC |
| **Dependencies** | Zero | 6 packages |
| **Engine** | SaveWeb2ZIP upstream | Self-hosted crawler |
| **Speed** | ~2s | ~0.3s |
| **Assets** | Upstream decides | CSS + JS + Images + Fonts + Media |
| **Upload** | Upstream link | tmpfiles.org (permanent) |
| **Local Fallback** | ❌ | ✅ `/download/{id}` |
| **Reliability** | Depends on upstream | Self-contained |
| **Size Limit** | Upstream decides | 19MB |

---

## 🛠️ Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![BeautifulSoup](https://img.shields.io/badge/BeautifulSoup-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

---

## 📁 Structure

```
web2zip-api/
├── api/
│   ├── copy.js          # /copy — Node.js proxy (45 LOC)
│   └── api.py           # /copy2 — Python self-hosted scraper (725 LOC)
├── vercel.json           # Route config + build settings
├── package.json
├── requirements.txt
└── README.md
```

---

## 👤 Owner

<div align="center">

[![Telegram](https://img.shields.io/badge/@zade4everbot-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/zade4everbot)
[![GitHub](https://img.shields.io/badge/zedxlab-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zedxlab)

</div>

---

<div align="center">

**Made with ❤️ by [@zade4everbot](https://t.me/zade4everbot)**

</div>
