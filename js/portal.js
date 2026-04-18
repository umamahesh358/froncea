/* =============================================
   CIET PORTAL — MAIN JAVASCRIPT v2.0
   Full drawer + toast system for all pages
   ============================================= */

'use strict';

/* ─────────────────────────────────────
   SIDEBAR TOGGLE (Mobile)
───────────────────────────────────── */
function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

/* ─────────────────────────────────────
   TAB SWITCHING
───────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const parent = btn.closest('[data-tabs-parent]') || document;
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = parent.querySelector(`#${target}`);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ─────────────────────────────────────
   FLIP CARDS
───────────────────────────────────── */
function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* ─────────────────────────────────────
   ACTIVE NAV LINK
───────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href     = item.getAttribute('href') || '';
    const hrefPage = href.split('/').pop();
    const target   = item.dataset.page || hrefPage;
    if (target && target === page) item.classList.add('active');
  });
}

/* ─────────────────────────────────────
   ANIMATE PROGRESS BARS
───────────────────────────────────── */
function animateBars() {
  document.querySelectorAll('[data-width]').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.width; }, 200);
  });
}

/* ─────────────────────────────────────
   TOAST NOTIFICATIONS
───────────────────────────────────── */
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const colors = { success:'#16a34a', error:'#dc2626', info:'#0891b2', warn:'#d97706' };
  const icons  = { success:'✓', error:'✕', info:'ℹ', warn:'⚠' };
  const toast  = document.createElement('div');
  toast.style.cssText = `
    background:#fff;border:1px solid #e2e8f0;border-left:4px solid ${colors[type]||colors.info};
    border-radius:10px;padding:12px 16px;font-size:13px;font-weight:500;color:#0f172a;
    box-shadow:0 4px 20px rgba(0,0,0,.12);max-width:320px;pointer-events:auto;
    display:flex;align-items:center;gap:10px;
    animation:slideInRight .25s ease;
  `;
  toast.innerHTML = `<span style="color:${colors[type]};font-weight:700;">${icons[type]}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3200);
}

/* ─────────────────────────────────────
   DRAWER SYSTEM
───────────────────────────────────── */
function initDrawer() {
  if (document.getElementById('portal-drawer')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="drawer-backdrop" style="display:none;position:fixed;inset:0;background:rgba(15,23,42,0.4);z-index:400;backdrop-filter:blur(3px);transition:opacity .25s;"></div>
    <div id="portal-drawer" style="display:none;position:fixed;top:0;right:0;height:100%;width:100%;max-width:440px;background:#fff;z-index:500;box-shadow:-8px 0 48px rgba(0,0,0,.14);overflow-y:auto;transition:transform .3s cubic-bezier(.4,0,.2,1);transform:translateX(100%);font-family:'Inter',sans-serif;">
      <div id="drawer-header" style="padding:24px 28px 20px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;">
        <div>
          <h2 id="drawer-title" style="font-size:16px;font-weight:700;color:#0f172a;margin:0;"></h2>
          <p id="drawer-subtitle" style="font-size:12px;color:#64748b;margin:4px 0 0;"></p>
        </div>
        <button id="drawer-close" style="width:34px;height:34px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:16px;flex-shrink:0;transition:background .15s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">✕</button>
      </div>
      <div id="drawer-body" style="padding:24px 28px 32px;"></div>
    </div>
  `);
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
}

function openDrawer(title, subtitle, bodyHTML) {
  const drawer   = document.getElementById('portal-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  document.getElementById('drawer-title').textContent    = title;
  document.getElementById('drawer-subtitle').textContent = subtitle || '';
  document.getElementById('drawer-body').innerHTML       = bodyHTML;
  backdrop.style.display = 'block';
  drawer.style.display   = 'block';
  requestAnimationFrame(() => {
    backdrop.style.opacity = '1';
    drawer.style.transform = 'translateX(0)';
  });
  // Init any file inputs inside the drawer
  drawer.querySelectorAll('.dropzone-area').forEach(dz => initDropzone(dz));
}

function closeDrawer() {
  const drawer   = document.getElementById('portal-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer) return;
  drawer.style.transform = 'translateX(100%)';
  backdrop.style.opacity = '0';
  setTimeout(() => {
    drawer.style.display   = 'none';
    backdrop.style.display = 'none';
  }, 300);
}

/* ─────────────────────────────────────
   FILE DROPZONE HELPER
───────────────────────────────────── */
function initDropzone(dz) {
  if (!dz || dz.dataset.initialized) return;
  dz.dataset.initialized = '1';
  const input  = dz.querySelector('input[type="file"]');
  const label  = dz.querySelector('.dz-label');
  const preview = dz.querySelector('.dz-preview');

  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dz-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dz-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('dz-over');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], preview, label);
  });
  dz.addEventListener('click', () => input && input.click());
  if (input) input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0], preview, label);
  });
}

function handleFile(file, preview, label) {
  if (!file) return;
  if (label) label.textContent = file.name;
  if (!preview) return;
  const isImage = file.type.startsWith('image/');
  if (isImage) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}" style="width:100%;max-height:160px;object-fit:contain;border-radius:8px;margin-top:8px;">`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = `<div style="margin-top:8px;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12px;color:#15803d;">✓ ${file.name} (${(file.size/1024).toFixed(1)} KB) ready to upload</div>`;
  }
}

/* ─────────────────────────────────────
   SHARED DRAWER HELPERS
───────────────────────────────────── */
function field(label, inputHTML) {
  return `<div class="df-group"><label class="df-label">${label}</label>${inputHTML}</div>`;
}
function textInput(placeholder, value='') {
  return `<input type="text" class="df-input" placeholder="${placeholder}" value="${value}">`;
}
function dateInput(value='') {
  return `<input type="date" class="df-input" value="${value}">`;
}
function textarea(placeholder, value='', rows=4) {
  return `<textarea class="df-input df-textarea" placeholder="${placeholder}" rows="${rows}">${value}</textarea>`;
}
function select(options, value='') {
  const opts = options.map(([v,l]) => `<option value="${v}"${v===value?' selected':''}>${l}</option>`).join('');
  return `<select class="df-input df-select"><option value="" disabled${!value?' selected':''}>Choose...</option>${opts}</select>`;
}
function dropzone(label='Drop certificate image / PDF here, or click to browse', accept='image/*,.pdf') {
  return `
    <div class="dropzone-area" style="border:2px dashed #cbd5e1;border-radius:10px;padding:28px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s;position:relative;">
      <input type="file" accept="${accept}" style="display:none;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom:10px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <p class="dz-label" style="font-size:13px;color:#64748b;margin:0;">${label}</p>
      <p style="font-size:11px;color:#94a3b8;margin:6px 0 0;">PNG, JPG, PDF · Max 5 MB</p>
      <div class="dz-preview"></div>
    </div>`;
}
function drawerFooter(saveTxt='Save', toast='Saved successfully!', toastType='success') {
  return `
    <div style="display:flex;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0;">
      <button onclick="closeDrawer()" class="df-btn-outline" style="flex:1;">Cancel</button>
      <button onclick="showToast('${toast}','${toastType}');closeDrawer();" class="df-btn-primary" style="flex:1;">${saveTxt}</button>
    </div>`;
}

/* ─────────────────────────────────────
   DRAWER DEFINITIONS (per page / button)
───────────────────────────────────── */
const DRAWERS = {

  'add-internship': () => openDrawer('Log a New Internship', 'Your real-world impact builds your career story.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Role / Title *', textInput('e.g. Frontend Developer Intern'))}
      ${field('Company / Organisation *', textInput('e.g. Google India'))}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('Type', select([['internship','Internship'],['contract','Contract'],['part-time','Part-time'],['remote','Remote Internship']]))}
        ${field('Location', textInput('e.g. Hyderabad (Hybrid)'))}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('Start Date', dateInput())}
        ${field('End Date <span style="color:#94a3b8;font-weight:400;">(leave blank if current)</span>', dateInput())}
      </div>
      ${field('Key Contributions', textarea('• Developed a REST API that reduced latency by 20%\n• Collaborated in an Agile team of 6', '', 5))}
      ${field('Skills Applied <span style="color:#94a3b8;font-weight:400;">(comma-separated)</span>', textInput('e.g. React, Node.js, Agile'))}
      ${field('Stipend <span style="color:#94a3b8;font-weight:400;">(optional)</span>', textInput('e.g. ₹15,000 / month'))}
      ${drawerFooter('+ Add Internship', 'Internship added to your timeline!')}
    </div>`),

  'add-education': () => openDrawer('Add Academic Record', 'Build a complete picture of your academic journey.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Level *', select([['ug','B.Tech / UG'],['pg','M.Tech / PG'],['inter','Intermediate (12th)'],['ssc','10th / SSC'],['cert','Diploma / Certificate']]))}
      ${field('Institution Name *', textInput('e.g. Chalapathi Institute of Engineering and Technology'))}
      ${field('Board / University', textInput('e.g. JNTUA, CBSE, State Board'))}
      ${field('Field of Study / Stream', textInput('e.g. Computer Science & Engineering'))}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('Start Year', textInput('e.g. 2022'))}
        ${field('End Year / Expected', textInput('e.g. 2026'))}
      </div>
      <div>
        <label class="df-label">Grading System</label>
        <div style="display:flex;gap:16px;margin-top:8px;">
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;"><input type="radio" name="grade-type" value="cgpa" checked onchange="document.getElementById('grade-input').placeholder='e.g. 9.2'"> CGPA</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;"><input type="radio" name="grade-type" value="pct" onchange="document.getElementById('grade-input').placeholder='e.g. 94%'"> Percentage</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;"><input type="radio" name="grade-type" value="rank" onchange="document.getElementById('grade-input').placeholder='e.g. 3 (out of 62)'"> Rank</label>
        </div>
      </div>
      ${field('Score / Grade', `<input type="text" id="grade-input" class="df-input" placeholder="e.g. 9.2">`)}
      ${drawerFooter('+ Add Record', 'Academic record added!')}
    </div>`),

  'deploy-project': () => openDrawer('Deploy a New Project', 'Your engineering proof-of-work. Build, deploy, impress.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Project Title *', textInput('e.g. Smart Traffic Management System'))}
      ${field('Description *', textarea('What does this project do? What problem does it solve?', '', 4))}
      ${field('Status', select([['in-progress','In Progress'],['completed','Completed / Deployed'],['archived','Archived']]))}
      ${field('Tech Stack <span style="color:#94a3b8;font-weight:400;">(comma-separated)</span>', textInput('e.g. React, Node.js, MongoDB, AWS'))}
      ${field('GitHub Repository URL', textInput('https://github.com/username/repo'))}
      ${field('Live Demo URL <span style="color:#94a3b8;font-weight:400;">(optional)</span>', textInput('https://your-app.vercel.app'))}
      ${field('Key Features / Highlights', textarea('• Reduced latency by 30%\n• Supports 10K concurrent users', '', 3))}
      ${drawerFooter('🚀 Deploy Project', 'Project deployed to your portfolio!')}
    </div>`),

  'add-publication': () => openDrawer('Add Research / Publication', 'Academic rigor that impresses R&D recruiters.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Publication Type', select([['journal','Journal Article'],['conference','Conference Paper'],['thesis','Thesis / Dissertation'],['whitepaper','Whitepaper'],['patent','Patent']]))}
      ${field('Status', select([['published','Published'],['ongoing','Ongoing / In Progress'],['submitted','Submitted'],['under-review','Under Review'],['accepted','Accepted']]))}
      ${field('Title *', textInput('e.g. Federated Learning for Privacy-Preserving Healthcare Analytics'))}
      ${field('Co-Authors <span style="color:#94a3b8;font-weight:400;">(comma-separated)</span>', textInput('e.g. Dr. A. Sharma, Jane Doe'))}
      ${field('Venue / Conference / Journal', textInput('e.g. IEEE Transactions on Neural Networks, 2026'))}
      ${field('Publication Date', dateInput())}
      ${field('Abstract / Summary', textarea('Brief summary of the research, methodology, and outcomes...', '', 5))}
      ${field('DOI / URL <span style="color:#94a3b8;font-weight:400;">(optional)</span>', textInput('https://doi.org/...'))}
      ${drawerFooter('+ Add Publication', 'Research publication added!')}
    </div>`),

  'add-certification': () => openDrawer('Add New Certification', 'Verified credentials that set you apart.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Certificate Title *', textInput('e.g. AWS Certified Cloud Practitioner'))}
      ${field('Issuing Organisation *', textInput('e.g. Amazon Web Services'))}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('Issue Date', dateInput())}
        ${field('Expiry Date <span style="color:#94a3b8;font-weight:400;">(optional)</span>', dateInput())}
      </div>
      ${field('Credential ID <span style="color:#94a3b8;font-weight:400;">(optional)</span>', textInput('e.g. AWS-CLF-12345'))}
      ${field('Credential / Verify URL', textInput('https://www.credly.com/badges/...'))}
      ${field('Skills Unlocked <span style="color:#94a3b8;font-weight:400;">(comma-separated)</span>', textInput('e.g. Cloud Computing, S3, EC2, IAM'))}
      <div>
        <label class="df-label">Certificate Image / PDF <span style="color:#94a3b8;font-weight:400;">(optional)</span></label>
        ${dropzone('Drop certificate image or PDF here, or click to browse', 'image/*,.pdf')}
      </div>
      ${drawerFooter('+ Add Certification', 'Certification added to your trophy case! 🏆')}
    </div>`),

  'join-cohort': (name='') => openDrawer('Join a Cohort', 'Connect with peers who share your goals.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${name ? `<div style="padding:14px;background:#fdf2f5;border:1px solid rgba(175,12,62,0.15);border-radius:10px;font-size:13px;font-weight:600;color:#AF0C3E;">Joining: ${name}</div>` : ''}
      ${field('Search or Browse Cohorts', textInput('e.g. AI/ML Club, DevOps Crew...'))}
      <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-top:4px;">Open Cohorts</div>
      ${['Full-Stack Builders', 'Startup Sprint', 'AI/ML Research Collective', 'Open Source Contributors', 'Campus Community Service'].map(c => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;gap:8px;">
          <div style="font-size:13px;font-weight:600;">${c}</div>
          <button onclick="showToast('Join request sent for ${c}!','success');" style="padding:6px 14px;background:#AF0C3E;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">Join</button>
        </div>`).join('')}
      ${drawerFooter('Browse All Cohorts', 'Cohort joined! Welcome aboard 🎉')}
    </div>`),

  'edit-profile': () => openDrawer('Edit Profile', 'Customize how recruiters and peers see you.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#AF0C3E,#8F0830);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;flex-shrink:0;">J</div>
        <div style="flex:1;">
          <p style="font-size:13px;font-weight:600;color:#0f172a;margin:0 0 8px;">Profile Photo</p>
          ${dropzone('Click to upload a profile photo', 'image/*')}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('First Name', textInput('e.g. John', 'John'))}
        ${field('Last Name', textInput('e.g. Student', 'Student'))}
      </div>
      ${field('Tagline / Bio', textarea('"Aspiring Full-Stack Developer passionate about building scalable products."', '"Aspiring Full-Stack Developer passionate about building scalable products."', 3))}
      ${field('Location', textInput('e.g. Hyderabad, Andhra Pradesh', 'Hyderabad, Andhra Pradesh'))}
      ${field('Skills <span style="color:#94a3b8;font-weight:400;">(comma-separated)</span>', textInput('e.g. React, Node.js, Python, Cloud', 'React, Node.js, Python, Cloud'))}
      ${field('LinkedIn URL', textInput('https://linkedin.com/in/...'))}
      ${field('GitHub URL', textInput('https://github.com/...'))}
      ${field('LeetCode URL', textInput('https://leetcode.com/u/...'))}
      ${drawerFooter('Save Profile', 'Profile updated successfully!')}
    </div>`),

  'add-event': () => openDrawer('Log Event / Achievement', 'Your extracurriculars prove leadership to recruiters.', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Event Name *', textInput('e.g. Smart India Hackathon 2024'))}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('Scope', select([['campus','Campus'],['national','National'],['international','International'],['online','Online']]))}
        ${field('Role', select([['participant','Participant'],['winner','Winner'],['organizer','Organizer'],['volunteer','Volunteer'],['speaker','Speaker'],['mentor','Mentor']]))}
      </div>
      ${field('Position / Achievement <span style="color:#94a3b8;font-weight:400;">(optional)</span>', textInput('e.g. 1st Place, Best UI Award, Finalist'))}
      ${field('Organizer / Body', textInput('e.g. IEEE, CSE Department, Ministry of Education'))}
      ${field('Location / Mode', textInput('e.g. Main Auditorium / Online'))}
      ${field('Event Date', dateInput())}
      ${field('Certificate / Proof Image', dropzone('Click to upload certificate or proof image', 'image/*,.pdf'))}
      ${drawerFooter('+ Log Event', 'Event added to your portfolio!')}
    </div>`),

  'edit-internship': (title='', company='') => openDrawer(`Edit: ${title}`, `${company}`, `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${field('Role / Title', textInput('', title))}
      ${field('Company', textInput('', company))}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${field('Start Date', dateInput())}
        ${field('End Date', dateInput())}
      </div>
      ${field('Location', textInput('e.g. Hyderabad (Hybrid)'))}
      ${field('Key Contributions', textarea('', '', 5))}
      ${field('Skills Applied', textInput('e.g. React, Node.js, Agile'))}
      <div style="display:flex;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0;">
        <button onclick="showToast('Internship deleted.','error');closeDrawer();" style="padding:9px 16px;background:#fef2f2;border:1.5px solid #fecaca;border-radius:8px;font-size:13px;font-weight:600;color:#dc2626;cursor:pointer;">Delete</button>
        <button onclick="closeDrawer()" class="df-btn-outline" style="flex:1;">Cancel</button>
        <button onclick="showToast('Internship updated!','success');closeDrawer();" class="df-btn-primary" style="flex:1;">Save Changes</button>
      </div>
    </div>`),
};

/* ─────────────────────────────────────
   INJECT DRAWER COMPONENT CSS
───────────────────────────────────── */
function injectDrawerStyles() {
  if (document.getElementById('df-styles')) return;
  const s = document.createElement('style');
  s.id = 'df-styles';
  s.textContent = `
    @keyframes slideInRight { from{transform:translateX(24px);opacity:0} to{transform:translateX(0);opacity:1} }

    .df-group { display:flex;flex-direction:column;gap:5px; }
    .df-label { font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em; }
    .df-input {
      padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;
      font-size:13px;color:#0f172a;background:#fff;outline:none;
      transition:border-color .2s,box-shadow .2s;font-family:'Inter',sans-serif;width:100%;box-sizing:border-box;
    }
    .df-input:focus { border-color:#AF0C3E;box-shadow:0 0 0 3px rgba(175,12,62,.08); }
    .df-textarea { resize:vertical;min-height:80px; }
    .df-select { appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer; }

    .df-btn-primary {
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      padding:9px 16px;background:#AF0C3E;color:#fff;border:none;border-radius:8px;
      font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;
      transition:background .15s,transform .1s;
    }
    .df-btn-primary:hover { background:#8F0830; }
    .df-btn-primary:active { transform:scale(.98); }

    .df-btn-outline {
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      padding:9px 16px;background:#fff;color:#0f172a;border:1.5px solid #e2e8f0;border-radius:8px;
      font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;
      transition:border-color .15s;
    }
    .df-btn-outline:hover { border-color:#AF0C3E;color:#AF0C3E; }

    .dropzone-area:hover,.dropzone-area.dz-over {
      border-color:#AF0C3E !important;background:rgba(175,12,62,.03);
    }
    .dropzone-area.dz-over { transform:scale(.99); }
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────
   WIRE ALL BUTTONS PER PAGE
───────────────────────────────────── */
function wireButtons() {
  const page = location.pathname.split('/').pop() || 'index.html';

  // ── Dashboard (index.html) ──
  if (page === 'index.html') {
    // "Add Internship to boost" button inside the profile banner
    document.querySelectorAll('.btn-boost, [data-action="add-internship"]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-internship'](); });
    });
  }

  // ── Education ──
  if (page === 'education.html') {
    document.querySelectorAll('.btn-primary, [data-action="add-education"]').forEach(btn => {
      if (/add|education|rank/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-education'](); });
      }
    });
    // dashed "Add Education / Rank" placeholder card/button
    document.querySelectorAll('[onclick*="education"], .add-edu-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-education'](); });
    });
  }

  // ── Internships ──
  if (page === 'internships.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/add|internship/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-internship'](); });
      }
    });
    // Edit icons on intern cards (pencil / edit buttons)
    document.querySelectorAll('.intern-card .btn-ghost, .intern-card [data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card   = btn.closest('.intern-card');
        const title  = card?.querySelector('.intern-title')?.textContent  || 'Internship';
        const company= card?.querySelector('.intern-company')?.textContent || 'Company';
        DRAWERS['edit-internship'](title, company);
      });
    });
  }

  // ── Projects ──
  if (page === 'projects.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/deploy|add|project/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['deploy-project'](); });
      }
    });
  }

  // ── Research ──
  if (page === 'research.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/add|publication|research/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-publication'](); });
      }
    });
  }

  // ── Certifications ──
  if (page === 'certifications.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/add|certification|cert/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-certification'](); });
      }
    });
  }

  // ── Events ──
  if (page === 'events.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/register|add|event/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-event'](); });
      }
    });
  }

  // ── Cohorts ──
  if (page === 'cohorts.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/join|cohort/i.test(btn.textContent)) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          DRAWERS['join-cohort']();
        });
      }
    });
    // "Join This Cohort" inside individual cards
    document.querySelectorAll('.cohort-card .btn-primary').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const cohortName = btn.closest('.cohort-card')?.querySelector('.cohort-name')?.textContent || '';
        DRAWERS['join-cohort'](cohortName);
      });
    });
  }

  // ── Profile ──
  if (page === 'profile.html') {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
      if (/edit profile/i.test(btn.textContent)) {
        btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['edit-profile'](); });
      }
    });
    // All "Edit" ghost buttons in cards
    document.querySelectorAll('.card .btn-ghost').forEach(btn => {
      if (btn.textContent.trim() === 'Edit') {
        btn.addEventListener('click', e => {
          e.preventDefault();
          const section = btn.closest('.card')?.querySelector('h2')?.textContent || 'Section';
          openDrawer(`Edit ${section}`, 'Update your profile information.', `
            <div style="display:flex;flex-direction:column;gap:14px;">
              ${field('Content', textarea('Update your information here...', '', 5))}
              ${drawerFooter('Save Changes', `${section} updated!`)}
            </div>`);
        });
      }
    });
  }

  // ── Settings ──
  if (page === 'settings.html') {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (/save|update/i.test(btn.textContent)) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          showToast('Settings saved successfully!', 'success');
        });
      }
    });
  }

  // ── Universal: dashboard "boost" button ──
  document.querySelectorAll('.btn-boost').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); DRAWERS['add-internship'](); });
  });

  // ── Universal: keyboard escape ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });
}

/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectDrawerStyles();
  initSidebar();
  initTabs();
  initFlipCards();
  setActiveNav();
  animateBars();
  initDrawer();
  wireButtons();
});
