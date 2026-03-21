# HTML Manga Reader

A web-based manga reader built entirely in HTML + JavaScript.
No install, no server, no dependencies — just open `hub.html` in your browser.

> **Note:** This is an independent project. The UI layout is inspired by popular manga reader apps but the code is original and unrelated to any existing app.

---

## Quick Start

1. Download the repository
2. Open `hub.html` in your browser
3. Go to **Browse** → Add a source → Start reading

Works on Android with Kiwi Browser, Firefox, or Via Browser.
Also works on desktop Chrome/Firefox/Edge.

---

## Project Structure

```
mangahub/
├── hub.html          Main app (UI + logic, single file)
├── index.html        Landing page
├── README.md         This file
└── sources/
    └── mysource.html Your custom sources go here
```

---

## Features

### Reader
- **5 reading modes:** Long strip, Long strip with gaps, Paged LTR, Paged RTL, Paged vertical
- **Rotation:** Portrait, Landscape (90° CSS rotation), Upside down (180°) — no system permissions needed
- **Scale types:** Fit screen, Stretch, Fit width, Fit height, Original size
- **Crop borders** — removes black borders from images
- **Fill screen** — stretches image to fill screen in landscape mode
- **Custom filter** — brightness, contrast, saturation, hue shift with presets
- **Double-tap to zoom** in webtoon mode
- **Swipe navigation** with ViewPager-style physics (fling + drag threshold)
- **RTL support** — correct page order and swipe direction for right-to-left manga
- **Auto-hide UI** — controls disappear while reading, tap to show

### Library
- Organize manga into custom categories
- Sort by: Alphabetically, Total chapters, Last read, Unread count, Date added, Random
- Filter by: Unread only, Downloaded only
- Display options: Grid size (Small/Medium/Large), Unread badge, Show/hide title
- Unread count badge on covers

### Downloads & Offline
- Download chapters as ZIP for export
- Pages saved to IndexedDB (or a device folder via File System Access API) for offline reading
- Read downloaded chapters without internet
- Download manager with delete support
- Storage usage indicator in Settings

### Updates
- Checks all library manga for new chapters
- Snapshot-based: compares current chapter count vs last known count
- New chapters appear in Updates feed grouped by date
- Refresh button + last-checked timestamp

### History
- One entry per manga (most recently read chapter)
- Auto-updates to latest chapter when you read a new one
- Grouped by date

### Chapter Selection Mode
- Select multiple chapters
- Actions: Select all, Invert, Select unread, Select all below
- Bulk: Download selected, Mark read/unread, Delete downloads
- Download next 5 / 10 / 25 unread chapters

### Sources
- Load any manga API as a source file (`sources/mysource.html`)
- Sources are sandboxed in a restricted `fakeWindow` — no access to real DOM
- Add sources from Browse → + button

---

## Write a Source

Create a `.html` file with this template and place it next to `hub.html`:

```html
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body><script>

async function getPopular(p)  { /* p.page, p.lang */ return { items:[], hasNext:false }; }
async function getLatest(p)   { /* p.page, p.lang */ return { items:[], hasNext:false }; }
async function search(p)      { /* p.query, p.page, p.lang */ return { items:[], hasNext:false }; }
async function getDetails(p)  { /* p.id */ return {}; }
async function getChapters(p) { /* p.id, p.lang */ return []; }
async function getPages(p)    { /* p.chapterId */ return []; }

window.__SOURCE__ = {
  MANIFEST: { id:'mysource', name:'My Source', icon:'🔵', version:'1.0', langs:['en'] },
  getPopular, getLatest, search, getDetails, getChapters, getPages
};
</script></body></html>
```

### Return types

```
getPopular / getLatest / search:
  { items: [{ id, title, cover, status }], hasNext, total? }

getDetails:
  { id, title, description, author, artist, status, year, tags[], cover, coverSmall }

getChapters:
  [{ id, title, chapter, volume, pages, publishAt, lang }]

getPages:
  [{ index, url, urlLow? }]
```

---

## Storage

| Key | Content |
|-----|---------|
| `mhub_src` | Custom sources |
| `mhub_cats` | Library categories |
| `mhub_lib` | Saved manga |
| `mhub_hist` | Reading history |
| `mhub_read` | Read chapter IDs |
| `mhub_dls` | Download records |
| `mhub_updates` | Updates feed |
| `mhub_snaps` | Chapter count snapshots |
| `mhub_rdr_mode` | Reader mode preference |

Downloaded page images are stored in **IndexedDB** (`mihon_pages` database).
Optionally stored in a **device folder** via File System Access API (Chrome/Kiwi only).

---

## Security

- Sources run in a sandboxed `fakeWindow` with no access to `window`, `document`, or `localStorage`
- Source `fetch()` is restricted to `http://` and `https://` URLs only
- Source file paths block `../` traversal and absolute URLs
- All user data rendered in HTML is escaped (`&`, `<`, `>`, `"`, `'`)
- IDs used in `onclick` handlers are sanitized to `[a-zA-Z0-9_-]` only
- Image `src` attributes only accept `http://`, `https://`, or `data:image/` URLs

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Chromium | ✅ Full support |
| Firefox | ✅ Full support |
| Kiwi Browser (Android) | ✅ Full support + File System API |
| Via Browser (Android) | ✅ Full support |
| Safari iOS | ⚠ Works, no File System API |

---

## Built With

This project was designed and written almost entirely through iterative conversation with **Claude AI**.

| | |
|---|---|
| **Model** | claude-sonnet-4-6 |
| **By** | Anthropic |
| **Link** | https://claude.ai |

The architecture, reader engine, offline storage, security sandboxing, source system, touch gestures, rotation system, and all UI logic were produced via AI-assisted coding across a single extended conversation.
