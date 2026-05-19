// ============================================================
// Ogot-AI :: AI Client Adapter
// ------------------------------------------------------------
// Single swap point for image + text generation.
//
// IMPORTANT NOTE ON CLAUDE:
//   Anthropic Claude (Opus / Sonnet / Haiku) is a TEXT model.
//   It does NOT generate images. Use Claude for:
//     - prompt enhancement / rewriting
//     - auto-captions for social media
//     - story expansion
//   For panel images, plug in DALL-E / Flux / SDXL / Imagen / etc.
//
// To swap providers:
//   1. Set VITE_IMAGE_PROVIDER in .env (stub | openai | replicate | stability)
//   2. Add your API key to .env
//   3. Implement the matching branch in `generateImage` below.
// ============================================================

const env = import.meta.env;

const PROVIDER = env.VITE_IMAGE_PROVIDER || 'stub';

// ------------------------------------------------------------
// Image generation
// ------------------------------------------------------------
export async function generateImage({ prompt, style = '', resolution = '1024x1024', seed }) {
  switch (PROVIDER) {
    case 'openai':    return generateImageOpenAI({ prompt, style, resolution });
    case 'replicate': return generateImageReplicate({ prompt, style, resolution });
    case 'stability': return generateImageStability({ prompt, style, resolution });
    case 'stub':
    default:          return generateImageStub({ prompt, style, resolution, seed });
  }
}

// Stub: deterministic placeholder so the UI works out of the box.
async function generateImageStub({ prompt, resolution, seed }) {
  const [w, h] = resolution.split('x').map(Number);
  const hash = seed ?? simpleHash(prompt);
  // Picsum gives a deterministic image per seed; fast, no key needed.
  const url = `https://picsum.photos/seed/${hash}/${w}/${h}`;
  await new Promise(r => setTimeout(r, 500)); // simulate network
  return { imageUrl: url, provider: 'stub', prompt };
}

async function generateImageOpenAI({ prompt, style, resolution }) {
  const key = env.VITE_OPENAI_API_KEY;
  if (!key) throw new Error('VITE_OPENAI_API_KEY missing');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `${prompt}. Style: ${style}`,
      size: resolution,
      n: 1
    })
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  return { imageUrl: data.data[0].url, provider: 'openai', prompt };
}

async function generateImageReplicate({ prompt, style }) {
  // Implementation depends on which model. Left as a stub-with-error so
  // it fails loudly until you wire your model + version.
  const key = env.VITE_REPLICATE_API_TOKEN;
  if (!key) throw new Error('VITE_REPLICATE_API_TOKEN missing');
  throw new Error('Replicate adapter not implemented yet. Add model+version in aiClient.js');
}

async function generateImageStability({ prompt, style }) {
  const key = env.VITE_STABILITY_API_KEY;
  if (!key) throw new Error('VITE_STABILITY_API_KEY missing');
  throw new Error('Stability adapter not implemented yet. Wire in aiClient.js');
}

// ------------------------------------------------------------
// Text generation (Claude) - for captions & prompt enhancement
// ------------------------------------------------------------
export async function generateCaption({ prompt }) {
  const key = env.VITE_ANTHROPIC_API_KEY;
  if (!key) {
    // Fallback: trim prompt to a caption-friendly snippet.
    return `${prompt.split('.')[0].slice(0, 90)} #storyboard #ai`;
  }
  const model = env.VITE_CLAUDE_MODEL || 'claude-opus-4-5';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model,
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `Write a punchy TikTok-style caption (max 20 words, 2-3 hashtags) for this scene: "${prompt}"`
      }]
    })
  });
  if (!res.ok) throw new Error(`Claude error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? prompt;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const ACTIVE_PROVIDER = PROVIDER;
