# Web2Zip API

Download any website as a ZIP archive. Free, no auth required.

Powered by [SaveWeb2ZIP](https://saveweb2zip.com).

## API

### `POST /api/copy` — Submit URL

```json
{
  "url": "https://example.com",
  "renameAssets": false,
  "saveStructure": false,
  "alternativeAlgorithm": false,
  "mobileVersion": false
}
```

### `GET /api/status?id=<hash>` — Check Progress

Poll every 1.5s until `isFinished: true`.

### `GET /api/download?id=<hash>` — Download ZIP

Returns ZIP file stream.

## Owner

@zade4everbot
