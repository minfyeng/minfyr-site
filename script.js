// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ─── Theme toggle ──────────────────────────────────────────────────────
const root = document.documentElement;
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (saved === 'light' || (!saved && !prefersDark)) root.setAttribute('data-theme', 'light');

document.getElementById('themeToggle').addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  if (isLight) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// ─── Mobile hamburger ──────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── Scroll reveal ─────────────────────────────────────────────────────
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── Nav scroll-spy ────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');
const scrollSpy = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav__links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => scrollSpy.observe(s));

// ─── Terminal typewriter animation ────────────────────────────────────
const termCmd    = document.getElementById('termCmd');
const termCursor = document.getElementById('termCursor');
const termOutput = document.getElementById('termOutput');

const CMD = '/minfyr:plan sow.md';

const LINES = [
  `<span class="t-ok">✓</span> <span class="t-key">ingesting brief </span><span class="t-val">sow.md</span>`,
  `<span class="t-ok">✓</span> <span class="t-key">Plan      </span><span class="t-val">→ product-spec.md signed</span>`,
  `<span class="t-ok">✓</span> <span class="t-key">UX        </span><span class="t-val">→ mockups deployed</span>`,
  `<span class="t-ok">✓</span> <span class="t-key">Spec      </span><span class="t-val">→ api-contract.yaml locked</span>`,
  `<span class="t-ok">✓</span> <span class="t-key">Backlog   </span><span class="t-val">→ 24 tickets → Jira</span>`,
  `<span class="t-ok">✓</span> <span class="t-key">Scaffold  </span><span class="t-val">→ 4 repos created</span>`,
  `<span class="t-fin">◆</span> <span class="t-key">Build     </span><span class="t-val">→ /minfyr:implement-feature</span>`,
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runTerminal() {
  // clear
  termCmd.textContent = '';
  termOutput.innerHTML = '';
  termCursor.classList.remove('hidden');

  // type command
  for (let i = 0; i < CMD.length; i++) {
    termCmd.textContent += CMD[i];
    await sleep(55 + Math.random() * 30);
  }

  // pause after typing
  await sleep(600);
  termCursor.classList.add('hidden');

  // show output lines
  for (const html of LINES) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = html;
    termOutput.appendChild(line);
    // force reflow then show
    void line.offsetWidth;
    line.classList.add('show');
    await sleep(380);
  }

  // hold then restart
  await sleep(3800);
  await runTerminal();
}

// Start terminal on page load
runTerminal();
