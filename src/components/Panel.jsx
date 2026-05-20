import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateImage, generateCaption } from '../lib/aiClient.js';

/**
 * Single storyboard panel.
 * Props:
 *  - panel: { id, prompt, versions: [{imageUrl,seed}], activeVersion, caption }
 *  - onUpdate(panelId, partial)
 *  - style, resolution: global settings
 *  - sceneNumber, totalScenes: optional scene info from template
 */
export default function Panel({ panel, onUpdate, style, resolution, sceneNumber, totalScenes }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: panel.id });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };

  const activeVersion = panel.versions[panel.activeVersion] || null;

  async function handleGenerate(count = 3) {
    if (!panel.prompt.trim()) {
      setError('Prompt kosong');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const versions = [];
      for (let i = 0; i < count; i++) {
        const seed = Date.now() + i + Math.floor(Math.random() * 9999);
        const res = await generateImage({
          prompt: `${panel.prompt}. Style: ${style}`,
          style,
          resolution,
          seed
        });
        versions.push({ imageUrl: res.imageUrl, seed });
      }
      let caption = panel.caption;
      try { caption = await generateCaption({ prompt: panel.prompt }); }
      catch { /* keep old caption on failure */ }
      onUpdate(panel.id, { versions, activeVersion: 0, caption });
    } catch (e) {
      setError(e.message || 'Gagal generate');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className="bg-panel rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col gap-3 w-full"
    >
      {/* Header / drag handle */}
      <div className="flex items-center justify-between">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white text-sm select-none"
          title="Drag untuk reorder"
        >
          ⋮⋮ {sceneNumber ? `Scene ${sceneNumber}` : `Panel #${panel.order + 1}`}
        </button>
        <div className="flex items-center gap-2">
          {sceneNumber && totalScenes && (
            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
              ⏱ 12s
            </span>
          )}
          <span className="text-xs text-white/40">
            {panel.versions.length > 0 ? `${panel.versions.length} versi` : 'belum dibuat'}
          </span>
        </div>
      </div>

      {/* Image preview */}
      <div className="aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
        {busy && <div className="text-white/60 text-sm animate-pulse">Generating…</div>}
        {!busy && activeVersion?.imageUrl && (
          <img
            src={activeVersion.imageUrl}
            alt={panel.prompt}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        )}
        {!busy && !activeVersion?.imageUrl && (
          <div className="text-white/30 text-xs px-4 text-center">
            Tulis prompt lalu klik Generate
          </div>
        )}
      </div>

      {/* Version strip */}
      {panel.versions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {panel.versions.map((v, i) => (
            <button
              key={i}
              onClick={() => onUpdate(panel.id, { activeVersion: i })}
              className={`shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition ${
                i === panel.activeVersion ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              title={`Versi ${i + 1}`}
            >
              <img src={v.imageUrl} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Prompt textarea */}
      <textarea
        value={panel.prompt}
        onChange={(e) => onUpdate(panel.id, { prompt: e.target.value })}
        placeholder="Deskripsikan scene panel ini…"
        rows={3}
        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white/90 resize-none focus:outline-none focus:border-accent"
      />

      {/* Caption */}
      {panel.caption && (
        <div className="text-xs text-white/50 italic line-clamp-2">{panel.caption}</div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleGenerate(3)}
          disabled={busy}
          className="flex-1 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition"
        >
          {busy ? 'Generating…' : 'Generate 3 versi'}
        </button>
        <button
          onClick={() => handleGenerate(5)}
          disabled={busy}
          className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm py-2 px-3 rounded-lg transition"
          title="Generate 5 versi"
        >
          ×5
        </button>
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
