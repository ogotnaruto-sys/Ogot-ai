import React, { useState } from 'react';
import { exportPNG, exportPDF, exportVideo } from '../lib/exporters.js';

export default function ExportBar({ canvasRef, panels }) {
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);

  async function run(kind) {
    setBusy(kind);
    setMsg(null);
    try {
      if (kind === 'png') await exportPNG(canvasRef.current, 'storyboard.png');
      if (kind === 'pdf') await exportPDF(panels, 'storyboard.pdf');
      if (kind === 'mp4') await exportVideo(panels, { secondsPerPanel: 2 });
      setMsg(`✓ Export ${kind.toUpperCase()} berhasil`);
    } catch (e) {
      setMsg(`✗ ${e.message}`);
    } finally {
      setBusy(null);
    }
  }

  const Btn = ({ kind, label }) => (
    <button
      onClick={() => run(kind)}
      disabled={busy !== null}
      className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition"
    >
      {busy === kind ? 'Exporting…' : label}
    </button>
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Btn kind="png" label="Export PNG" />
      <Btn kind="pdf" label="Export PDF" />
      <Btn kind="mp4" label="Export Video (.webm)" />
      {msg && <span className="text-xs text-white/60 ml-2">{msg}</span>}
    </div>
  );
}
