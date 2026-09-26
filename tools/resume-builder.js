/* ============================================================
   QUNVERO — RESUME BUILDER (Separate File)
   Part A: Form + 13 Sections + Basic Structure
   ============================================================ */

console.log('%c📝 Resume Builder Loading...', 'color:#8b5cf6;font-weight:bold');

window.EXTRA_TOOL_RENDERERS = window.EXTRA_TOOL_RENDERERS || {};
window.EXTRA_TOOL_INITS = window.EXTRA_TOOL_INITS || {};

/* ============================================================
   HTML ESCAPE HELPER
   ============================================================ */
function rbEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ============================================================
   RENDERER
   ============================================================ */
window.EXTRA_TOOL_RENDERERS['resume-builder'] = () => `
  <div class="card">
    <div class="card-title">1. Personal Information</div>
    <div class="field-row">
      <div class="field"><label>Full Name *</label><input type="text" id="rbName" placeholder="Rahul Kumar" /></div>
      <div class="field"><label>Job Title</label><input type="text" id="rbJob" placeholder="Software Engineer" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Email</label><input type="email" id="rbEmail" placeholder="rahul@example.com" /></div>
      <div class="field"><label>Phone</label><input type="tel" id="rbPhone" placeholder="+91 9876543210" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>City, State</label><input type="text" id="rbLocation" placeholder="Mumbai, Maharashtra" /></div>
      <div class="field"><label>Country</label><input type="text" id="rbCountry" placeholder="India" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>LinkedIn URL</label><input type="text" id="rbLinkedin" placeholder="linkedin.com/in/rahul" /></div>
      <div class="field"><label>Portfolio / Website</label><input type="text" id="rbPortfolio" placeholder="rahul.dev" /></div>
    </div>
    <div class="field"><label>GitHub URL</label><input type="text" id="rbGithub" placeholder="github.com/rahul" /></div>
  </div>

  <div class="card">
    <div class="card-title">2. Professional Summary</div>
    <div class="field">
      <label>Career Objective / Summary</label>
      <textarea id="rbSummary" placeholder="Passionate software engineer with 3+ years of experience in building scalable web applications..." rows="4" maxlength="800" oninput="rbCountChar('rbSummary','rbSummaryCount',800)"></textarea>
      <div class="hint"><span id="rbSummaryCount">0</span> / 800 characters</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">3. Work Experience</div>
    <div id="rbExpList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddExp()">+ Add Experience</button>
  </div>

  <div class="card">
    <div class="card-title">4. Education</div>
    <div id="rbEduList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddEdu()">+ Add Education</button>
  </div>

  <div class="card">
    <div class="card-title">5. Skills</div>
    <div class="field"><label>Technical Skills (comma separated)</label><input type="text" id="rbSkills" placeholder="JavaScript, React, Node.js, MongoDB" /></div>
    <div class="field"><label>Soft Skills (comma separated)</label><input type="text" id="rbSoftSkills" placeholder="Communication, Leadership, Team Work" /></div>
    <div class="field"><label>Languages (comma separated)</label><input type="text" id="rbLangSkills" placeholder="English, Hindi, Marathi" /></div>
  </div>

  <div class="card">
    <div class="card-title">6. Projects</div>
    <div id="rbProjList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddProj()">+ Add Project</button>
  </div>

  <div class="card">
    <div class="card-title">7. Certifications</div>
    <div id="rbCertList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddCert()">+ Add Certification</button>
  </div>

  <div class="card">
    <div class="card-title">8. Internships</div>
    <div id="rbInternList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddIntern()">+ Add Internship</button>
  </div>

  <div class="card">
    <div class="card-title">9. Achievements & Awards</div>
    <div id="rbAchList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddAch()">+ Add Achievement</button>
  </div>

  <div class="card">
    <div class="card-title">10. Languages</div>
    <div id="rbLangList"></div>
    <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddLang()">+ Add Language</button>
  </div>

  <div class="card">
    <div class="card-title">11. Interests & Hobbies</div>
    <div class="field"><label>Interests (comma separated)</label><input type="text" id="rbInterests" placeholder="Reading, Traveling, Photography" /></div>
  </div>

  <div class="card">
    <div class="card-title">12. References (Optional)</div>
    <div class="field"><label><input type="checkbox" id="rbShowRef" style="width:auto;margin-right:6px" onchange="document.getElementById('rbRefWrap').style.display=this.checked?'block':'none'" /> Show references in resume</label></div>
    <div id="rbRefWrap" style="display:none">
      <div id="rbRefList"></div>
      <button class="btn btn-secondary btn-sm mt-8" onclick="rbAddRef()">+ Add Reference</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">13. Custom Section (Optional)</div>
    <div class="field"><label>Section Title</label><input type="text" id="rbCustomTitle" placeholder="Volunteer Work" /></div>
    <div class="field"><label>Content</label><textarea id="rbCustomContent" placeholder="Details..." rows="3"></textarea></div>
  </div>

  <div class="card">
    <div class="card-title">🎨 Resume Template</div>
    <div class="chips-wrap">
      <div class="chip active" data-tpl="modern" onclick="rbSetTemplate('modern', this)">Modern</div>
      <div class="chip" data-tpl="classic" onclick="rbSetTemplate('classic', this)">Classic</div>
      <div class="chip" data-tpl="minimal" onclick="rbSetTemplate('minimal', this)">Minimal</div>
      <div class="chip" data-tpl="corporate" onclick="rbSetTemplate('corporate', this)">Corporate</div>
    </div>
  </div>

  <div class="btn-group" style="margin-bottom:14px">
    <button class="btn btn-primary" onclick="rbPreview()" style="flex:2">👁️ Generate Preview</button>
    <button class="btn btn-secondary" onclick="rbReset()" style="flex:1">🔄 Reset</button>
  </div>

  <div class="card">
    <div class="card-title">💾 Saved Resume</div>
    <div class="btn-group">
      <button class="btn btn-secondary btn-sm" onclick="rbSaveLocal()">💾 Save</button>
      <button class="btn btn-secondary btn-sm" onclick="rbLoadLocal()">📂 Load</button>
      <button class="btn btn-secondary btn-sm" onclick="rbClearLocal()">🗑️ Clear</button>
    </div>
    <div class="hint">Resume browser me auto-save hoti hai — bar-bar form bharne ki zaroorat nahi</div>
  </div>

  <div class="result-box" id="rbResult"></div>
`;

/* ============================================================
   INIT
   ============================================================ */
window.EXTRA_TOOL_INITS['resume-builder'] = () => {
  window._rbTemplate = 'modern';
  window._rbExp = window._rbExp || [];
  window._rbEdu = window._rbEdu || [];
  window._rbProj = window._rbProj || [];
  window._rbCert = window._rbCert || [];
  window._rbIntern = window._rbIntern || [];
  window._rbAch = window._rbAch || [];
  window._rbLang = window._rbLang || [];
  window._rbRef = window._rbRef || [];

  rbRenderExp();
  rbRenderEdu();
  rbRenderProj();
  rbRenderCert();
  rbRenderIntern();
  rbRenderAch();
  rbRenderLang();
  rbRenderRef();

  setTimeout(() => rbLoadLocal(true), 300);

  console.log('%c✅ Resume Builder initialized', 'color:#10b981');
};

/* ============================================================
   TEMPLATE SETTER
   ============================================================ */
window.rbSetTemplate = function(tpl, el) {
  window._rbTemplate = tpl;
  document.querySelectorAll('#toolBody .chip[data-tpl]').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  if (typeof toast === 'function') toast('Template: ' + tpl.charAt(0).toUpperCase() + tpl.slice(1));
};

/* ============================================================
   CHARACTER COUNTER
   ============================================================ */
window.rbCountChar = function(inputId, countId, max) {
  const el = document.getElementById(inputId);
  const c = document.getElementById(countId);
  if (el && c) c.textContent = el.value.length;
};

/* ============================================================
   EXPERIENCE
   ============================================================ */
window.rbAddExp = function() {
  window._rbExp.push({ title:'', company:'', duration:'', location:'', desc:'' });
  rbRenderExp();
};
window.rbRemoveExp = function(i) { window._rbExp.splice(i, 1); rbRenderExp(); };
window.rbMoveExp = function(i, dir) {
  const t = i + dir;
  if (t < 0 || t >= window._rbExp.length) return;
  const tmp = window._rbExp[i];
  window._rbExp[i] = window._rbExp[t];
  window._rbExp[t] = tmp;
  rbRenderExp();
};
window.rbRenderExp = function() {
  const wrap = document.getElementById('rbExpList');
  if (!wrap) return;
  if (window._rbExp.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No experience added yet. Fresher ho to skip karo.</div>';
    return;
  }
  wrap.innerHTML = window._rbExp.map((e, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px">
        <strong style="font-size:13px">Experience #${i+1}</strong>
        <div style="display:flex;gap:4px">
          <button onclick="rbMoveExp(${i},-1)" style="width:28px;height:28px;border-radius:8px;background:var(--surface);font-size:13px">↑</button>
          <button onclick="rbMoveExp(${i},1)" style="width:28px;height:28px;border-radius:8px;background:var(--surface);font-size:13px">↓</button>
          <button onclick="rbRemoveExp(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
        </div>
      </div>
      <div class="field-row">
        <input type="text" placeholder="Job Title" value="${rbEsc(e.title)}" oninput="window._rbExp[${i}].title=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Company Name" value="${rbEsc(e.company)}" oninput="window._rbExp[${i}].company=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <div class="field-row">
        <input type="text" placeholder="Duration (Jan 2020 – Dec 2022)" value="${rbEsc(e.duration)}" oninput="window._rbExp[${i}].duration=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Location" value="${rbEsc(e.location)}" oninput="window._rbExp[${i}].location=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <textarea placeholder="Responsibilities & achievements (one per line)" rows="3" oninput="window._rbExp[${i}].desc=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;font-family:inherit;resize:vertical">${rbEsc(e.desc)}</textarea>
    </div>
  `).join('');
};

/* ============================================================
   EDUCATION
   ============================================================ */
window.rbAddEdu = function() {
  window._rbEdu.push({ degree:'', school:'', field:'', duration:'', score:'' });
  rbRenderEdu();
};
window.rbRemoveEdu = function(i) { window._rbEdu.splice(i, 1); rbRenderEdu(); };
window.rbMoveEdu = function(i, dir) {
  const t = i + dir;
  if (t < 0 || t >= window._rbEdu.length) return;
  const tmp = window._rbEdu[i];
  window._rbEdu[i] = window._rbEdu[t];
  window._rbEdu[t] = tmp;
  rbRenderEdu();
};
window.rbRenderEdu = function() {
  const wrap = document.getElementById('rbEduList');
  if (!wrap) return;
  if (window._rbEdu.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No education added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbEdu.map((e, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px">
        <strong style="font-size:13px">Education #${i+1}</strong>
        <div style="display:flex;gap:4px">
          <button onclick="rbMoveEdu(${i},-1)" style="width:28px;height:28px;border-radius:8px;background:var(--surface);font-size:13px">↑</button>
          <button onclick="rbMoveEdu(${i},1)" style="width:28px;height:28px;border-radius:8px;background:var(--surface);font-size:13px">↓</button>
          <button onclick="rbRemoveEdu(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
        </div>
      </div>
      <input type="text" placeholder="Degree (e.g. B.Tech Computer Science)" value="${rbEsc(e.degree)}" oninput="window._rbEdu[${i}].degree=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      <div class="field-row">
        <input type="text" placeholder="School / University" value="${rbEsc(e.school)}" oninput="window._rbEdu[${i}].school=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Field of Study" value="${rbEsc(e.field)}" oninput="window._rbEdu[${i}].field=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <div class="field-row">
        <input type="text" placeholder="Year (2020 – 2024)" value="${rbEsc(e.duration)}" oninput="window._rbEdu[${i}].duration=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="CGPA / Percentage" value="${rbEsc(e.score)}" oninput="window._rbEdu[${i}].score=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
    </div>
  `).join('');
};

/* ============================================================
   PROJECTS
   ============================================================ */
window.rbAddProj = function() {
  window._rbProj.push({ name:'', desc:'', tech:'', link:'' });
  rbRenderProj();
};
window.rbRemoveProj = function(i) { window._rbProj.splice(i, 1); rbRenderProj(); };
window.rbMoveProj = function(i, dir) {
  const t = i + dir;
  if (t < 0 || t >= window._rbProj.length) return;
  const tmp = window._rbProj[i];
  window._rbProj[i] = window._rbProj[t];
  window._rbProj[t] = tmp;
  rbRenderProj();
};
window.rbRenderProj = function() {
  const wrap = document.getElementById('rbProjList');
  if (!wrap) return;
  if (window._rbProj.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No projects added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbProj.map((p, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px">
        <strong style="font-size:13px">Project #${i+1}</strong>
        <div style="display:flex;gap:4px">
          <button onclick="rbMoveProj(${i},-1)" style="width:28px;height:28px;border-radius:8px;background:var(--surface);font-size:13px">↑</button>
          <button onclick="rbMoveProj(${i},1)" style="width:28px;height:28px;border-radius:8px;background:var(--surface);font-size:13px">↓</button>
          <button onclick="rbRemoveProj(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
        </div>
      </div>
      <input type="text" placeholder="Project Name" value="${rbEsc(p.name)}" oninput="window._rbProj[${i}].name=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      <input type="text" placeholder="Technologies (React, Node, MongoDB)" value="${rbEsc(p.tech)}" oninput="window._rbProj[${i}].tech=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      <input type="text" placeholder="Link (GitHub / Live)" value="${rbEsc(p.link)}" oninput="window._rbProj[${i}].link=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      <textarea placeholder="Description" rows="2" oninput="window._rbProj[${i}].desc=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;font-family:inherit;resize:vertical">${rbEsc(p.desc)}</textarea>
    </div>
  `).join('');
};

/* ============================================================
   CERTIFICATIONS
   ============================================================ */
window.rbAddCert = function() {
  window._rbCert.push({ name:'', org:'', date:'', id:'' });
  rbRenderCert();
};
window.rbRemoveCert = function(i) { window._rbCert.splice(i, 1); rbRenderCert(); };
window.rbRenderCert = function() {
  const wrap = document.getElementById('rbCertList');
  if (!wrap) return;
  if (window._rbCert.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No certifications added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbCert.map((c, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong style="font-size:13px">Certificate #${i+1}</strong>
        <button onclick="rbRemoveCert(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
      </div>
      <div class="field-row">
        <input type="text" placeholder="Certificate Name" value="${rbEsc(c.name)}" oninput="window._rbCert[${i}].name=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Organization" value="${rbEsc(c.org)}" oninput="window._rbCert[${i}].org=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <div class="field-row">
        <input type="text" placeholder="Issue Date" value="${rbEsc(c.date)}" oninput="window._rbCert[${i}].date=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Certificate ID" value="${rbEsc(c.id)}" oninput="window._rbCert[${i}].id=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
    </div>
  `).join('');
};

/* ============================================================
   INTERNSHIPS
   ============================================================ */
window.rbAddIntern = function() {
  window._rbIntern.push({ company:'', role:'', duration:'', desc:'' });
  rbRenderIntern();
};
window.rbRemoveIntern = function(i) { window._rbIntern.splice(i, 1); rbRenderIntern(); };
window.rbRenderIntern = function() {
  const wrap = document.getElementById('rbInternList');
  if (!wrap) return;
  if (window._rbIntern.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No internships added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbIntern.map((it, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong style="font-size:13px">Internship #${i+1}</strong>
        <button onclick="rbRemoveIntern(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
      </div>
      <div class="field-row">
        <input type="text" placeholder="Role" value="${rbEsc(it.role)}" oninput="window._rbIntern[${i}].role=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Company" value="${rbEsc(it.company)}" oninput="window._rbIntern[${i}].company=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <input type="text" placeholder="Duration (Jun 2023 – Aug 2023)" value="${rbEsc(it.duration)}" oninput="window._rbIntern[${i}].duration=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      <textarea placeholder="Description" rows="2" oninput="window._rbIntern[${i}].desc=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;font-family:inherit;resize:vertical">${rbEsc(it.desc)}</textarea>
    </div>
  `).join('');
};

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
window.rbAddAch = function() {
  window._rbAch.push({ title:'', org:'', date:'' });
  rbRenderAch();
};
window.rbRemoveAch = function(i) { window._rbAch.splice(i, 1); rbRenderAch(); };
window.rbRenderAch = function() {
  const wrap = document.getElementById('rbAchList');
  if (!wrap) return;
  if (window._rbAch.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No achievements added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbAch.map((a, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong style="font-size:13px">Achievement #${i+1}</strong>
        <button onclick="rbRemoveAch(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
      </div>
      <div class="field-row">
        <input type="text" placeholder="Award Title" value="${rbEsc(a.title)}" oninput="window._rbAch[${i}].title=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Organization" value="${rbEsc(a.org)}" oninput="window._rbAch[${i}].org=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <input type="text" placeholder="Date" value="${rbEsc(a.date)}" oninput="window._rbAch[${i}].date=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none" />
    </div>
  `).join('');
};

/* ============================================================
   LANGUAGES
   ============================================================ */
window.rbAddLang = function() {
  window._rbLang.push({ name:'', level:'Fluent' });
  rbRenderLang();
};
window.rbRemoveLang = function(i) { window._rbLang.splice(i, 1); rbRenderLang(); };
window.rbRenderLang = function() {
  const wrap = document.getElementById('rbLangList');
  if (!wrap) return;
  if (window._rbLang.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No languages added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbLang.map((l, i) => `
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px">
      <input type="text" placeholder="Language" value="${rbEsc(l.name)}" oninput="window._rbLang[${i}].name=this.value" style="flex:2;padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;color:var(--text);outline:none" />
      <select onchange="window._rbLang[${i}].level=this.value" style="flex:1;padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;color:var(--text);outline:none">
        <option ${l.level==='Basic'?'selected':''}>Basic</option>
        <option ${l.level==='Intermediate'?'selected':''}>Intermediate</option>
        <option ${l.level==='Fluent'?'selected':''}>Fluent</option>
        <option ${l.level==='Native'?'selected':''}>Native</option>
      </select>
      <button onclick="rbRemoveLang(${i})" style="width:32px;height:32px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:14px">✕</button>
    </div>
  `).join('');
};

/* ============================================================
   REFERENCES
   ============================================================ */
window.rbAddRef = function() {
  window._rbRef.push({ name:'', role:'', company:'', contact:'' });
  rbRenderRef();
};
window.rbRemoveRef = function(i) { window._rbRef.splice(i, 1); rbRenderRef(); };
window.rbRenderRef = function() {
  const wrap = document.getElementById('rbRefList');
  if (!wrap) return;
  if (window._rbRef.length === 0) {
    wrap.innerHTML = '<div class="hint" style="padding:8px 0">No references added yet.</div>';
    return;
  }
  wrap.innerHTML = window._rbRef.map((r, i) => `
    <div style="padding:12px;background:var(--surface-2);border-radius:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong style="font-size:13px">Reference #${i+1}</strong>
        <button onclick="rbRemoveRef(${i})" style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,0.15);color:var(--danger);font-size:13px">✕</button>
      </div>
      <div class="field-row">
        <input type="text" placeholder="Name" value="${rbEsc(r.name)}" oninput="window._rbRef[${i}].name=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Designation" value="${rbEsc(r.role)}" oninput="window._rbRef[${i}].role=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
      <div class="field-row">
        <input type="text" placeholder="Company" value="${rbEsc(r.company)}" oninput="window._rbRef[${i}].company=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
        <input type="text" placeholder="Contact / Email" value="${rbEsc(r.contact)}" oninput="window._rbRef[${i}].contact=this.value" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border-strong);border-radius:10px;font-size:13.5px;width:100%;color:var(--text);outline:none;margin-bottom:6px" />
      </div>
    </div>
  `).join('');
};

console.log('%c✅ Resume Builder Part A loaded — 13 sections ready', 'color:#8b5cf6;font-weight:bold');
/* ============================================================
   PART B: RESUME DATA COLLECTOR
   ============================================================ */
window.rbGetData = function() {
  return {
    name: document.getElementById('rbName') ? document.getElementById('rbName').value.trim() : '',
    job: document.getElementById('rbJob') ? document.getElementById('rbJob').value.trim() : '',
    email: document.getElementById('rbEmail') ? document.getElementById('rbEmail').value.trim() : '',
    phone: document.getElementById('rbPhone') ? document.getElementById('rbPhone').value.trim() : '',
    location: document.getElementById('rbLocation') ? document.getElementById('rbLocation').value.trim() : '',
    country: document.getElementById('rbCountry') ? document.getElementById('rbCountry').value.trim() : '',
    linkedin: document.getElementById('rbLinkedin') ? document.getElementById('rbLinkedin').value.trim() : '',
    portfolio: document.getElementById('rbPortfolio') ? document.getElementById('rbPortfolio').value.trim() : '',
    github: document.getElementById('rbGithub') ? document.getElementById('rbGithub').value.trim() : '',
    summary: document.getElementById('rbSummary') ? document.getElementById('rbSummary').value.trim() : '',
    skills: document.getElementById('rbSkills') ? document.getElementById('rbSkills').value.trim() : '',
    softSkills: document.getElementById('rbSoftSkills') ? document.getElementById('rbSoftSkills').value.trim() : '',
    langSkills: document.getElementById('rbLangSkills') ? document.getElementById('rbLangSkills').value.trim() : '',
    interests: document.getElementById('rbInterests') ? document.getElementById('rbInterests').value.trim() : '',
    customTitle: document.getElementById('rbCustomTitle') ? document.getElementById('rbCustomTitle').value.trim() : '',
    customContent: document.getElementById('rbCustomContent') ? document.getElementById('rbCustomContent').value.trim() : '',
    showRef: document.getElementById('rbShowRef') ? document.getElementById('rbShowRef').checked : false,
    _rbExp: window._rbExp || [],
    _rbEdu: window._rbEdu || [],
    _rbProj: window._rbProj || [],
    _rbCert: window._rbCert || [],
    _rbIntern: window._rbIntern || [],
    _rbAch: window._rbAch || [],
    _rbLang: window._rbLang || [],
    _rbRef: window._rbRef || [],
    _rbTemplate: window._rbTemplate || 'modern'
  };
};

/* ============================================================
   RESUME HTML BUILDER (4 TEMPLATES)
   ============================================================ */
window.rbBuildHTML = function(d) {
  const tpl = d._rbTemplate || 'modern';
  
  // Template colors
  const colors = {
    modern:    { accent: '#4f46e5', headerBg: '#4f46e5', headerText: '#ffffff', sub: '#6366f1' },
    classic:   { accent: '#1e40af', headerBg: '#1e40af', headerText: '#ffffff', sub: '#1e40af' },
    minimal:   { accent: '#374151', headerBg: '#ffffff', headerText: '#111827', sub: '#6b7280' },
    corporate: { accent: '#0f172a', headerBg: '#0f172a', headerText: '#ffffff', sub: '#334155' }
  };
  const c = colors[tpl] || colors.modern;

  const contact = [d.email, d.phone, d.location, d.country].filter(Boolean).join(' • ');
  const links = [d.linkedin, d.portfolio, d.github].filter(Boolean).join(' • ');
  const techSkills = (d.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const softSkills = (d.softSkills || '').split(',').map(s => s.trim()).filter(Boolean);
  const langSkills = (d.langSkills || '').split(',').map(s => s.trim()).filter(Boolean);
  const interests = (d.interests || '').split(',').map(s => s.trim()).filter(Boolean);

  const fmtHTML = (text) => rbEsc(text || '').replace(/\n/g, '<br>');
  const fmtBullets = (text) => {
    const lines = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1) return rbEsc(text || '');
    return '<ul style="margin:5px 0 0 18px;padding:0;font-size:12.5px;line-height:1.55;color:#333">' +
      lines.map(l => `<li style="margin-bottom:2px">${rbEsc(l)}</li>`).join('') + '</ul>';
  };

  const sectionTitle = (title) => `<div style="font-size:12.5px;font-weight:800;color:${c.accent};text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid ${c.accent};padding-bottom:4px;margin-bottom:10px">${title}</div>`;

  let html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff;line-height:1.5;font-size:13px;width:100%">`;

  // === HEADER ===
  if (tpl === 'minimal') {
    html += `<div style="padding:20px 28px 16px;border-bottom:2px solid ${c.accent}">`;
    html += `<div style="font-size:26px;font-weight:900;letter-spacing:-0.5px;line-height:1.1;margin-bottom:4px;color:${c.headerText}">${rbEsc(d.name || 'Your Name')}</div>`;
    if (d.job) html += `<div style="font-size:14px;font-weight:600;color:${c.sub};margin-bottom:8px">${rbEsc(d.job)}</div>`;
    if (contact) html += `<div style="font-size:12px;color:#555;line-height:1.5">${rbEsc(contact)}</div>`;
    if (links) html += `<div style="font-size:12px;color:${c.accent};line-height:1.5;margin-top:2px">${rbEsc(links)}</div>`;
    html += `</div>`;
  } else {
    html += `<div style="background:${c.headerBg};color:${c.headerText};padding:22px 28px;border-radius:6px 6px 0 0">`;
    html += `<div style="font-size:26px;font-weight:900;letter-spacing:-0.5px;line-height:1.1;margin-bottom:4px">${rbEsc(d.name || 'Your Name')}</div>`;
    if (d.job) html += `<div style="font-size:14.5px;font-weight:600;opacity:0.95;margin-bottom:8px">${rbEsc(d.job)}</div>`;
    if (contact) html += `<div style="font-size:12px;opacity:0.92;line-height:1.5">${rbEsc(contact)}</div>`;
    if (links) html += `<div style="font-size:12px;opacity:0.88;line-height:1.5;margin-top:2px">${rbEsc(links)}</div>`;
    html += `</div>`;
  }

  html += `<div style="padding:22px 28px">`;

  // === SUMMARY ===
  if (d.summary) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Professional Summary')}<div style="font-size:12.5px;line-height:1.6;color:#333">${fmtHTML(d.summary)}</div></div>`;
  }

  // === EXPERIENCE ===
  const exp = d._rbExp.filter(e => e.title || e.company);
  if (exp.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Work Experience')}`;
    exp.forEach(e => {
      html += `<div style="margin-bottom:12px">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;gap:10px"><div style="font-size:13.5px;font-weight:700;color:#111">${rbEsc(e.title || '')}</div>${e.duration ? `<div style="font-size:11px;color:#666;white-space:nowrap">${rbEsc(e.duration)}</div>` : ''}</div>`;
      if (e.company) html += `<div style="font-size:12px;color:${c.accent};font-weight:600;margin-bottom:4px">${rbEsc(e.company)}${e.location ? ' • ' + rbEsc(e.location) : ''}</div>`;
      if (e.desc) html += `<div style="font-size:12px;line-height:1.55;color:#333">${fmtBullets(e.desc)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // === INTERNSHIPS ===
  const interns = d._rbIntern.filter(i => i.role || i.company);
  if (interns.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Internships')}`;
    interns.forEach(it => {
      html += `<div style="margin-bottom:10px">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><div style="font-size:13px;font-weight:700">${rbEsc(it.role || '')}</div>${it.duration ? `<div style="font-size:11px;color:#666;white-space:nowrap">${rbEsc(it.duration)}</div>` : ''}</div>`;
      if (it.company) html += `<div style="font-size:12px;color:${c.accent};font-weight:600;margin-bottom:3px">${rbEsc(it.company)}</div>`;
      if (it.desc) html += `<div style="font-size:12px;line-height:1.55;color:#333">${fmtBullets(it.desc)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // === EDUCATION ===
  const edu = d._rbEdu.filter(e => e.degree || e.school);
  if (edu.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Education')}`;
    edu.forEach(e => {
      html += `<div style="margin-bottom:10px">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><div style="font-size:13px;font-weight:700">${rbEsc(e.degree || '')}</div>${e.duration ? `<div style="font-size:11px;color:#666;white-space:nowrap">${rbEsc(e.duration)}</div>` : ''}</div>`;
      const line2 = [e.school, e.field].filter(Boolean).join(' • ');
      if (line2) html += `<div style="font-size:12px;color:#555;margin-top:2px">${rbEsc(line2)}</div>`;
      if (e.score) html += `<div style="font-size:11.5px;color:${c.accent};font-weight:600;margin-top:2px">Score: ${rbEsc(e.score)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // === SKILLS ===
  const hasSkills = techSkills.length > 0 || softSkills.length > 0 || langSkills.length > 0;
  if (hasSkills) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Skills')}`;
    if (techSkills.length) html += `<div style="margin-bottom:6px"><div style="font-size:12px;font-weight:700;color:#333;margin-bottom:4px">Technical</div><div style="display:flex;flex-wrap:wrap;gap:5px">${techSkills.map(s => `<span style="background:#f0f0f5;color:#333;padding:3px 10px;border-radius:12px;font-size:11.5px;font-weight:600">${rbEsc(s)}</span>`).join('')}</div></div>`;
    if (softSkills.length) html += `<div style="margin-bottom:6px"><div style="font-size:12px;font-weight:700;color:#333;margin-bottom:4px">Soft Skills</div><div style="display:flex;flex-wrap:wrap;gap:5px">${softSkills.map(s => `<span style="background:#f0f0f5;color:#333;padding:3px 10px;border-radius:12px;font-size:11.5px;font-weight:600">${rbEsc(s)}</span>`).join('')}</div></div>`;
    if (langSkills.length) html += `<div style="margin-bottom:6px"><div style="font-size:12px;font-weight:700;color:#333;margin-bottom:4px">Languages</div><div style="display:flex;flex-wrap:wrap;gap:5px">${langSkills.map(s => `<span style="background:#f0f0f5;color:#333;padding:3px 10px;border-radius:12px;font-size:11.5px;font-weight:600">${rbEsc(s)}</span>`).join('')}</div></div>`;
    html += `</div>`;
  }

  // === PROJECTS ===
  const proj = d._rbProj.filter(p => p.name);
  if (proj.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Projects')}`;
    proj.forEach(p => {
      html += `<div style="margin-bottom:10px">`;
      html += `<div style="font-size:13px;font-weight:700">${rbEsc(p.name)}</div>`;
      if (p.tech) html += `<div style="font-size:11.5px;color:${c.accent};font-weight:600;margin:2px 0">Tech: ${rbEsc(p.tech)}</div>`;
      if (p.desc) html += `<div style="font-size:12px;line-height:1.55;color:#333">${fmtBullets(p.desc)}</div>`;
      if (p.link) html += `<div style="font-size:11.5px;color:${c.accent};margin-top:2px">🔗 ${rbEsc(p.link)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // === CERTIFICATIONS ===
  const certs = d._rbCert.filter(ct => ct.name);
  if (certs.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Certifications')}`;
    certs.forEach(ct => {
      html += `<div style="margin-bottom:7px;font-size:12px">`;
      html += `<div style="font-weight:700;color:#111">${rbEsc(ct.name)}</div>`;
      const line2 = [ct.org, ct.date].filter(Boolean).join(' • ');
      if (line2) html += `<div style="color:#555;font-size:11.5px">${rbEsc(line2)}</div>`;
      if (ct.id) html += `<div style="color:#888;font-size:11px">ID: ${rbEsc(ct.id)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // === ACHIEVEMENTS ===
  const achs = d._rbAch.filter(a => a.title);
  if (achs.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Achievements & Awards')}`;
    achs.forEach(a => {
      html += `<div style="margin-bottom:7px;font-size:12px">`;
      html += `<div style="font-weight:700;color:#111">${rbEsc(a.title)}</div>`;
      const line2 = [a.org, a.date].filter(Boolean).join(' • ');
      if (line2) html += `<div style="color:#555;font-size:11.5px">${rbEsc(line2)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  // === LANGUAGES ===
  const langs = d._rbLang.filter(l => l.name);
  if (langs.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Languages')}<div style="display:flex;flex-wrap:wrap;gap:6px">`;
    langs.forEach(l => {
      html += `<span style="background:#f0f0f5;color:#333;padding:3px 10px;border-radius:12px;font-size:11.5px;font-weight:600">${rbEsc(l.name)} — ${rbEsc(l.level)}</span>`;
    });
    html += `</div></div>`;
  }

  // === INTERESTS ===
  if (interests.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('Interests & Hobbies')}<div style="font-size:12.5px;color:#333">${interests.map(rbEsc).join(' • ')}</div></div>`;
  }

  // === CUSTOM SECTION ===
  if (d.customTitle && d.customContent) {
    html += `<div style="margin-bottom:16px">${sectionTitle(rbEsc(d.customTitle))}<div style="font-size:12.5px;line-height:1.6;color:#333">${fmtHTML(d.customContent)}</div></div>`;
  }

  // === REFERENCES ===
  const refs = d._rbRef.filter(r => r.name);
  if (d.showRef && refs.length > 0) {
    html += `<div style="margin-bottom:16px">${sectionTitle('References')}`;
    refs.forEach(r => {
      html += `<div style="margin-bottom:7px;font-size:12px">`;
      html += `<div style="font-weight:700;color:#111">${rbEsc(r.name)}</div>`;
      const line2 = [r.role, r.company].filter(Boolean).join(' • ');
      if (line2) html += `<div style="color:#555;font-size:11.5px">${rbEsc(line2)}</div>`;
      if (r.contact) html += `<div style="color:#666;font-size:11.5px">${rbEsc(r.contact)}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
};

/* ============================================================
   PREVIEW GENERATOR
   ============================================================ */
window.rbPreview = function() {
  const d = rbGetData();
  if (!d.name) { if (typeof toast === 'function') toast('Enter your name first', 'error'); return; }

  // Auto-save
  try { rbSaveLocal(true); } catch(e) {}

  const html = rbBuildHTML(d);
  const box = document.getElementById('rbResult');
  box.innerHTML = `
    <div class="result-title">Resume Preview</div>
    <div id="rbPreviewArea" style="background:#fff;border-radius:8px;overflow:hidden;padding:0;margin-top:8px;box-shadow:0 4px 20px rgba(0,0,0,0.08)">${html}</div>
    <div class="export-btns no-export no-print" style="margin-top:14px">
      <button class="btn btn-primary" onclick="rbDownloadPDF()"><i>📄</i>PDF</button>
      <button class="btn btn-secondary" onclick="rbPrint()"><i>🖨️</i>Print</button>
      <button class="btn btn-secondary" onclick="rbCopyText()"><i>📋</i>Copy</button>
    </div>`;
  box.classList.add('active');
  if (typeof toast === 'function') toast('Preview ready ✅', 'success');

  setTimeout(() => {
    const area = document.getElementById('rbPreviewArea');
    if (area) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

/* ============================================================
   ULTRA HD PDF DOWNLOAD
   ============================================================ */
window.rbDownloadPDF = function() {
  const area = document.getElementById('rbPreviewArea');
  if (!area) { if (typeof toast === 'function') toast('Preview first', 'error'); return; }
  if (typeof toast === 'function') toast('Generating Ultra HD PDF...');

  const clone = area.cloneNode(true);
  clone.style.padding = '0';
  clone.style.width = '820px';
  clone.style.background = '#fff';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-99999px;top:0;background:#fff;width:820px;padding:0;margin:0;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  setTimeout(() => {
    if (!window.htmlToImage) { if (typeof toast === 'function') toast('Library not loaded', 'error'); document.body.removeChild(wrap); return; }
    htmlToImage.toPng(clone, { quality: 1.0, pixelRatio: 4, backgroundColor: '#ffffff' })
      .then(dataUrl => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pw = pdf.internal.pageSize.getWidth();
        const ph = pdf.internal.pageSize.getHeight();
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          let w = pw - 12, h = w / ratio;
          if (h > ph - 12) { h = ph - 12; w = h * ratio; }
          pdf.addImage(dataUrl, 'PNG', (pw - w) / 2, 6, w, h, undefined, 'FAST');
          const name = (document.getElementById('rbName').value || 'resume').replace(/\s+/g, '-').toLowerCase();
          pdf.save(name + '-resume.pdf');
          if (typeof toast === 'function') toast('Resume PDF downloaded ✅', 'success');
        };
        img.src = dataUrl;
      })
      .catch(err => { console.error(err); if (typeof toast === 'function') toast('PDF failed', 'error'); })
      .finally(() => document.body.removeChild(wrap));
  }, 400);
};

/* ============================================================
   PRINT
   ============================================================ */
window.rbPrint = function() {
  const area = document.getElementById('rbPreviewArea');
  if (!area) { if (typeof toast === 'function') toast('Preview first', 'error'); return; }
  const html = `<!DOCTYPE html><html><head><title>Resume — Qunvero</title><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;background:#fff;padding:0}
    @media print{@page{margin:6mm}}
  </style></head><body>${area.outerHTML}</body></html>`;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setTimeout(() => document.body.removeChild(iframe), 2000); }, 500);
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => { printWindow.focus(); printWindow.print(); setTimeout(() => printWindow.close(), 1000); }, 500);
};

/* ============================================================
   COPY AS TEXT
   ============================================================ */
window.rbCopyText = function() {
  const d = rbGetData();
  let txt = `${d.name || ''}\n`;
  if (d.job) txt += `${d.job}\n`;
  const contact = [d.email, d.phone, d.location, d.country].filter(Boolean).join(' | ');
  if (contact) txt += `${contact}\n`;
  const links = [d.linkedin, d.portfolio, d.github].filter(Boolean).join(' | ');
  if (links) txt += `${links}\n`;
  txt += '\n';

  if (d.summary) txt += `PROFESSIONAL SUMMARY\n${d.summary}\n\n`;

  const exp = d._rbExp.filter(e => e.title || e.company);
  if (exp.length) {
    txt += `WORK EXPERIENCE\n`;
    exp.forEach(e => {
      txt += `${e.title || ''}${e.company ? ' at ' + e.company : ''}${e.duration ? ' (' + e.duration + ')' : ''}\n`;
      if (e.desc) txt += `${e.desc}\n`;
      txt += '\n';
    });
  }

  const edu = d._rbEdu.filter(e => e.degree || e.school);
  if (edu.length) {
    txt += `EDUCATION\n`;
    edu.forEach(e => {
      txt += `${e.degree || ''}${e.school ? ' - ' + e.school : ''}${e.duration ? ' (' + e.duration + ')' : ''}${e.score ? ' | ' + e.score : ''}\n`;
    });
    txt += '\n';
  }

  if (d.skills) txt += `TECHNICAL SKILLS\n${d.skills}\n\n`;
  if (d.softSkills) txt += `SOFT SKILLS\n${d.softSkills}\n\n`;

  const proj = d._rbProj.filter(p => p.name);
  if (proj.length) {
    txt += `PROJECTS\n`;
    proj.forEach(p => { txt += `${p.name}${p.tech ? ' (' + p.tech + ')' : ''}: ${p.desc || ''}\n`; });
    txt += '\n';
  }

  const certs = d._rbCert.filter(ct => ct.name);
  if (certs.length) {
    txt += `CERTIFICATIONS\n`;
    certs.forEach(ct => txt += `${ct.name}${ct.org ? ' — ' + ct.org : ''}${ct.date ? ' (' + ct.date + ')' : ''}\n`);
    txt += '\n';
  }

  const achs = d._rbAch.filter(a => a.title);
  if (achs.length) {
    txt += `ACHIEVEMENTS\n`;
    achs.forEach(a => txt += `${a.title}${a.org ? ' — ' + a.org : ''}${a.date ? ' (' + a.date + ')' : ''}\n`);
    txt += '\n';
  }

  const langs = d._rbLang.filter(l => l.name);
  if (langs.length) {
    txt += `LANGUAGES\n`;
    langs.forEach(l => txt += `${l.name} — ${l.level}\n`);
    txt += '\n';
  }

  if (d.interests) txt += `INTERESTS\n${d.interests}\n`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt)
      .then(() => { if (typeof toast === 'function') toast('Resume text copied ✅', 'success'); })
      .catch(() => { if (typeof toast === 'function') toast('Copy failed', 'error'); });
  } else {
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    if (typeof toast === 'function') toast('Resume text copied ✅', 'success');
  }
};

console.log('%c✅ Resume Builder Part B loaded — Preview + PDF + 4 Templates ready', 'color:#8b5cf6;font-weight:bold');

/* ============================================================
   PART C: SAVE / LOAD / RESET
   ============================================================ */

/* ============================================================
   SAVE TO LOCALSTORAGE
   ============================================================ */
window.rbSaveLocal = function(silent) {
  try {
    const d = rbGetData();
    if (typeof DB !== 'undefined' && DB.set) {
      DB.set('resume_data', d);
    } else {
      localStorage.setItem('qunvero_resume_data', JSON.stringify(d));
    }
    if (!silent && typeof toast === 'function') toast('💾 Resume saved locally', 'success');
  } catch (e) {
    console.error('Save failed:', e);
    if (!silent && typeof toast === 'function') toast('Save failed', 'error');
  }
};

/* ============================================================
   LOAD FROM LOCALSTORAGE
   ============================================================ */
window.rbLoadLocal = function(silent) {
  try {
    let d = null;
    if (typeof DB !== 'undefined' && DB.get) {
      d = DB.get('resume_data', null);
    }
    if (!d) {
      try { d = JSON.parse(localStorage.getItem('qunvero_resume_data') || 'null'); } catch(e) {}
    }
    if (!d) {
      if (!silent && typeof toast === 'function') toast('No saved resume found', 'error');
      return;
    }

    // Fill basic fields
    const fields = {
      rbName: d.name, rbJob: d.job, rbEmail: d.email, rbPhone: d.phone,
      rbLocation: d.location, rbCountry: d.country, rbLinkedin: d.linkedin,
      rbPortfolio: d.portfolio, rbGithub: d.github, rbSummary: d.summary,
      rbSkills: d.skills, rbSoftSkills: d.softSkills, rbLangSkills: d.langSkills,
      rbInterests: d.interests, rbCustomTitle: d.customTitle, rbCustomContent: d.customContent
    };
    Object.keys(fields).forEach(id => {
      const el = document.getElementById(id);
      if (el && fields[id] !== undefined && fields[id] !== null) el.value = fields[id];
    });

    // Show references if saved
    const showRefEl = document.getElementById('rbShowRef');
    if (showRefEl) {
      showRefEl.checked = !!d.showRef;
      const wrap = document.getElementById('rbRefWrap');
      if (wrap) wrap.style.display = d.showRef ? 'block' : 'none';
    }

    // Fill dynamic arrays
    window._rbExp = d._rbExp || [];
    window._rbEdu = d._rbEdu || [];
    window._rbProj = d._rbProj || [];
    window._rbCert = d._rbCert || [];
    window._rbIntern = d._rbIntern || [];
    window._rbAch = d._rbAch || [];
    window._rbLang = d._rbLang || [];
    window._rbRef = d._rbRef || [];
    window._rbTemplate = d._rbTemplate || 'modern';

    // Re-render all sections
    rbRenderExp();
    rbRenderEdu();
    rbRenderProj();
    rbRenderCert();
    rbRenderIntern();
    rbRenderAch();
    rbRenderLang();
    rbRenderRef();

    // Update template chip
    document.querySelectorAll('#toolBody .chip[data-tpl]').forEach(c => {
      c.classList.toggle('active', c.dataset.tpl === window._rbTemplate);
    });

    // Update character counter
    if (typeof rbCountChar === 'function' && d.summary) {
      rbCountChar('rbSummary', 'rbSummaryCount', 800);
    }

    if (!silent && typeof toast === 'function') toast('📂 Resume loaded', 'success');
  } catch (e) {
    console.error('Load failed:', e);
    if (!silent && typeof toast === 'function') toast('Load failed', 'error');
  }
};

/* ============================================================
   CLEAR SAVED DATA
   ============================================================ */
window.rbClearLocal = function() {
  if (!confirm('Delete saved resume? This cannot be undone.')) return;
  try {
    if (typeof DB !== 'undefined' && DB.set) {
      DB.set('resume_data', null);
    }
    localStorage.removeItem('qunvero_resume_data');
    if (typeof toast === 'function') toast('🗑️ Saved resume cleared', 'success');
  } catch (e) {
    if (typeof toast === 'function') toast('Clear failed', 'error');
  }
};

/* ============================================================
   RESET FORM
   ============================================================ */
window.rbReset = function() {
  if (!confirm('Reset the entire form? Saved data will also be cleared.')) return;

  // Clear text inputs
  const textFields = ['rbName','rbJob','rbEmail','rbPhone','rbLocation','rbCountry','rbLinkedin','rbPortfolio','rbGithub','rbSummary','rbSkills','rbSoftSkills','rbLangSkills','rbInterests','rbCustomTitle','rbCustomContent'];
  textFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Clear checkbox
  const showRefEl = document.getElementById('rbShowRef');
  if (showRefEl) {
    showRefEl.checked = false;
    const wrap = document.getElementById('rbRefWrap');
    if (wrap) wrap.style.display = 'none';
  }

  // Clear arrays
  window._rbExp = [];
  window._rbEdu = [];
  window._rbProj = [];
  window._rbCert = [];
  window._rbIntern = [];
  window._rbAch = [];
  window._rbLang = [];
  window._rbRef = [];
  window._rbTemplate = 'modern';

  // Re-render
  rbRenderExp();
  rbRenderEdu();
  rbRenderProj();
  rbRenderCert();
  rbRenderIntern();
  rbRenderAch();
  rbRenderLang();
  rbRenderRef();

  // Reset template chips
  document.querySelectorAll('#toolBody .chip[data-tpl]').forEach(c => {
    c.classList.toggle('active', c.dataset.tpl === 'modern');
  });

  // Clear preview
  const box = document.getElementById('rbResult');
  if (box) {
    box.classList.remove('active');
    box.innerHTML = '';
  }

  // Update character counter
  const countEl = document.getElementById('rbSummaryCount');
  if (countEl) countEl.textContent = '0';

  // Clear saved data
  try {
    if (typeof DB !== 'undefined' && DB.set) DB.set('resume_data', null);
    localStorage.removeItem('qunvero_resume_data');
  } catch(e) {}

  if (typeof toast === 'function') toast('🔄 Form reset', 'success');
};

/* ============================================================
   AUTO-SAVE ON INPUT CHANGE
   ============================================================ */
(function setupAutoSave() {
  // Ye function har 3 seconds baad auto-save karega agar form khula hai
  let autoSaveTimer = null;
  const originalInit = window.EXTRA_TOOL_INITS['resume-builder'];
  if (originalInit) {
    window.EXTRA_TOOL_INITS['resume-builder'] = function() {
      originalInit();
      // Setup auto-save on input
      setTimeout(() => {
        const form = document.getElementById('toolBody');
        if (form) {
          form.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
              try { rbSaveLocal(true); } catch(e) {}
            }, 2000);
          }, true);
        }
      }, 500);
    };
  }
})();

console.log('%c✅ Resume Builder Part C loaded — Save/Load/Reset ready', 'color:#8b5cf6;font-weight:bold');
console.log('%c🎉 RESUME BUILDER COMPLETE — All features ready!', 'color:#10b981;font-weight:bold;font-size:15px');