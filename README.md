# Ogot-AI Storyboard

Multi-panel AI storyboard generator: 3-panel drag & drop canvas, multi-version per panel, prompt templates, dan export PNG / PDF / Video.

> **Catatan penting:** Claude (Anthropic) adalah **text model**, tidak menghasilkan gambar. Modul ini menggunakan **adapter pattern** sehingga gambar bisa di-generate oleh provider apa saja (DALL·E, Flux, SDXL, Imagen). Claude tetap dipakai untuk caption otomatis & prompt enhancement.

## Quickstart

```bash
npm install
cp .env.example .env       # isi key kalau mau pakai provider real
npm run dev
```

Buka <http://localhost:5173>. Default berjalan dengan **stub provider** (gambar placeholder dari picsum.photos) — UI langsung pakai tanpa API key.

## Fitur

| Fitur                      | Status | Catatan                                                |
| -------------------------- | ------ | ------------------------------------------------------ |
| 3-panel canvas             | ✅      | grid responsif, 1 kolom mobile / 3 kolom desktop       |
| Drag & drop reorder        | ✅      | `@dnd-kit` horizontal sortable                         |
| Multi-version (3 / 5)      | ✅      | thumbnail strip, klik untuk pilih versi aktif          |
| Prompt templates           | ✅      | 5 template (TikTok, Product, Travel, Comic, Food)      |
| Export PNG                 | ✅      | snapshot canvas via `html-to-image`                    |
| Export PDF                 | ✅      | `jsPDF`, 1 halaman per panel + cover                   |
| Export Video               | ⚠️      | output `.webm` (browser native via MediaRecorder)      |
| Auto caption (Claude)      | ✅      | fallback ke trim prompt kalau tidak ada API key        |

### Kenapa `.webm` bukan `.mp4`?

Browser tidak punya encoder MP4 native. Untuk MP4 sejati pilih salah satu:
- **server-side**: kirim frames ke endpoint yang menjalankan `ffmpeg`
- **client-side**: pakai [`ffmpeg.wasm`](https://github.com/ffmpegwasm/ffmpeg.wasm) (~30 MB bundle)

Sekarang kami pakai pendekatan paling ringan: WebM via `MediaRecorder`. Sebagian besar platform (TikTok, IG, YouTube) menerima `.webm` atau bisa di-convert sekali.

## Swap Image Provider

Edit `.env`:

```bash
VITE_IMAGE_PROVIDER=openai          # stub | openai | replicate | stability
VITE_OPENAI_API_KEY=sk-...
```

Lalu lihat `src/lib/aiClient.js` — ada fungsi `generateImage*` per provider. Yang sudah implementasi: `openai` (DALL-E 3). `replicate` & `stability` punya skeleton — tinggal isi model+endpoint sesuai pilihan Anda.

## Swap Caption Model

```bash
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_CLAUDE_MODEL=claude-opus-4-5   # atau model Claude lain yang aktif
```

> Versi model Claude berubah dari waktu ke waktu — cek dashboard Anthropic untuk nama model terbaru saat swap key.

## Struktur

```
src/
├── App.jsx                      # shell + state global
├── components/
│   ├── StoryboardCanvas.jsx     # DndContext + 3 panel grid
│   ├── Panel.jsx                # generate, multi-version, prompt edit
│   ├── PromptTemplates.jsx      # template picker
│   └── ExportBar.jsx            # PNG / PDF / Video buttons
├── lib/
│   ├── aiClient.js              # adapter image + caption
│   └── exporters.js             # PNG / PDF / WebM
└── data/
    └── templates.js             # 5 prompt templates Indonesia
```

## Build

```bash
npm run build      # output di ./dist
npm run preview    # serve build lokal
```
