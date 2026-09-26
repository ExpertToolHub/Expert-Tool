
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