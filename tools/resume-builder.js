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