/* =============================================
   CIET PORTAL — MAIN JAVASCRIPT
   ============================================= */

/** ---- SIDEBAR TOGGLE (Mobile) ---- */
function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

/** ---- TAB SWITCHING ---- */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
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

/** ---- FLIP CARDS ---- */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/** ---- ACTIVE NAV LINK ---- */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });
}

/** ---- ANIMATE PROGRESS BARS ---- */
function animateBars() {
  document.querySelectorAll('[data-width]').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.width;
    }, 200);
  });
}

/** ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabs();
  initFlipCards();
  setActiveNav();
  animateBars();
});
