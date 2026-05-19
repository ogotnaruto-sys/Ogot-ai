// ============================================================
// Ogot-AI :: Exporters
// ------------------------------------------------------------
// PNG  -> html-to-image (snapshot DOM node)
// PDF  -> jsPDF (one page per panel + cover)
// MP4  -> Canvas + MediaRecorder => WebM (browser native).
//          Most platforms accept .webm; for true MP4, run ffmpeg
//          server-side or use ffmpeg.wasm (heavy). We expose .webm
//          but label it "video" in the UI for clarity.
// ============================================================
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// ----- PNG ---------------------------------------------------
export async function exportPNG(node, filename = 'storyboard.png') {
  const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
  triggerDownload(dataUrl, filename);
}

// ----- PDF ---------------------------------------------------
export async function exportPDF(panels, filename = 'storyboard.pdf') {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Cover
  pdf.setFontSize(28);
  pdf.text('Ogot-AI Storyboard', 40, 80);
  pdf.setFontSize(12);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 40, 110);
  pdf.text(`Panels: ${panels.length}`, 40, 128);

  for (const panel of panels) {
    if (!panel.imageUrl) continue;
    pdf.addPage();
    const imgData = await urlToDataUrl(panel.imageUrl);
    const margin = 40;
    const imgW = pageW - margin * 2;
    const imgH = imgW; // square
    pdf.addImage(imgData, 'PNG', margin, margin, imgW, imgH);
    pdf.setFontSize(11);
    const promptLines = pdf.splitTextToSize(panel.prompt || '', imgW);
    pdf.text(promptLines, margin, margin + imgH + 24);
    if (panel.caption) {
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(`Caption: ${panel.caption}`, margin, pageH - 30);
      pdf.setTextColor(0);
    }
  }
  pdf.save(filename);
}

// ----- Video (WebM) ------------------------------------------
// Stitches each panel image into a short slideshow video.
// secondsPerPanel: how long each panel stays on screen.
export async function exportVideo(panels, { secondsPerPanel = 2, fps = 30, width = 1024, height = 1024 } = {}) {
  const valid = panels.filter(p => p.imageUrl);
  if (valid.length === 0) throw new Error('No panels with images to export');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  const chunks = [];
  recorder.ondataavailable = e => e.data.size && chunks.push(e.data);

  const finished = new Promise(resolve => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      triggerDownload(URL.createObjectURL(blob), 'storyboard.webm');
      resolve();
    };
  });

  recorder.start();

  for (const panel of valid) {
    const img = await loadImage(panel.imageUrl);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    // contain fit
    const ratio = Math.min(width / img.width, height / img.height);
    const w = img.width * ratio, h = img.height * ratio;
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    await wait(secondsPerPanel * 1000);
  }

  recorder.stop();
  await finished;
}

// ----- helpers -----------------------------------------------
function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function urlToDataUrl(url) {
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

const wait = ms => new Promise(r => setTimeout(r, ms));
