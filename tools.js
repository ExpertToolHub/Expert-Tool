/* ============================================================
   QUNVERO — EXTRA TOOLS (tools.js)
   Setup + Card System + Common Functions
   ============================================================ */

console.log('%cQunvero Extra Tools Loading...', 'color:#10b981;font-weight:bold');

/* ============================================================
   7 TOOLS KA DATA
   ============================================================ */
const EXTRA_TOOLS = [
  { id: 'ctc-salary', name: 'CTC → In-Hand Salary', cat: 'finance', icon: '💼', desc: 'Calculate your take-home salary from CTC', howto: 'Enter annual CTC, basic %, HRA %, PF, tax. Click Calculate to see monthly in-hand salary with full breakdown.', kw: ['ctc','salary','in-hand','take home','monthly salary'] },
  { id: 'attendance-calc', name: 'Attendance Calculator', cat: 'student', icon: '📊', desc: 'Track attendance percentage & required classes', howto: 'Enter total classes, present days, required %. Calculator shows current %, how many more to attend, and how many you can skip.', kw: ['attendance','percentage','classes','college','school'] },
  { id: 'qr-gen-pro', name: 'QR Code Generator Pro', cat: 'pdf', icon: '📱', desc: 'Generate QR for text, URL, phone, email, WiFi', howto: 'Choose type, enter details, click Generate. Download as PNG or SVG, Print. No duplicate QR generation.', kw: ['qr','qr code','url','wifi','vcard','scan'] },
  { id: 'image-compressor', name: 'Image Compressor Pro', cat: 'photo', icon: '🗜️', desc: 'Compress & resize images without losing quality', howto: 'Upload image, adjust quality (10-100%), optionally resize. Click Compress. Download compressed image. Original never modified.', kw: ['compress','image','reduce','size','resize','optimize'] },
  { id: 'image-to-pdf', name: 'Image to PDF Converter', cat: 'pdf', icon: '📄', desc: 'Convert multiple images into a single PDF', howto: 'Upload multiple images, reorder, remove. Choose page size (A4/A5/Letter), orientation. Generate PDF. Download or Print.', kw: ['image','pdf','jpg','png','convert','merge','combine'] },
  { id: 'pdf-merger', name: 'PDF Merger', cat: 'pdf', icon: '📚', desc: 'Combine multiple PDFs into one document', howto: 'Upload 2+ PDFs, reorder, remove. Click Merge PDF. Download merged document. Pages preserved in order.', kw: ['pdf','merge','combine','join','multiple pdf'] },
  { id: 'resume-builder', name: 'Resume Builder Pro', cat: 'student', icon: '📝', desc: 'Build professional ATS-friendly resume with live preview', howto: 'Fill personal info, education, experience, skills. Live preview updates. Download as PDF with selectable text. Save locally in browser.', kw: ['resume','cv','builder','ats','job','application'] }
];

window.EXTRA_TOOLS = EXTRA_TOOLS;

/* ============================================================
   TOOL CARD HTML
   ============================================================ */
function extraToolCardHTML(t) {
  const catMap = {
    'finance': 'linear-gradient(135deg,#22c55e,#10b981)',
    'student': 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    'pdf':     'linear-gradient(135deg,#ef4444,#f97316)',
    'photo':   'linear-gradient(135deg,#ec4899,#8b5cf6)'
  };
  const grad = catMap[t.cat] || 'var(--gradient)';
  const isFav = (typeof isFavorite === 'function' && isFavorite(t.id));
  const fav = isFav ? 'active' : '';
  const star = isFav ? '★' : '☆';
  return `<div class="tool-card" data-extra-tool="${t.id}" onclick="openExtraTool('${t.id}')">
    <button class="fav-btn ${fav}" onclick="event.stopPropagation();if(typeof toggleFavorite==='function')toggleFavorite('${t.id}',event)" title="Favorite">${star}</button>
    <div class="tool-icon" style="background:${grad}">${t.icon}</div>
    <div class="tool-name">${t.name}</div>
    <div class="tool-desc">${t.desc}</div>
    <button class="tool-open-btn">Open Tool →</button>
  </div>`;
}

window.extraToolCardHTML = extraToolCardHTML;

/* ============================================================
   AUTO-INJECT CARDS INTO ALL TOOLS GRID
   ============================================================ */
function injectExtraTools() {
  const allToolsGrid = document.getElementById('allTools');
  if (allToolsGrid) {
    const existing = allToolsGrid.querySelectorAll('[data-extra-tool]');
    if (existing.length === 0) {
      allToolsGrid.insertAdjacentHTML('beforeend', EXTRA_TOOLS.map(t => extraToolCardHTML(t)).join(''));
      console.log('%c✅ 7 extra tools injected', 'color:#10b981');
    }
  }
  // Update stats count
  const statTools = document.getElementById('statTools');
  if (statTools && statTools.dataset.count) {
    const old = parseInt(statTools.dataset.count) || 38;
    statTools.dataset.count = String(old + 7);
  }
}

setTimeout(injectExtraTools, 100);

/* ============================================================
   TOOL OPEN HANDLER
   ============================================================ */
window.EXTRA_TOOL_RENDERERS = {};
window.EXTRA_TOOL_INITS = {};

window.openExtraTool = function(toolId) {
  const tool = EXTRA_TOOLS.find(t => t.id === toolId);
  if (!tool) { if (typeof toast === 'function') toast('Tool not found', 'error'); return; }

  const titleEl = document.getElementById('toolTitle');
  const descEl = document.getElementById('toolDesc');
  const howtoEl = document.getElementById('toolHowTo');
  const bodyEl = document.getElementById('toolBody');

  if (titleEl) titleEl.textContent = tool.icon + ' ' + tool.name;
  if (descEl) descEl.textContent = tool.desc;
  document.title = tool.name + ' — Qunvero';

  const favBtn = document.getElementById('toolFavBtn');
  if (favBtn) {
    favBtn.dataset.tool = toolId;
    const isFav = (typeof isFavorite === 'function' && isFavorite(toolId));
    favBtn.textContent = isFav ? '★' : '☆';
    favBtn.classList.toggle('active', isFav);
    favBtn.onclick = (e) => { if (typeof toggleFavorite === 'function') toggleFavorite(toolId, e); };
  }

  if (howtoEl && tool.howto) {
    howtoEl.style.display = 'block';
    howtoEl.innerHTML = '<strong>📖 How to use:</strong> ' + tool.howto;
  }

  const renderer = window.EXTRA_TOOL_RENDERERS[toolId];
  if (bodyEl) {
    if (!renderer) {
      bodyEl.innerHTML = '<div class="card"><div class="card-title">Loading...</div><p>Is tool ka code next message me aa raha hai. Filhaal baaki tools use karo.</p></div>';
    } else {
      bodyEl.innerHTML = renderer();
      setTimeout(() => {
        if (window.EXTRA_TOOL_INITS[toolId]) window.EXTRA_TOOL_INITS[toolId]();
      }, 50);
    }
  }

  if (typeof addRecent === 'function') addRecent(toolId);
  if (typeof switchView === 'function') switchView('toolView');
};

/* ============================================================
   UNIVERSAL DOWNLOAD FUNCTIONS (Sab tools ke liye common)
   ============================================================ */
window.extraDownloadPDF = function(boxId, filename) {
  const el = document.getElementById(boxId);
  if (!el || !el.classList.contains('active')) {
    if (typeof toast === 'function') toast('Calculate first', 'error');
    return;
  }
  if (typeof toast === 'function') toast('Generating PDF...');

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.btn-group, .export-btns, .how-to-use, .no-print').forEach(n => n.remove());
  clone.style.background = '#ffffff';
  clone.style.color = '#111111';
  clone.style.padding = '30px';
  clone.style.width = '760px';
  clone.style.boxSizing = 'border-box';
  clone.style.fontFamily = 'Arial, sans-serif';

  clone.querySelectorAll('.result-main').forEach(e => {
    const c = e.style.color || '#4f46e5';
    e.style.background = 'none';
    e.style.webkitTextFillColor = c;
    e.style.color = c;
    e.style.fontSize = '32px';
  });
  clone.querySelectorAll('*').forEach(e => {
    const cs = window.getComputedStyle(e);
    if (cs.webkitTextFillColor === 'transparent' || cs.color === 'rgba(0, 0, 0, 0)') {
      e.style.webkitTextFillColor = '#111111';
      e.style.color = '#111111';
      e.style.background = 'none';
    }
  });
  clone.querySelectorAll('.k, .result-sub, .result-title, .card-title').forEach(e => e.style.color = '#555555');
  clone.querySelectorAll('.v').forEach(e => e.style.color = '#111111');
  clone.querySelectorAll('.txn-credit').forEach(e => e.style.color = '#ef4444');
  clone.querySelectorAll('.txn-payment').forEach(e => e.style.color = '#10b981');

  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding-bottom:12px;border-bottom:2px solid #6366f1;margin-bottom:16px">
      <div style="font-size:22px;font-weight:900;color:#6366f1">⚡ Qunvero</div>
      <div style="font-size:12px;color:#888">${new Date().toLocaleString('en-IN')}</div>
    </div>`;
  clone.insertBefore(header, clone.firstChild);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;background:#fff;width:760px;padding:0;margin:0;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  setTimeout(() => {
    if (!window.htmlToImage) { toast('Library not loaded', 'error'); document.body.removeChild(wrap); return; }
    htmlToImage.toPng(clone, { quality: 0.98, pixelRatio: 2.5, backgroundColor: '#ffffff' })
      .then(dataUrl => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pw = pdf.internal.pageSize.getWidth();
        const ph = pdf.internal.pageSize.getHeight();
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          let w = pw - 20, h = w / ratio;
          if (h > ph - 20) { h = ph - 20; w = h * ratio; }
          pdf.addImage(dataUrl, 'PNG', (pw - w) / 2, 10, w, h, undefined, 'FAST');
          pdf.save((filename || 'qunvero') + '.pdf');
          toast('PDF downloaded ✅', 'success');
        };
        img.src = dataUrl;
      })
      .catch(err => { console.error(err); toast('PDF failed', 'error'); })
      .finally(() => document.body.removeChild(wrap));
  }, 300);
};

window.extraDownloadImage = function(boxId, filename) {
  const el = document.getElementById(boxId);
  if (!el || !el.classList.contains('active')) {
    if (typeof toast === 'function') toast('Calculate first', 'error');
    return;
  }
  if (typeof toast === 'function') toast('Generating Image...');

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.btn-group, .export-btns, .how-to-use, .no-print').forEach(n => n.remove());
  clone.style.background = '#ffffff';
  clone.style.color = '#111111';
  clone.style.padding = '30px';
  clone.style.width = '760px';
  clone.style.boxSizing = 'border-box';
  clone.style.fontFamily = 'Arial, sans-serif';

  clone.querySelectorAll('.result-main').forEach(e => {
    const c = e.style.color || '#4f46e5';
    e.style.background = 'none';
    e.style.webkitTextFillColor = c;
    e.style.color = c;
    e.style.fontSize = '32px';
  });
  clone.querySelectorAll('*').forEach(e => {
    const cs = window.getComputedStyle(e);
    if (cs.webkitTextFillColor === 'transparent' || cs.color === 'rgba(0, 0, 0, 0)') {
      e.style.webkitTextFillColor = '#111111';
      e.style.color = '#111111';
      e.style.background = 'none';
    }
  });
  clone.querySelectorAll('.k, .result-sub, .result-title, .card-title').forEach(e => e.style.color = '#555555');
  clone.querySelectorAll('.v').forEach(e => e.style.color = '#111111');

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;background:#fff;width:760px;padding:0;margin:0;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  setTimeout(() => {
    if (!window.htmlToImage) { toast('Library not loaded', 'error'); document.body.removeChild(wrap); return; }
    htmlToImage.toPng(clone, { quality: 1.0, pixelRatio: 3, backgroundColor: '#ffffff' })
      .then(dataUrl => {
        const a = document.createElement('a');
        a.download = (filename || 'qunvero') + '.png';
        a.href = dataUrl;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast('Image downloaded ✅', 'success');
      })
      .catch(err => { console.error(err); toast('Image failed', 'error'); })
      .finally(() => document.body.removeChild(wrap));
  }, 300);
};

/* ============================================================
   COMMON COPY / SHARE HELPERS
   ============================================================ */
window.extraCopy = function(text) {
  if (!text) { if (typeof toast === 'function') toast('Nothing to copy', 'error'); return; }
  navigator.clipboard.writeText(text)
    .then(() => toast('Copied!', 'success'))
    .catch(() => toast('Copy failed', 'error'));
};

window.extraShare = function(title, text) {
  if (!text) return;
  if (navigator.share) {
    navigator.share({ title: title || 'Qunvero', text: text }).catch(() => {});
  } else {
    window.extraCopy(text);
  }
};

console.log('%c✅ Setup loaded — 7 tool cards ready', 'color:#10b981;font-weight:bold;font-size:14px');