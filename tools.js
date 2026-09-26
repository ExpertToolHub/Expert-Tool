
/* ============================================================
   QUNVERO — EXTRA TOOLS (tools.js)
   Version 1.0 — 7 New Tools
   ============================================================ */

console.log('%cQunvero Extra Tools Loading...', 'color:#10b981;font-weight:bold');

/* ============================================================
   TOOL CARDS — Ye 7 naye tools ke cards hain
   index.html me automatically add ho jayenge
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // Naye 7 tools ka data
  const EXTRA_TOOLS = [
    {
      id: 'ctc-salary',
      name: 'CTC → In-Hand Salary',
      cat: 'finance',
      icon: '💼',
      desc: 'Calculate your take-home salary from CTC',
      howto: 'Enter your annual CTC, choose monthly/annual mode, set Basic salary %, HRA, PF, professional tax and other deductions. Click Calculate to see your monthly in-hand salary with full breakdown.',
      kw: ['ctc', 'salary', 'in-hand', 'take home', 'monthly salary', 'annual salary', 'income', 'pf', 'tax']
    },
    {
      id: 'attendance-calc',
      name: 'Attendance Calculator',
      cat: 'student',
      icon: '📊',
      desc: 'Track attendance percentage & required classes',
      howto: 'Enter total working days/classes, present days, and required attendance percentage. Calculator shows current %, how many more classes you need to attend, and how many you can skip.',
      kw: ['attendance', 'percentage', 'classes', 'college', 'school', 'present', 'absent', 'bunk']
    },
    {
      id: 'qr-gen-pro',
      name: 'QR Code Generator Pro',
      cat: 'pdf',
      icon: '📱',
      desc: 'Generate QR for text, URL, phone, email, WiFi, vCard',
      howto: 'Choose type (Text/URL/Phone/Email/WiFi/vCard), enter details, click Generate. Download as PNG or SVG, or Print. QR generated is always unique — no duplicates.',
      kw: ['qr', 'qr code', 'generator', 'url', 'wifi', 'vcard', 'contact', 'scan']
    },
    {
      id: 'image-compressor',
      name: 'Image Compressor Pro',
      cat: 'photo',
      icon: '🗜️',
      desc: 'Compress & resize images without losing quality',
      howto: 'Upload image, adjust quality slider (10-100%), optionally resize width/height. Click Compress. Preview before/after, download compressed image. Original file is never modified.',
      kw: ['compress', 'image', 'photo', 'reduce', 'size', 'resize', 'optimize', 'jpg', 'png']
    },
    {
      id: 'image-to-pdf',
      name: 'Image to PDF Converter',
      cat: 'pdf',
      icon: '📄',
      desc: 'Convert multiple images into a single PDF',
      howto: 'Upload multiple images (JPG/PNG/WebP), reorder by dragging, remove unwanted. Choose page size (A4/A5/Letter), orientation, margin. Click Generate PDF. Download or Print.',
      kw: ['image', 'pdf', 'jpg', 'png', 'convert', 'merge', 'combine', 'photo', 'a4']
    },
    {
      id: 'pdf-merger',
      name: 'PDF Merger',
      cat: 'pdf',
      icon: '📚',
      desc: 'Combine multiple PDFs into one document',
      howto: 'Upload 2 or more PDF files, see page counts, reorder by dragging, remove if needed. Click Merge PDF. Download merged document. Pages preserved in order.',
      kw: ['pdf', 'merge', 'combine', 'join', 'multiple pdf', 'pdf merger']
    },
    {
      id: 'resume-builder',
      name: 'Resume Builder Pro',
      cat: 'student',
      icon: '📝',
      desc: 'Build professional ATS-friendly resume with live preview',
      howto: 'Fill personal info, education, experience, skills, projects. Add/remove entries as needed. Choose template & color. Live preview updates. Download as PDF (with selectable text) or Print. Save locally in browser.',
      kw: ['resume', 'cv', 'builder', 'ats', 'job', 'application', 'template', 'pdf resume']
    }
  ];

  /* ============================================================
     Tool Card HTML Generator — Existing design se match karta hai
     ============================================================ */
  function extraToolCardHTML(t) {
    const catMap = {
      'finance': { grad: 'linear-gradient(135deg,#22c55e,#10b981)', icon: t.icon },
      'student': { grad: 'linear-gradient(135deg,#8b5cf6,#6366f1)', icon: t.icon },
      'pdf':     { grad: 'linear-gradient(135deg,#ef4444,#f97316)', icon: t.icon },
      'photo':   { grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)', icon: t.icon }
    };
    const cat = catMap[t.cat] || { grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', icon: t.icon };
    const fav = (typeof isFavorite === 'function' && isFavorite(t.id)) ? 'active' : '';
    const star = fav === 'active' ? '★' : '☆';
    
    return `<div class="tool-card" data-extra-tool="${t.id}" onclick="openExtraTool('${t.id}')">
      <button class="fav-btn ${fav}" onclick="if(window.toggleExtraFav){toggleExtraFav('${t.id}', event)}else{toggleFavorite('${t.id}', event)}" title="Favorite">${star}</button>
      <div class="tool-icon" style="background:${cat.grad}">${t.icon}</div>
      <div class="tool-name">${t.name}</div>
      <div class="tool-desc">${t.desc}</div>
      <button class="tool-open-btn">Open Tool →</button>
    </div>`;
  }

  /* ============================================================
     Global access — index.html se use ho sake
     ============================================================ */
  window.EXTRA_TOOLS = EXTRA_TOOLS;
  window.extraToolCardHTML = extraToolCardHTML;

  /* ============================================================
     Auto-inject tools into existing grids
     ============================================================ */
  function injectExtraTools() {
    // 1. All Tools grid me add karo
    const allToolsGrid = document.getElementById('allTools');
    if (allToolsGrid) {
      const html = EXTRA_TOOLS.map(t => extraToolCardHTML(t)).join('');
      allToolsGrid.insertAdjacentHTML('beforeend', html);
      console.log('%c✅ 7 extra tools injected into All Tools grid', 'color:#10b981');
    }

    // 2. Popular Tools me bhi 2-3 add karo (agar chaho)
    const popularGrid = document.getElementById('popularTools');
    if (popularGrid) {
      // Sirf pehle 4 tools ko popular me add karo
      const popularExtras = EXTRA_TOOLS.slice(0, 4).map(t => extraToolCardHTML(t)).join('');
      popularGrid.insertAdjacentHTML('beforeend', popularExtras);
    }

    // 3. Update stats count
    const statTools = document.getElementById('statTools');
    if (statTools && statTools.dataset.count) {
      const oldCount = parseInt(statTools.dataset.count) || 38;
      statTools.dataset.count = String(oldCount + 7);
    }
  }

  // DOM ready hone ke baad inject karo
  setTimeout(injectExtraTools, 100);

  console.log('%c✅ Qunvero Extra Tools loaded (7 tools)', 'color:#10b981;font-weight:bold;font-size:14px');
});
/* ============================================================
   EXTRA TOOLS — CARD CLICK & RENDERER SYSTEM
   ============================================================ */

// Tool renderer function map
window.EXTRA_TOOL_RENDERERS = {};
window.EXTRA_TOOL_INITS = {};

// Tool kholne ka main function
window.openExtraTool = function(toolId) {
  const tool = (window.EXTRA_TOOLS || []).find(t => t.id === toolId);
  if (!tool) { toast('Tool not found', 'error'); return; }
  
  const catMap = {
    'finance': 'linear-gradient(135deg,#22c55e,#10b981)',
    'student': 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    'pdf':     'linear-gradient(135deg,#ef4444,#f97316)',
    'photo':   'linear-gradient(135deg,#ec4899,#8b5cf6)'
  };
  const grad = catMap[tool.cat] || 'var(--gradient)';
  
  document.getElementById('toolTitle').textContent = tool.icon + ' ' + tool.name;
  document.getElementById('toolDesc').textContent = tool.desc;
  document.title = tool.name + ' — Qunvero';
  
  // Fav button
  const favBtn = document.getElementById('toolFavBtn');
  if (favBtn) {
    favBtn.dataset.tool = toolId;
    const isFav = (typeof isFavorite === 'function' && isFavorite(toolId));
    favBtn.textContent = isFav ? '★' : '☆';
    favBtn.classList.toggle('active', isFav);
    favBtn.onclick = (e) => { if (typeof toggleFavorite === 'function') toggleFavorite(toolId, e); };
  }
  
  // How-to
  const howto = document.getElementById('toolHowTo');
  if (howto && tool.howto) {
    howto.style.display = 'block';
    howto.innerHTML = '<strong>📖 How to use:</strong> ' + tool.howto;
  }
  
  // Render tool body
  const body = document.getElementById('toolBody');
  const renderer = window.EXTRA_TOOL_RENDERERS[toolId];
  if (!renderer) {
    body.innerHTML = '<div class="card">Tool loading...</div>';
  } else {
    body.innerHTML = renderer();
    setTimeout(() => {
      if (window.EXTRA_TOOL_INITS[toolId]) window.EXTRA_TOOL_INITS[toolId]();
    }, 50);
  }
  
  // Add to recently used
  if (typeof addRecent === 'function') addRecent(toolId);
  
  // Switch view
  if (typeof switchView === 'function') switchView('toolView');
};

/* ============================================================
   TOOL 1: CTC → IN-HAND SALARY CALCULATOR
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['ctc-salary'] = () => `
  <div class="card">
    <div class="card-title">Salary Details</div>
    <div class="field">
      <label>Annual CTC (₹)</label>
      <input type="number" id="ctcAmount" min="0" step="1000" placeholder="600000" value="600000" />
    </div>
    <div class="field">
      <label>Mode</label>
      <select id="ctcMode">
        <option value="monthly">Monthly Breakdown</option>
        <option value="annual" selected>Annual Breakdown</option>
      </select>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Basic Salary (% of CTC)</label>
        <input type="number" id="ctcBasicPct" min="0" max="100" step="0.5" value="40" />
      </div>
      <div class="field">
        <label>HRA (% of Basic)</label>
        <input type="number" id="ctcHraPct" min="0" max="100" step="0.5" value="50" />
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Deductions</div>
    <div class="field-row">
      <div class="field">
        <label>Employee PF (% of Basic)</label>
        <input type="number" id="ctcPfPct" min="0" max="100" step="0.5" value="12" />
      </div>
      <div class="field">
        <label>Professional Tax (₹/year)</label>
        <input type="number" id="ctcProfTax" min="0" step="100" value="2400" />
      </div>
    </div>
    <div class="field">
      <label>Other Deductions (₹/year)</label>
      <input type="number" id="ctcOtherDed" min="0" step="100" value="0" />
    </div>
    <div class="field">
      <label>Estimated Income Tax (₹/year)</label>
      <input type="number" id="ctcTax" min="0" step="1000" value="0" />
      <div class="hint">Ye user estimate hai. Actual tax apne CA se check karo.</div>
    </div>
  </div>

  <div class="btn-group" style="margin-bottom:14px">
    <button class="btn btn-primary" onclick="ctcCalculate()">💰 Calculate</button>
    <button class="btn btn-secondary" onclick="ctcReset()">🔄 Reset</button>
  </div>

  <div class="result-box" id="ctcResult"></div>
`;

window.EXTRA_TOOL_INITS['ctc-salary'] = () => {
  console.log('%c✅ CTC Salary Calculator loaded', 'color:#10b981');
};

window.ctcCalculate = function() {
  const ctc = Number(document.getElementById('ctcAmount').value) || 0;
  const basicPct = Number(document.getElementById('ctcBasicPct').value) || 40;
  const hraPct = Number(document.getElementById('ctcHraPct').value) || 50;
  const pfPct = Number(document.getElementById('ctcPfPct').value) || 12;
  const profTax = Number(document.getElementById('ctcProfTax').value) || 0;
  const otherDed = Number(document.getElementById('ctcOtherDed').value) || 0;
  const tax = Number(document.getElementById('ctcTax').value) || 0;

  if (ctc <= 0) { toast('Enter valid CTC', 'error'); return; }

  // Calculate
  const basic = ctc * basicPct / 100;
  const hra = basic * hraPct / 100;
  const employerPF = basic * 12 / 100; // Standard 12%
  const employeePF = basic * pfPct / 100;
  const specialAllowance = ctc - basic - hra - employerPF;
  
  // Gross = CTC - employer PF (since employer PF is part of CTC but not part of gross salary)
  const grossSalary = basic + hra + specialAllowance;
  
  // Total deductions from gross
  const totalDeductions = employeePF + profTax + otherDed + tax;
  const annualInHand = grossSalary - totalDeductions;
  const monthlyInHand = annualInHand / 12;
  const monthlyGross = grossSalary / 12;
  const dedPct = grossSalary > 0 ? (totalDeductions / grossSalary * 100) : 0;

  const fmt = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtN = (n) => (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const box = document.getElementById('ctcResult');
  box.innerHTML = `
    <div class="result-title">Salary Breakdown</div>
    <div class="result-main">${fmt(monthlyInHand)}</div>
    <div class="result-sub">Monthly In-Hand Salary</div>

    <div style="margin-top:20px">
      <div class="result-row"><span class="k">Annual CTC</span><span class="v">${fmt(ctc)}</span></div>
      <div class="result-row"><span class="k">Basic Salary (${basicPct}%)</span><span class="v">${fmt(basic)}</span></div>
      <div class="result-row"><span class="k">HRA (${hraPct}% of Basic)</span><span class="v">${fmt(hra)}</span></div>
      <div class="result-row"><span class="k">Special Allowance</span><span class="v">${fmt(specialAllowance)}</span></div>
      <div class="result-row"><span class="k">Employer PF (part of CTC)</span><span class="v">${fmt(employerPF)}</span></div>
      <div class="result-row" style="background:var(--surface-2);padding:10px 8px;margin-top:8px;border-radius:8px"><span class="k" style="font-weight:700">Annual Gross Salary</span><span class="v">${fmt(grossSalary)}</span></div>
    </div>

    <div style="margin-top:20px">
      <div class="card-title" style="margin-bottom:10px">Deductions (Annual)</div>
      <div class="result-row"><span class="k">Employee PF (${pfPct}%)</span><span class="v txn-credit">− ${fmt(employeePF)}</span></div>
      <div class="result-row"><span class="k">Professional Tax</span><span class="v txn-credit">− ${fmt(profTax)}</span></div>
      <div class="result-row"><span class="k">Other Deductions</span><span class="v txn-credit">− ${fmt(otherDed)}</span></div>
      <div class="result-row"><span class="k">Estimated Income Tax</span><span class="v txn-credit">− ${fmt(tax)}</span></div>
      <div class="result-row" style="background:var(--surface-2);padding:10px 8px;margin-top:8px;border-radius:8px"><span class="k" style="font-weight:700">Total Deductions</span><span class="v">${fmt(totalDeductions)} (${dedPct.toFixed(1)}%)</span></div>
    </div>

    <div style="margin-top:20px">
      <div class="card-title" style="margin-bottom:10px">In-Hand Summary</div>
      <div class="result-row"><span class="k">Monthly Gross</span><span class="v">${fmt(monthlyGross)}</span></div>
      <div class="result-row"><span class="k">Monthly Deductions</span><span class="v txn-credit">− ${fmt(totalDeductions / 12)}</span></div>
      <div class="result-row"><span class="k" style="font-weight:700">Monthly In-Hand</span><span class="v" style="color:var(--success)">${fmt(monthlyInHand)}</span></div>
      <div class="result-row"><span class="k" style="font-weight:700">Annual In-Hand</span><span class="v" style="color:var(--success)">${fmt(annualInHand)}</span></div>
    </div>

    <div class="how-to-use" style="margin-top:16px;font-size:12px">
      ⚠️ <strong>Disclaimer:</strong> Ye estimate hai. Actual salary, PF, tax structure company ke policy ke hisaab se alag ho sakta hai. Official calculation ke liye apne HR ya CA se check karo.
    </div>

    <div class="btn-group" style="margin-top:14px">
      <button class="btn btn-secondary btn-sm" onclick="ctcCopy()">📋 Copy</button>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print</button>
      <button class="btn btn-secondary btn-sm" onclick="ctcShare()">📤 Share</button>
    </div>
  `;
  box.classList.add('active');
  
  // Save for copy/share
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
  box.classList.remove('active');
  box.innerHTML = '';
  toast('Reset done', 'success');
};

window.ctcCopy = function() {
  if (!window._ctcSummary) return;
  navigator.clipboard.writeText(window._ctcSummary)
    .then(() => toast('Copied!', 'success'))
    .catch(() => toast('Copy failed', 'error'));
};

window.ctcShare = function() {
  if (!window._ctcSummary) return;
  if (navigator.share) {
    navigator.share({ title: 'CTC Salary Calculator', text: window._ctcSummary })
      .catch(() => {});
  } else {
    window.ctcCopy();
  }
};

/* ============================================================
   TOOL 2: ATTENDANCE CALCULATOR
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['attendance-calc'] = () => `
  <div class="card">
    <div class="card-title">Attendance Details</div>
    <div class="field">
      <label>Total Classes / Working Days</label>
      <input type="number" id="attTotal" min="1" step="1" placeholder="100" />
    </div>
    <div class="field">
      <label>Present Classes / Days</label>
      <input type="number" id="attPresent" min="0" step="1" placeholder="75" />
    </div>
    <div class="field">
      <label>Required Attendance (%)</label>
      <input type="number" id="attRequired" min="0" max="100" step="0.1" value="75" />
    </div>
    <div class="field">
      <label>Mode</label>
      <select id="attMode">
        <option value="college" selected>College / Semester</option>
        <option value="school">School / Monthly</option>
      </select>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="attCalculate()">📊 Calculate</button>
      <button class="btn btn-secondary" onclick="attReset()">🔄 Reset</button>
    </div>
  </div>
  <div class="result-box" id="attResult"></div>
`;

window.EXTRA_TOOL_INITS['attendance-calc'] = () => {
  console.log('%c✅ Attendance Calculator loaded', 'color:#10b981');
};

window.attCalculate = function() {
  const total = Number(document.getElementById('attTotal').value) || 0;
  const present = Number(document.getElementById('attPresent').value) || 0;
  const required = Number(document.getElementById('attRequired').value) || 75;

  if (total <= 0) { toast('Enter valid total classes', 'error'); return; }
  if (present < 0 || present > total) { toast('Present must be between 0 and total', 'error'); return; }
  if (required <= 0 || required > 100) { toast('Required % must be 0-100', 'error'); return; }

  const absent = total - present;
  const currentPct = (present / total) * 100;
  const presentPct = currentPct;
  const absentPct = (absent / total) * 100;

  // Required attendance calculation
  // (present + x) / (total + x) >= required/100
  // Solve for x (x = additional classes to attend)
  let neededClasses = 0;
  let canSkip = 0;
  let status = '';
  let statusColor = '';

  if (currentPct >= required) {
    status = 'Safe';
    statusColor = 'var(--success)';
    // How many can skip while maintaining required?
    // (present) / (total + y) >= required/100
    // y <= (present * 100 / required) - total
    canSkip = Math.floor((present * 100 / required) - total);
    if (canSkip < 0) canSkip = 0;
    neededClasses = 0;
  } else {
    status = 'Low Attendance';
    statusColor = 'var(--danger)';
    // (present + x) / (total + x) >= required/100
    // x >= (required*total/100 - present) / (1 - required/100)
    const reqFrac = required / 100;
    neededClasses = Math.ceil((reqFrac * total - present) / (1 - reqFrac));
    if (neededClasses < 0) neededClasses = 0;
    canSkip = 0;
  }

  const fmt = (n) => (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const box = document.getElementById('attResult');
  box.innerHTML = `
    <div class="result-title">Attendance Result</div>
    <div class="result-main" style="color:${statusColor};-webkit-text-fill-color:${statusColor}">${currentPct.toFixed(2)}%</div>
    <div class="result-sub">Current Attendance — <strong style="color:${statusColor}">${status}</strong></div>

    <div class="result-row"><span class="k">Total Classes</span><span class="v">${total}</span></div>
    <div class="result-row"><span class="k">Present</span><span class="v" style="color:var(--success)">${present}</span></div>
    <div class="result-row"><span class="k">Absent</span><span class="v" style="color:var(--danger)">${absent}</span></div>
    <div class="result-row"><span class="k">Present %</span><span class="v">${presentPct.toFixed(2)}%</span></div>
    <div class="result-row"><span class="k">Absent %</span><span class="v">${absentPct.toFixed(2)}%</span></div>
    <div class="result-row"><span class="k">Required %</span><span class="v">${required}%</span></div>

    <div style="margin-top:16px;padding:14px;background:var(--surface-2);border-radius:12px">
      ${currentPct >= required 
        ? `<div style="font-size:14px"><strong>✅ You are safe!</strong></div>
           <div style="font-size:13px;margin-top:6px">You can skip <strong style="color:var(--success);font-size:18px">${canSkip}</strong> more classes and still maintain ${required}%</div>`
        : `<div style="font-size:14px"><strong>⚠️ Attendance Low!</strong></div>
           <div style="font-size:13px;margin-top:6px">You need to attend <strong style="color:var(--danger);font-size:18px">${neededClasses}</strong> more classes to reach ${required}%</div>`
      }
    </div>

    <div class="btn-group" style="margin-top:14px">
      <button class="btn btn-secondary btn-sm" onclick="attCopy()">📋 Copy</button>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print</button>
      <button class="btn btn-secondary btn-sm" onclick="attShare()">📤 Share</button>
    </div>
  `;
  box.classList.add('active');

  window._attSummary = `Attendance Report\n\nTotal: ${total}\nPresent: ${present}\nAbsent: ${absent}\nCurrent: ${currentPct.toFixed(2)}%\nRequired: ${required}%\nStatus: ${status}\n${currentPct >= required ? 'Can skip: ' + canSkip + ' classes' : 'Need to attend: ' + neededClasses + ' more classes'}`;
};

window.attReset = function() {
  document.getElementById('attTotal').value = '';
  document.getElementById('attPresent').value = '';
  document.getElementById('attRequired').value = 75;
  const box = document.getElementById('attResult');
  box.classList.remove('active');
  box.innerHTML = '';
  toast('Reset done', 'success');
};

window.attCopy = function() {
  if (!window._attSummary) return;
  navigator.clipboard.writeText(window._attSummary)
    .then(() => toast('Copied!', 'success'))
    .catch(() => toast('Copy failed', 'error'));
};

window.attShare = function() {
  if (!window._attSummary) return;
  if (navigator.share) {
    navigator.share({ title: 'Attendance Report', text: window._attSummary })
      .catch(() => {});
  } else {
    window.attCopy();
  }
};

console.log('%c✅ Message 2 loaded — CTC + Attendance tools active', 'color:#10b981;font-weight:bold;font-size:14px');