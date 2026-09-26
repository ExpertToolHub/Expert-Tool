/* ============================================================
   QUNVERO — EXTRA TOOLS (tools.js)
   FINAL COMPLETE VERSION
   5 Tools + Ultra HD Downloads + Fixed Print
   ============================================================ */

console.log('%cQunvero Extra Tools Loading...', 'color:#10b981;font-weight:bold');

/* ============================================================
   TOOLS DATA
   ============================================================ */
const EXTRA_TOOLS = [
  { id: 'ctc-salary', name: 'CTC → In-Hand Salary', cat: 'finance', icon: '💼', desc: 'Calculate your take-home salary from CTC', howto: 'Enter annual CTC, basic %, HRA %, PF, tax. Click Calculate to see monthly in-hand salary with full breakdown.', kw: ['ctc','salary','in-hand','take home'] },
  { id: 'attendance-calc', name: 'Attendance Calculator', cat: 'student', icon: '📊', desc: 'Track attendance percentage & required classes', howto: 'Enter total classes, present days, required %. Calculator shows current %, how many more to attend, and how many you can skip.', kw: ['attendance','percentage','classes'] },
  { id: 'qr-gen-pro', name: 'QR Code Generator Pro', cat: 'pdf', icon: '📱', desc: 'Paste URL or text and generate QR instantly', howto: 'Paste any URL, text, phone number or email. Click Generate QR. Download as Ultra HD PNG or SVG. Print works perfectly.', kw: ['qr','qr code','url','link'] },
  { id: 'image-compressor', name: 'Image Compressor Pro', cat: 'photo', icon: '🗜️', desc: 'Compress & resize images without losing quality', howto: 'Upload image, adjust quality, optionally resize. Click Compress. Download compressed image.', kw: ['compress','image','reduce','size'] },
  { id: 'image-to-pdf', name: 'Image to PDF Converter', cat: 'pdf', icon: '📄', desc: 'Convert multiple images into a single PDF', howto: 'Upload multiple images, choose page size & orientation. Generate PDF. Download or Print.', kw: ['image','pdf','jpg','png'] },
  { id: 'pdf-merger', name: 'PDF Merger', cat: 'pdf', icon: '📚', desc: 'Combine multiple PDFs into one document', howto: 'Upload 2+ PDFs. Click Merge. Download merged document.', kw: ['pdf','merge','combine'] },
  { id: 'resume-builder', name: 'Resume Builder Pro', cat: 'student', icon: '📝', desc: 'Build professional ATS-friendly resume', howto: 'Fill details, live preview updates. Download as PDF.', kw: ['resume','cv','builder'] }
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
   AUTO-INJECT CARDS
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
      bodyEl.innerHTML = '<div class="card">Loading...</div>';
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
   UNIVERSAL ULTRA HD PDF DOWNLOAD (4x resolution)
   ============================================================ */
window.extraDownloadPDF = function(boxId, filename) {
  const el = document.getElementById(boxId);
  if (!el || !el.classList.contains('active')) {
    if (typeof toast === 'function') toast('Calculate first', 'error');
    return;
  }
  if (typeof toast === 'function') toast('Generating Ultra HD PDF...');

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.btn-group, .export-btns, .how-to-use, .no-print').forEach(n => n.remove());
  clone.style.background = '#ffffff';
  clone.style.color = '#111111';
  clone.style.padding = '40px';
  clone.style.width = '820px';
  clone.style.boxSizing = 'border-box';
  clone.style.fontFamily = 'Arial, sans-serif';

  clone.querySelectorAll('.result-main').forEach(e => {
    const c = e.style.color || '#4f46e5';
    e.style.background = 'none';
    e.style.webkitTextFillColor = c;
    e.style.color = c;
    e.style.fontSize = '36px';
    e.style.fontWeight = '900';
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
    <div style="display:flex;justify-content:space-between;padding-bottom:16px;border-bottom:3px solid #6366f1;margin-bottom:20px">
      <div style="font-size:28px;font-weight:900;color:#6366f1">⚡ Qunvero</div>
      <div style="font-size:14px;color:#888">${new Date().toLocaleString('en-IN')}</div>
    </div>`;
  clone.insertBefore(header, clone.firstChild);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;background:#fff;width:820px;padding:0;margin:0;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  setTimeout(() => {
    if (!window.htmlToImage) { toast('Library not loaded', 'error'); document.body.removeChild(wrap); return; }
    htmlToImage.toPng(clone, { quality: 1.0, pixelRatio: 4, backgroundColor: '#ffffff' })
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
          toast('Ultra HD PDF downloaded ✅', 'success');
        };
        img.src = dataUrl;
      })
      .catch(err => { console.error(err); toast('PDF failed', 'error'); })
      .finally(() => document.body.removeChild(wrap));
  }, 400);
};

/* ============================================================
   UNIVERSAL ULTRA HD IMAGE DOWNLOAD (4x resolution)
   ============================================================ */
window.extraDownloadImage = function(boxId, filename) {
  const el = document.getElementById(boxId);
  if (!el || !el.classList.contains('active')) {
    if (typeof toast === 'function') toast('Calculate first', 'error');
    return;
  }
  if (typeof toast === 'function') toast('Generating Ultra HD Image...');

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.btn-group, .export-btns, .how-to-use, .no-print').forEach(n => n.remove());
  clone.style.background = '#ffffff';
  clone.style.color = '#111111';
  clone.style.padding = '40px';
  clone.style.width = '820px';
  clone.style.boxSizing = 'border-box';
  clone.style.fontFamily = 'Arial, sans-serif';

  clone.querySelectorAll('.result-main').forEach(e => {
    const c = e.style.color || '#4f46e5';
    e.style.background = 'none';
    e.style.webkitTextFillColor = c;
    e.style.color = c;
    e.style.fontSize = '36px';
    e.style.fontWeight = '900';
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
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;background:#fff;width:820px;padding:0;margin:0;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  setTimeout(() => {
    if (!window.htmlToImage) { toast('Library not loaded', 'error'); document.body.removeChild(wrap); return; }
    htmlToImage.toPng(clone, { quality: 1.0, pixelRatio: 4, backgroundColor: '#ffffff' })
      .then(dataUrl => {
        const a = document.createElement('a');
        a.download = (filename || 'qunvero') + '.png';
        a.href = dataUrl;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast('Ultra HD Image downloaded ✅', 'success');
      })
      .catch(err => { console.error(err); toast('Image failed', 'error'); })
      .finally(() => document.body.removeChild(wrap));
  }, 400);
};

/* ============================================================
   UNIVERSAL PRINT (Sirf result print — clean page)
   ============================================================ */
window.extraPrint = function(boxId, title) {
  const el = document.getElementById(boxId);
  if (!el || !el.classList.contains('active')) {
    if (typeof toast === 'function') toast('Calculate first', 'error');
    return;
  }

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.btn-group, .export-btns, .how-to-use, .no-print').forEach(n => n.remove());
  clone.querySelectorAll('.result-main').forEach(e => {
    const c = e.style.color || '#4f46e5';
    e.style.background = 'none';
    e.style.webkitTextFillColor = c;
    e.style.color = c;
    e.style.fontSize = '28px';
    e.style.fontWeight = '900';
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

  const header = `<div style="display:flex;justify-content:space-between;padding-bottom:10px;border-bottom:2px solid #6366f1;margin-bottom:14px;font-family:Arial,sans-serif"><div style="font-size:18px;font-weight:900;color:#6366f1">⚡ Qunvero</div><div style="font-size:11px;color:#888">${new Date().toLocaleString('en-IN')}</div></div>${title ? `<div style="font-size:16px;font-weight:700;color:#111;margin-bottom:12px;font-family:Arial,sans-serif">${title}</div>` : ''}`;

  const html = `<!DOCTYPE html><html><head><title>Qunvero Print</title><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;padding:20px;color:#111;background:#fff}
    .result-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:14px;gap:10px}
    .result-row .k{color:#555;font-weight:500}
    .result-row .v{color:#111;font-weight:700;text-align:right}
    .result-main{font-size:28px;font-weight:900;color:#4f46e5;margin-bottom:6px}
    .result-sub{color:#666;font-size:13px;margin-bottom:14px}
    .result-title{font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;padding-bottom:8px;border-bottom:1px dashed #ccc}
    .card-title{font-size:13px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.06em;margin:14px 0 8px}
    .txn-credit{color:#ef4444}.txn-payment{color:#10b981}
    img{max-width:100%;height:auto;border-radius:8px}
    @media print{body{padding:10px}}
  </style></head><body>${header}${clone.outerHTML}</body></html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }, 500);
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }, 500);
};

/* ============================================================
   COPY & SHARE
   ============================================================ */
window.extraCopy = function(text) {
  if (!text) { if (typeof toast === 'function') toast('Nothing to copy', 'error'); return; }
  navigator.clipboard.writeText(text).then(() => toast('Copied!', 'success')).catch(() => toast('Copy failed', 'error'));
};
window.extraShare = function(title, text) {
  if (!text) return;
  if (navigator.share) navigator.share({ title: title || 'Qunvero', text }).catch(() => {});
  else window.extraCopy(text);
};

/* ============================================================
   TOOL 1: CTC → IN-HAND SALARY
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['ctc-salary'] = () => `
  <div class="card"><div class="card-title">Salary Details</div>
    <div class="field"><label>Annual CTC (₹)</label><input type="number" id="ctcAmount" min="0" step="1000" value="600000" /></div>
    <div class="field-row">
      <div class="field"><label>Basic (% of CTC)</label><input type="number" id="ctcBasicPct" min="0" max="100" step="0.5" value="40" /></div>
      <div class="field"><label>HRA (% of Basic)</label><input type="number" id="ctcHraPct" min="0" max="100" step="0.5" value="50" /></div>
    </div>
  </div>
  <div class="card"><div class="card-title">Deductions</div>
    <div class="field-row">
      <div class="field"><label>Employee PF (%)</label><input type="number" id="ctcPfPct" min="0" max="100" step="0.5" value="12" /></div>
      <div class="field"><label>Professional Tax (₹/yr)</label><input type="number" id="ctcProfTax" min="0" step="100" value="2400" /></div>
    </div>
    <div class="field"><label>Other Deductions (₹/yr)</label><input type="number" id="ctcOtherDed" min="0" step="100" value="0" /></div>
    <div class="field"><label>Estimated Income Tax (₹/yr)</label><input type="number" id="ctcTax" min="0" step="1000" value="0" /><div class="hint">User estimate — actual tax apne CA se check karo.</div></div>
  </div>
  <div class="btn-group" style="margin-bottom:14px">
    <button class="btn btn-primary" onclick="ctcCalculate()">💰 Calculate</button>
    <button class="btn btn-secondary" onclick="ctcReset()">🔄 Reset</button>
  </div>
  <div class="result-box" id="ctcResult"></div>`;

window.EXTRA_TOOL_INITS['ctc-salary'] = () => console.log('%c✅ CTC Salary loaded', 'color:#10b981');

window.ctcCalculate = function() {
  const ctc = Number(document.getElementById('ctcAmount').value) || 0;
  const basicPct = Number(document.getElementById('ctcBasicPct').value) || 40;
  const hraPct = Number(document.getElementById('ctcHraPct').value) || 50;
  const pfPct = Number(document.getElementById('ctcPfPct').value) || 12;
  const profTax = Number(document.getElementById('ctcProfTax').value) || 0;
  const otherDed = Number(document.getElementById('ctcOtherDed').value) || 0;
  const tax = Number(document.getElementById('ctcTax').value) || 0;
  if (ctc <= 0) { toast('Enter valid CTC', 'error'); return; }

  const basic = ctc * basicPct / 100;
  const hra = basic * hraPct / 100;
  const employerPF = basic * 12 / 100;
  const employeePF = basic * pfPct / 100;
  const specialAllowance = ctc - basic - hra - employerPF;
  const grossSalary = basic + hra + specialAllowance;
  const totalDeductions = employeePF + profTax + otherDed + tax;
  const annualInHand = grossSalary - totalDeductions;
  const monthlyInHand = annualInHand / 12;
  const monthlyGross = grossSalary / 12;
  const dedPct = grossSalary > 0 ? (totalDeductions / grossSalary * 100) : 0;
  const fmt = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const box = document.getElementById('ctcResult');
  box.innerHTML = `
    <div class="result-title">Salary Breakdown</div>
    <div class="result-main">${fmt(monthlyInHand)}</div>
    <div class="result-sub">Monthly In-Hand Salary</div>
    <div style="margin-top:20px">
      <div class="result-row"><span class="k">Annual CTC</span><span class="v">${fmt(ctc)}</span></div>
      <div class="result-row"><span class="k">Basic (${basicPct}%)</span><span class="v">${fmt(basic)}</span></div>
      <div class="result-row"><span class="k">HRA (${hraPct}%)</span><span class="v">${fmt(hra)}</span></div>
      <div class="result-row"><span class="k">Special Allowance</span><span class="v">${fmt(specialAllowance)}</span></div>
      <div class="result-row"><span class="k">Employer PF</span><span class="v">${fmt(employerPF)}</span></div>
      <div class="result-row" style="background:var(--surface-2);padding:10px 8px;margin-top:8px;border-radius:8px"><span class="k" style="font-weight:700">Annual Gross</span><span class="v">${fmt(grossSalary)}</span></div>
    </div>
    <div style="margin-top:20px">
      <div class="card-title" style="margin-bottom:10px">Deductions (Annual)</div>
      <div class="result-row"><span class="k">Employee PF</span><span class="v txn-credit">− ${fmt(employeePF)}</span></div>
      <div class="result-row"><span class="k">Professional Tax</span><span class="v txn-credit">− ${fmt(profTax)}</span></div>
      <div class="result-row"><span class="k">Other</span><span class="v txn-credit">− ${fmt(otherDed)}</span></div>
      <div class="result-row"><span class="k">Income Tax</span><span class="v txn-credit">− ${fmt(tax)}</span></div>
      <div class="result-row" style="background:var(--surface-2);padding:10px 8px;margin-top:8px;border-radius:8px"><span class="k" style="font-weight:700">Total Deductions</span><span class="v">${fmt(totalDeductions)} (${dedPct.toFixed(1)}%)</span></div>
    </div>
    <div style="margin-top:20px">
      <div class="card-title" style="margin-bottom:10px">In-Hand Summary</div>
      <div class="result-row"><span class="k">Monthly Gross</span><span class="v">${fmt(monthlyGross)}</span></div>
      <div class="result-row"><span class="k" style="font-weight:700">Monthly In-Hand</span><span class="v" style="color:var(--success)">${fmt(monthlyInHand)}</span></div>
      <div class="result-row"><span class="k" style="font-weight:700">Annual In-Hand</span><span class="v" style="color:var(--success)">${fmt(annualInHand)}</span></div>
    </div>
    <div class="how-to-use" style="margin-top:16px;font-size:12px">⚠️ <strong>Disclaimer:</strong> Ye estimate hai. Official calculation ke liye apne HR/CA se check karo.</div>
    <div class="export-btns no-export no-print" style="margin-top:14px">
      <button class="btn btn-secondary" onclick="extraDownloadPDF('ctcResult','ctc-salary')"><i>📄</i>PDF</button>
      <button class="btn btn-secondary" onclick="extraDownloadImage('ctcResult','ctc-salary')"><i>🖼️</i>Image</button>
      <button class="btn btn-secondary" onclick="extraPrint('ctcResult','CTC → In-Hand Salary Report')"><i>🖨️</i>Print</button>
    </div>
    <div class="btn-group" style="margin-top:8px">
      <button class="btn btn-secondary btn-sm" onclick="extraCopy(window._ctcSummary)">📋 Copy</button>
      <button class="btn btn-secondary btn-sm" onclick="extraShare('CTC Salary', window._ctcSummary)">📤 Share</button>
    </div>`;
  box.classList.add('active');
  window._ctcSummary = `CTC → In-Hand Salary\n\nAnnual CTC: ${fmt(ctc)}\nMonthly In-Hand: ${fmt(monthlyInHand)}\nAnnual In-Hand: ${fmt(annualInHand)}\nTotal Deductions: ${fmt(totalDeductions)} (${dedPct.toFixed(1)}%)`;
};

window.ctcReset = function() {
  document.getElementById('ctcAmount').value = 600000;
  document.getElementById('ctcBasicPct').value = 40;
  document.getElementById('ctcHraPct').value = 50;
  document.getElementById('ctcPfPct').value = 12;
  document.getElementById('ctcProfTax').value = 2400;
  document.getElementById('ctcOtherDed').value = 0;
  document.getElementById('ctcTax').value = 0;
  const box = document.getElementById('ctcResult');
  box.classList.remove('active'); box.innerHTML = '';
  toast('Reset done', 'success');
};

/* ============================================================
   TOOL 2: ATTENDANCE CALCULATOR
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['attendance-calc'] = () => `
  <div class="card"><div class="card-title">Attendance Details</div>
    <div class="field"><label>Total Classes / Days</label><input type="number" id="attTotal" min="1" step="1" placeholder="100" /></div>
    <div class="field"><label>Present Classes / Days</label><input type="number" id="attPresent" min="0" step="1" placeholder="75" /></div>
    <div class="field"><label>Required Attendance (%)</label><input type="number" id="attRequired" min="0" max="100" step="0.1" value="75" /></div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="attCalculate()">📊 Calculate</button>
      <button class="btn btn-secondary" onclick="attReset()">🔄 Reset</button>
    </div>
  </div>
  <div class="result-box" id="attResult"></div>`;

window.EXTRA_TOOL_INITS['attendance-calc'] = () => console.log('%c✅ Attendance loaded', 'color:#10b981');

window.attCalculate = function() {
  const total = Number(document.getElementById('attTotal').value) || 0;
  const present = Number(document.getElementById('attPresent').value) || 0;
  const required = Number(document.getElementById('attRequired').value) || 75;
  if (total <= 0) { toast('Enter valid total', 'error'); return; }
  if (present < 0 || present > total) { toast('Present must be 0-' + total, 'error'); return; }
  if (required <= 0 || required > 100) { toast('Required % 0-100', 'error'); return; }
  const absent = total - present;
  const currentPct = (present / total) * 100;
  const absentPct = (absent / total) * 100;
  let neededClasses = 0, canSkip = 0, status, statusColor;
  if (currentPct >= required) {
    status = 'Safe'; statusColor = 'var(--success)';
    canSkip = Math.floor((present * 100 / required) - total);
    if (canSkip < 0) canSkip = 0;
  } else {
    status = 'Low Attendance'; statusColor = 'var(--danger)';
    const reqFrac = required / 100;
    neededClasses = Math.ceil((reqFrac * total - present) / (1 - reqFrac));
    if (neededClasses < 0) neededClasses = 0;
  }
  const box = document.getElementById('attResult');
  box.innerHTML = `
    <div class="result-title">Attendance Result</div>
    <div class="result-main" style="color:${statusColor};-webkit-text-fill-color:${statusColor}">${currentPct.toFixed(2)}%</div>
    <div class="result-sub">Current Attendance — <strong style="color:${statusColor}">${status}</strong></div>
    <div class="result-row"><span class="k">Total</span><span class="v">${total}</span></div>
    <div class="result-row"><span class="k">Present</span><span class="v" style="color:var(--success)">${present}</span></div>
    <div class="result-row"><span class="k">Absent</span><span class="v" style="color:var(--danger)">${absent}</span></div>
    <div class="result-row"><span class="k">Present %</span><span class="v">${currentPct.toFixed(2)}%</span></div>
    <div class="result-row"><span class="k">Absent %</span><span class="v">${absentPct.toFixed(2)}%</span></div>
    <div class="result-row"><span class="k">Required %</span><span class="v">${required}%</span></div>
    <div style="margin-top:16px;padding:14px;background:var(--surface-2);border-radius:12px">
      ${currentPct >= required 
        ? `<div><strong>✅ You are safe!</strong></div><div style="font-size:13px;margin-top:6px">You can skip <strong style="color:var(--success);font-size:18px">${canSkip}</strong> more classes</div>`
        : `<div><strong>⚠️ Low Attendance!</strong></div><div style="font-size:13px;margin-top:6px">Attend <strong style="color:var(--danger);font-size:18px">${neededClasses}</strong> more classes</div>`}
    </div>
    <div class="export-btns no-export no-print" style="margin-top:14px">
      <button class="btn btn-secondary" onclick="extraDownloadPDF('attResult','attendance')"><i>📄</i>PDF</button>
      <button class="btn btn-secondary" onclick="extraDownloadImage('attResult','attendance')"><i>🖼️</i>Image</button>
      <button class="btn btn-secondary" onclick="extraPrint('attResult','Attendance Report')"><i>🖨️</i>Print</button>
    </div>
    <div class="btn-group" style="margin-top:8px">
      <button class="btn btn-secondary btn-sm" onclick="extraCopy(window._attSummary)">📋 Copy</button>
      <button class="btn btn-secondary btn-sm" onclick="extraShare('Attendance Report', window._attSummary)">📤 Share</button>
    </div>`;
  box.classList.add('active');
  window._attSummary = `Attendance Report\n\nTotal: ${total}\nPresent: ${present}\nAbsent: ${absent}\nCurrent: ${currentPct.toFixed(2)}%\nRequired: ${required}%\nStatus: ${status}\n${currentPct >= required ? 'Can skip: ' + canSkip + ' classes' : 'Need to attend: ' + neededClasses + ' more classes'}`;
};

window.attReset = function() {
  document.getElementById('attTotal').value = '';
  document.getElementById('attPresent').value = '';
  document.getElementById('attRequired').value = 75;
  const box = document.getElementById('attResult');
  box.classList.remove('active'); box.innerHTML = '';
  toast('Reset done', 'success');
};

/* ============================================================
   TOOL 3: QR CODE GENERATOR — SIMPLE URL ONLY
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['qr-gen-pro'] = () => `
  <div class="card">
    <div class="card-title">QR Code Generator</div>
    <div class="field">
      <label>Paste URL or Text</label>
      <textarea id="qrInput" placeholder="https://example.com ya koi bhi text paste karo..." rows="3" style="font-size:15px"></textarea>
      <div class="hint">URL, text, phone number, email — kuch bhi paste karo, QR ban jayega</div>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="qrProGenerate()" style="flex:2">📱 Generate QR</button>
      <button class="btn btn-secondary" onclick="qrProReset()" style="flex:1">🔄 Reset</button>
    </div>
  </div>
  <div class="result-box" id="qrResult"></div>`;

window.EXTRA_TOOL_INITS['qr-gen-pro'] = () => console.log('%c✅ QR Pro loaded', 'color:#10b981');

window.qrProGenerate = function() {
  const raw = document.getElementById('qrInput').value.trim();
  if (!raw) { toast('Paste URL or text first', 'error'); return; }

  // Auto-detect type
  let data = raw;
  if (/^https?:\/\//i.test(raw)) data = raw;
  else if (/^www\./i.test(raw)) data = 'https://' + raw;
  else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) data = 'mailto:' + raw;
  else if (/^\+?[\d\s\-()]{10,}$/.test(raw)) data = 'tel:' + raw.replace(/[^\d+]/g, '');
  else data = raw;

  const box = document.getElementById('qrResult');
  box.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'qr-container';
  container.style.background = '#ffffff';
  box.appendChild(container);

  try {
    new QRCode(container, {
      text: data,
      width: 320,
      height: 320,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch (e) { console.error(e); toast('QR generation failed', 'error'); return; }

  setTimeout(() => {
    // White padding to preview
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.padding = '20px';
      canvas.style.background = '#ffffff';
      canvas.style.borderRadius = '12px';
    }
    const img = container.querySelector('img');
    if (img) {
      img.style.padding = '20px';
      img.style.background = '#ffffff';
      img.style.borderRadius = '12px';
    }

    const actions = document.createElement('div');
    actions.innerHTML = `
      <div class="export-btns no-export no-print" style="margin-top:14px">
        <button class="btn btn-secondary" onclick="qrProDownloadPNG()"><i>🖼️</i>HD PNG</button>
        <button class="btn btn-secondary" onclick="qrProDownloadSVG()"><i>📐</i>HD SVG</button>
        <button class="btn btn-secondary" onclick="qrProPrint()"><i>🖨️</i>Print</button>
      </div>`;
    box.appendChild(actions);
    box.classList.add('active');
  }, 150);
};

window.qrProDownloadPNG = function() {
  const container = document.querySelector('#qrResult .qr-container');
  if (!container) { toast('Generate QR first', 'error'); return; }
  const canvas = container.querySelector('canvas');
  const img = container.querySelector('img');
  let src = null;
  let baseSize = 320;
  if (canvas) { src = canvas.toDataURL('image/png'); baseSize = canvas.width || 320; }
  else if (img && img.src && img.src.startsWith('data:')) { src = img.src; baseSize = img.naturalWidth || 320; }
  else if (img && img.src) { src = img.src; baseSize = img.naturalWidth || 320; }
  if (!src) { toast('QR not ready', 'error'); return; }

  // ULTRA HD: 6x resolution + white padding
  const SCALE = 6;
  const PADDING_PCT = 0.12;
  const finalSize = baseSize * SCALE;
  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = finalSize;
  hdCanvas.height = finalSize;
  const ctx = hdCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, finalSize, finalSize);

  const imgEl = new Image();
  imgEl.onload = () => {
    const pad = finalSize * PADDING_PCT;
    const innerSize = finalSize - (2 * pad);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imgEl, pad, pad, innerSize, innerSize);
    const url = hdCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = 'qunvero-qr-' + finalSize + 'px.png';
    a.href = url;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('Ultra HD QR downloaded (' + finalSize + 'px) ✅', 'success');
  };
  imgEl.onerror = () => toast('QR download failed', 'error');
  imgEl.src = src;
};

window.qrProDownloadSVG = function() {
  const container = document.querySelector('#qrResult .qr-container');
  if (!container) { toast('Generate QR first', 'error'); return; }
  const canvas = container.querySelector('canvas');
  if (!canvas) { toast('SVG requires canvas QR', 'error'); return; }

  const SCALE = 8;
  const PADDING_PCT = 0.12;
  const baseSize = canvas.width || 320;
  const finalSize = baseSize * SCALE;
  const pad = finalSize * PADDING_PCT;
  const innerSize = finalSize - (2 * pad);

  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = finalSize;
  hdCanvas.height = finalSize;
  const ctx = hdCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, finalSize, finalSize);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, pad, pad, innerSize, innerSize);
  const pngData = hdCanvas.toDataURL('image/png');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${finalSize}" height="${finalSize}" viewBox="0 0 ${finalSize} ${finalSize}">
    <rect width="${finalSize}" height="${finalSize}" fill="#ffffff"/>
    <image href="${pngData}" x="${pad}" y="${pad}" width="${innerSize}" height="${innerSize}" preserveAspectRatio="xMidYMid meet"/>
  </svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'qunvero-qr-' + finalSize + 'px.svg';
  a.href = url;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast('Ultra HD SVG downloaded (' + finalSize + 'px) ✅', 'success');
};

window.qrProPrint = function() {
  const container = document.querySelector('#qrResult .qr-container');
  if (!container) { toast('Generate QR first', 'error'); return; }

  const canvas = container.querySelector('canvas');
  const img = container.querySelector('img');
  let src = null;
  if (canvas) src = canvas.toDataURL('image/png');
  else if (img && img.src) src = img.src;
  if (!src) { toast('QR not ready', 'error'); return; }

  const printHtml = `<!DOCTYPE html>
<html><head><title>Qunvero QR Print</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:30px;background:#fff}
  .header{display:flex;justify-content:space-between;align-items:center;width:100%;max-width:600px;padding-bottom:14px;border-bottom:3px solid #6366f1;margin-bottom:24px}
  .brand{font-size:24px;font-weight:900;color:#6366f1}
  .date{font-size:12px;color:#888}
  .qr-wrap{background:#fff;padding:24px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center}
  .qr-wrap img{width:420px;height:420px;image-rendering:pixelated;display:block}
  .footer{margin-top:24px;font-size:12px;color:#888;text-align:center}
  @media print{body{padding:15px}.qr-wrap{box-shadow:none;padding:16px}.qr-wrap img{width:100%;max-width:480px;height:auto}}
  @media (max-width:600px){.qr-wrap img{width:280px;height:280px}}
</style>
</head>
<body>
  <div class="header">
    <div class="brand">⚡ Qunvero</div>
    <div class="date">${new Date().toLocaleString('en-IN')}</div>
  </div>
  <div class="qr-wrap"><img src="${src}" alt="QR Code" /></div>
  <div class="footer">Generated by Qunvero — qunvero.vercel.app</div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(printHtml); doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }, 600);
    return;
  }
  printWindow.document.write(printHtml);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1200);
  }, 600);
};

window.qrProReset = function() {
  document.getElementById('qrInput').value = '';
  const box = document.getElementById('qrResult');
  box.classList.remove('active'); box.innerHTML = '';
  toast('Reset done', 'success');
};

/* ============================================================
   TOOL 4: IMAGE COMPRESSOR PRO
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['image-compressor'] = () => `
  <div class="card"><div class="card-title">Upload Image</div>
    <div class="field"><label>Select Image (JPG/PNG/WebP)</label><input type="file" id="icFile" accept="image/jpeg,image/jpg,image/png,image/webp" /></div>
    <div class="field"><label>Quality: <span id="icQualityVal">70%</span></label><input type="range" id="icQuality" min="10" max="100" value="70" oninput="document.getElementById('icQualityVal').textContent=this.value+'%'" /></div>
    <div class="field-row">
      <div class="field"><label>Width (px)</label><input type="number" id="icWidth" min="0" step="1" placeholder="Auto" /></div>
      <div class="field"><label>Height (px)</label><input type="number" id="icHeight" min="0" step="1" placeholder="Auto" /></div>
    </div>
    <div class="field"><label><input type="checkbox" id="icLockRatio" checked style="width:auto;margin-right:6px" /> Maintain aspect ratio</label></div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="icCompress()">🗜️ Compress</button>
      <button class="btn btn-secondary" onclick="icReset()">🔄 Reset</button>
    </div>
  </div>
  <div class="result-box" id="icResult"></div>`;

window.EXTRA_TOOL_INITS['image-compressor'] = () => console.log('%c✅ Image Compressor loaded', 'color:#10b981');

window.icCompress = function() {
  const file = document.getElementById('icFile').files[0];
  if (!file) { toast('Select an image', 'error'); return; }
  const quality = Number(document.getElementById('icQuality').value) / 100;
  const targetW = Number(document.getElementById('icWidth').value) || 0;
  const targetH = Number(document.getElementById('icHeight').value) || 0;
  const lock = document.getElementById('icLockRatio').checked;
  toast('Compressing...');
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w = targetW || img.naturalWidth;
      let h = targetH || img.naturalHeight;
      if (lock && targetW && !targetH) h = Math.round(w * img.naturalHeight / img.naturalWidth);
      else if (lock && !targetW && targetH) w = Math.round(h * img.naturalWidth / img.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const origKB = (file.size / 1024).toFixed(1);
        const newKB = (blob.size / 1024).toFixed(1);
        const saved = ((1 - blob.size / file.size) * 100).toFixed(1);
        const box = document.getElementById('icResult');
        box.innerHTML = `
          <div class="result-title">Compression Result</div>
          <div class="result-main">${newKB} KB</div>
          <div class="result-sub">Saved ${saved}% (from ${origKB} KB)</div>
          <div class="result-row"><span class="k">Original</span><span class="v">${origKB} KB</span></div>
          <div class="result-row"><span class="k">Compressed</span><span class="v">${newKB} KB</span></div>
          <div class="result-row"><span class="k">Dimensions</span><span class="v">${w} × ${h} px</span></div>
          <div style="text-align:center;margin:16px 0"><img src="${url}" style="max-height:240px;border-radius:10px" /></div>
          <a class="btn btn-primary btn-block" href="${url}" download="compressed-${Date.now()}.jpg">⬇️ Download Compressed</a>
          <div class="export-btns no-export no-print" style="margin-top:14px">
            <button class="btn btn-secondary" onclick="extraDownloadImage('icResult','compressed-image')"><i>🖼️</i>Image</button>
            <button class="btn btn-secondary" onclick="extraPrint('icResult','Compressed Image')"><i>🖨️</i>Print</button>
          </div>`;
        box.classList.add('active');
        toast('Compressed ✅', 'success');
      }, 'image/jpeg', quality);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

window.icReset = function() {
  document.getElementById('icFile').value = '';
  document.getElementById('icQuality').value = 70;
  document.getElementById('icQualityVal').textContent = '70%';
  document.getElementById('icWidth').value = '';
  document.getElementById('icHeight').value = '';
  document.getElementById('icLockRatio').checked = true;
  const box = document.getElementById('icResult');
  box.classList.remove('active'); box.innerHTML = '';
  toast('Reset done', 'success');
};

/* ============================================================
   TOOL 5: IMAGE TO PDF CONVERTER
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['image-to-pdf'] = () => `
  <div class="card"><div class="card-title">Upload Images</div>
    <div class="field"><label>Select Images (multiple)</label><input type="file" id="ipFiles" accept="image/jpeg,image/jpg,image/png,image/webp" multiple /></div>
    <div id="ipPreview" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;margin-top:10px"></div>
  </div>
  <div class="card"><div class="card-title">PDF Settings</div>
    <div class="field-row">
      <div class="field"><label>Page Size</label><select id="ipPageSize"><option value="a4">A4</option><option value="a5">A5</option><option value="letter">Letter</option></select></div>
      <div class="field"><label>Orientation</label><select id="ipOrientation"><option value="p">Portrait</option><option value="l">Landscape</option></select></div>
    </div>
    <div class="field"><label>Margin (mm)</label><input type="number" id="ipMargin" min="0" max="30" step="1" value="10" /></div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="ipGenerate()">📄 Generate PDF</button>
      <button class="btn btn-secondary" onclick="ipReset()">🔄 Reset</button>
    </div>
  </div>
  <div class="result-box" id="ipResult"></div>`;

window.EXTRA_TOOL_INITS['image-to-pdf'] = () => {
  document.getElementById('ipFiles').addEventListener('change', e => {
    const wrap = document.getElementById('ipPreview');
    wrap.innerHTML = '';
    Array.from(e.target.files).forEach((f, i) => {
      const url = URL.createObjectURL(f);
      const d = document.createElement('div');
      d.style.cssText = 'position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;border:1px solid var(--border)';
      d.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover" /><div style="position:absolute;top:2px;left:2px;background:rgba(0,0,0,0.7);color:#fff;font-size:10px;padding:2px 6px;border-radius:4px">${i+1}</div>`;
      wrap.appendChild(d);
    });
  });
  console.log('%c✅ Image to PDF loaded', 'color:#10b981');
};

window.ipGenerate = function() {
  const files = document.getElementById('ipFiles').files;
  if (!files.length) { toast('Select at least one image', 'error'); return; }
  const pageSize = document.getElementById('ipPageSize').value;
  const orientation = document.getElementById('ipOrientation').value;
  const margin = Number(document.getElementById('ipMargin').value) || 10;
  toast('Generating PDF...');
  const promises = Array.from(files).map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(f);
  }));
  Promise.all(promises).then(async images => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF(orientation, 'mm', pageSize);
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    for (let i = 0; i < images.length; i++) {
      if (i > 0) pdf.addPage();
      const img = await loadImgHelper(images[i]);
      const ratio = img.naturalWidth / img.naturalHeight;
      let w = pw - 2 * margin;
      let h = w / ratio;
      if (h > ph - 2 * margin) { h = ph - 2 * margin; w = h * ratio; }
      const x = (pw - w) / 2;
      const y = (ph - h) / 2;
      pdf.addImage(images[i], 'JPEG', x, y, w, h, undefined, 'FAST');
    }
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const box = document.getElementById('ipResult');
    box.innerHTML = `
      <div class="result-title">PDF Generated</div>
      <div class="result-main">${images.length} page${images.length > 1 ? 's' : ''}</div>
      <div class="result-sub">Size: ${(pdfBlob.size / 1024).toFixed(1)} KB</div>
      <div class="result-row"><span class="k">Page Size</span><span class="v">${pageSize.toUpperCase()} ${orientation === 'p' ? 'Portrait' : 'Landscape'}</span></div>
      <div class="result-row"><span class="k">Images</span><span class="v">${images.length}</span></div>
      <a class="btn btn-primary btn-block" href="${url}" download="images-${Date.now()}.pdf" style="margin-top:14px">⬇️ Download PDF</a>
      <div class="export-btns no-export no-print" style="margin-top:14px">
        <button class="btn btn-secondary" onclick="window.open('${url}','_blank')"><i>👁️</i>Preview</button>
        <button class="btn btn-secondary" onclick="extraPrint('ipResult','Image to PDF Result')"><i>🖨️</i>Print</button>
        <button class="btn btn-secondary" onclick="extraDownloadImage('ipResult','image-to-pdf-result')"><i>🖼️</i>Image</button>
      </div>`;
    box.classList.add('active');
    toast('PDF ready ✅', 'success');
  }).catch(e => { console.error(e); toast('PDF failed', 'error'); });
};

function loadImgHelper(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

window.ipReset = function() {
  document.getElementById('ipFiles').value = '';
  document.getElementById('ipPreview').innerHTML = '';
  document.getElementById('ipPageSize').value = 'a4';
  document.getElementById('ipOrientation').value = 'p';
  document.getElementById('ipMargin').value = 10;
  const box = document.getElementById('ipResult');
  box.classList.remove('active'); box.innerHTML = '';
  toast('Reset done', 'success');
};

console.log('%c✅ tools.js FINAL loaded — 5 tools ready with Ultra HD download', 'color:#10b981;font-weight:bold;font-size:14px');