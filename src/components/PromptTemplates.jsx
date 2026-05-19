import React from 'react';
import { PROMPT_TEMPLATES } from '../data/templates.js';

export default function PromptTemplates({ onApply }) {
  return (
    <div className="bg-panel border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90">Prompt Templates</h3>
        <span className="text-xs text-white/40">{PROMPT_TEMPLATES.length} tersedia</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PROMPT_TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onApply(t)}
            className="text-xs bg-white/5 hover:bg-accent/30 hover:border-accent border border-white/10 text-white/80 px-3 py-1.5 rounded-full transition"
            title={t.style}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
