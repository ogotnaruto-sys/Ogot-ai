import React, { useRef, useState } from 'react';
import StoryboardCanvas from './components/StoryboardCanvas.jsx';
import PromptTemplates from './components/PromptTemplates.jsx';
import ExportBar from './components/ExportBar.jsx';
import { DEFAULT_RESOLUTION, DEFAULT_STYLE } from './data/templates.js';
import { ACTIVE_PROVIDER } from './lib/aiClient.js';

const makeId = () => Math.random().toString(36).slice(2, 9);

const initialPanels = () =>
  [0, 1, 2].map((i) => ({
    id: makeId(),
    order: i,
    prompt: '',
    versions: [],         // [{ imageUrl, seed }]
    activeVersion: 0,
    caption: ''
  }));

export default function App() {
  const [panels, setPanels] = useState(initialPanels);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [resolution, setResolution] = useState(DEFAULT_RESOLUTION);
  const canvasRef = useRef(null);

  function applyTemplate(template) {
    setStyle(template.style);
    setPanels(prev =>
      prev.map((p, i) => ({
        ...p,
        prompt: template.panels[i] ?? p.prompt,
        versions: [],
        activeVersion: 0,
        caption: ''
      }))
    );
  }

  function resetAll() {
    setPanels(initialPanels());
    setStyle(DEFAULT_STYLE);
    setResolution(DEFAULT_RESOLUTION);
  }

  // Flatten panels for export (active version only)
  const exportPanels = panels.map(p => ({
    prompt: p.prompt,
    caption: p.caption,
    imageUrl: p.versions[p.activeVersion]?.imageUrl
  }));

  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Top Bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Ogot-AI <span className="text-accent">Storyboard</span>
          </h1>
          <p className="text-xs text-white/40">
            Multi-panel AI storyboard · provider:&nbsp;
            <span className="text-white/70">{ACTIVE_PROVIDER}</span>
          </p>
        </div>
        <ExportBar canvasRef={canvasRef} panels={exportPanels} />
      </header>

      {/* Settings Bar */}
      <div className="px-6 py-3 border-b border-white/10 flex flex-wrap gap-3 items-center text-sm">
        <label className="flex items-center gap-2">
          <span className="text-white/50">Style:</span>
          <input
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-md px-2 py-1 w-72 focus:outline-none focus:border-accent"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-white/50">Resolusi:</span>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-md px-2 py-1 focus:outline-none focus:border-accent"
          >
            <option value="512x512">512×512</option>
            <option value="1024x1024">1024×1024</option>
            <option value="1024x1792">1024×1792 (vertical)</option>
            <option value="1792x1024">1792×1024 (horizontal)</option>
          </select>
        </label>
        <button
          onClick={resetAll}
          className="ml-auto text-xs text-white/50 hover:text-white underline-offset-4 hover:underline"
        >
          Reset
        </button>
      </div>

      <main className="p-6 space-y-4 max-w-7xl mx-auto">
        <PromptTemplates onApply={applyTemplate} />
        <StoryboardCanvas
          ref={canvasRef}
          panels={panels}
          setPanels={setPanels}
          style={style}
          resolution={resolution}
        />
        <footer className="text-center text-xs text-white/30 pt-6 pb-10">
          Drag panel untuk reorder · pilih versi dari thumbnail strip · swap provider di
          <code className="text-white/50"> .env </code>
        </footer>
      </main>
    </div>
  );
}
