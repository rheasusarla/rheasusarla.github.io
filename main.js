// Page wiring. The rendering itself lives in ascii-bloom.js.

// ---- header bouquet ------------------------------------------------------------------------
// To use a different photo, change src and update aspect-ratio on .bouquet in style.css.
const bouquet = AsciiBloom(document.getElementById('bouquet'), {
  src: 'assets/flowers.webp', look: 'flowers', motion: 'sway', mode: 'lens',
  focusX: 0.33, // keeps the flowers in frame on narrow screens
});
document.getElementById('replay').addEventListener('click', () => bouquet.replay());

// ---- photography ---------------------------------------------------------------------------
// One entry per photo. Drop the file in assets/photos/ and add a line here.
//   motion: 'ripple' (water moves; band = which part of the frame is water, 0 = top, 1 = bottom)
//           'twinkle' (bright lights flicker) · 'sway' (wind from the top) · 'still' (only shimmer)
//   lift:   0–0.3, brightens dark areas so a dark subject stays visible
//   aspect: shape of the piece (default '3 / 2'); zoom / focusX / focusY crop in on the subject
const PHOTOS = [
  { src: 'assets/photos/tidepools.jpg',   caption: 'tidepools',          alt: 'Waves breaking beyond mossy tidepool rocks',      motion: 'ripple', band: [0.28, 0.58] },
  { src: 'assets/photos/golden-gate.jpg', caption: 'shinygoldengate',    alt: 'The Golden Gate Bridge lit up at night',          motion: 'twinkle' },
  { src: 'assets/photos/fog-palms.jpg',   caption: 'foggysanluisobispo', alt: 'A palm tree silhouetted against glowing night fog, with string lights below', motion: 'twinkle', aspect: '4 / 3', zoom: 1.15, focusY: 0.4 },
];

const gallery = document.getElementById('gallery');
PHOTOS.forEach((p, i) => {
  const fig = document.createElement('figure');
  fig.className = `shot shot-${i % 3}`;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${p.alt}, drawn in colored ASCII characters. Photo by Rhea Susarla.`);
  const cap = document.createElement('figcaption');
  cap.innerHTML = `<span class="path">~/photography/</span>${p.caption}`;
  if (p.aspect) canvas.style.aspectRatio = p.aspect;
  fig.append(canvas, cap);
  gallery.append(fig);
  AsciiBloom(canvas, { src: p.src, look: 'photo', motion: p.motion, band: p.band, lift: p.lift, zoom: p.zoom, focusX: p.focusX, focusY: p.focusY, mode: 'lens', ragged: true, revealOnView: true });
});

// ---- podcast guests --------------------------------------------------------------------------
// Every episode and its guest, newest first, pulled from the YouTube descriptions and the old Squarespace archive.
// key: true = shown under "featured guests". Everyone appears in the "all guests" list.
// yt = the YouTube video id (the part after watch?v=).
const GUESTS = [
  { ep: 29, name: 'Dr. Michael Littman',     role: 'Associate Provost for AI, Brown University', yt: 'IORuQstCVlQ', key: true },
  { ep: 28, name: 'Pranay',                  role: 'co-founder, Tova',                           yt: 'py7SsLXnbJs' },
  { ep: 27, name: 'Thorin Klosowski',        role: 'security & privacy activist, EFF',           yt: 'yin0f75rRv8', key: true },
  { ep: 26, name: 'Jonathan Thomas-Palmer',  role: 'Mr. P of Flipping Physics',                  yt: '7xQFu5tx3vU', key: true },
  { ep: 25, name: 'Sarah Phillips',          role: 'CEO, Girls Into VC',                         yt: 'qV-0V2UUR48', key: true },
  { ep: 24, name: 'Grace Yacobe',            role: 'founder, Mezzo Biotech',                     yt: 'bJviJvoH1mU' },
  { ep: 23, name: 'Sune Selsbæk-Reitz',      role: 'tech philosopher',                           yt: 'HKK4ZvlCmxI' },
  { ep: 22, name: 'Reed Nocera & Rex Zhang', role: 'author of Internal Leadership; creator',     yt: '2RSRXW4RAsY' },
  { ep: 21, name: 'Aaryan Parikh',           role: 'co-founder, Stellar Learning',               yt: '_NdhSBE5epA' },
  { ep: 20, name: 'Jill',                    role: 'founder, Mocktail',                          yt: 'iIqUqxmASNs' },
  { ep: 19, name: 'Karen Zeigler',           role: 'CEO, The Human Score',                       yt: 'WfTyKqpKcNQ' },
  { ep: 18, name: 'Jagan',                   role: 'founder, EduVerse',                          yt: 'wxYWEhuyq3w' },
  { ep: 17, name: 'Srinidhi Karthik',        role: '2025 ISEF finalist',                         yt: 'MumaJ6Czb9M' },
  { ep: 16, name: 'Dr. Don Heider',          role: 'chief executive, Markkula Center for Applied Ethics', yt: 'I_VqpPPDef8' },
  { ep: 15, name: 'Rish Gupta',              role: 'founder, Spot AI',                           yt: 'XQBnP8gcIpU' },
  { ep: 14, name: 'Vinaya',                  role: 'tech ethics activist',                       yt: 'SVMYETu-jVE' },
  { ep: 13, name: 'Jia Chen',                role: '2x founder, Jam',                            yt: 'Mk3PQ9POfYQ', key: true },
  { ep: 12, name: 'Somya Gupta',             role: 'founder, Context',                           yt: 'XEhBRh4P-wo' },
  { ep: 11, name: 'Dr. Osonde Osoba',        role: 'responsible AI researcher',                  yt: '4trtxbNjLSo' },
  { ep: 10, name: 'Dr. Ashley Dalrymple',    role: 'neuroscientist, brain-computer interfaces',  yt: 'pDwBoCRQhQw', key: true },
  { ep: 9,  name: 'Pavan Kumar',             role: 'founder, PocketCounselor',                   yt: 'Pjl4phPzsyY' },
  { ep: 8,  name: 'Dr. Ibrahim Karabayir',   role: 'AI for heart disease',                       yt: 'BI_KmEi3IWY' },
  { ep: 7,  name: 'Dr. Alex Hanna',          role: 'AI researcher',                              yt: 'R0gdC6zyOYw', key: true },
  { ep: 6,  name: 'Dr. Sahar Joakim',        role: 'algorithmic bias',                           yt: 'Xyj-UsOiF10' },
  { ep: 5,  name: 'Jordan Wrigley',          role: 'privacy of period-tracking apps',            yt: '4VgWAcX-cqc' },
  { ep: 4,  name: 'Dr. Brian Patrick Green', role: 'ethics of space exploration',                yt: 'bdw8VhCPi4M' },
  { ep: 3,  name: 'Divya Tadimeti',          role: 'ethics of voice recognition (part 2)',       yt: 'yF8x2DDjvfE' },
  { ep: 2,  name: 'Divya Tadimeti',          role: 'ethics of deepfakes (part 1)',               yt: '8Sc_hFcClvc' },
  { ep: 1,  name: 'Dr. Ann Cavoukian',       role: 'creator of Privacy by Design',               yt: 'WxL8nsbZCYY', key: true },
];
const guestLink = (g) => `<a href="https://www.youtube.com/watch?v=${g.yt}">${g.name}</a>`;
document.getElementById('guests-key').innerHTML = GUESTS.filter((g) => g.key)
  .map((g) => `<li>${guestLink(g)} <span>${g.role}</span></li>`).join('');
document.getElementById('guests-all').innerHTML = GUESTS
  .map((g) => `<li><span class="ep">${g.ep ? 'EP.' + String(g.ep).padStart(3, '0') : 'EP.---'}</span>${guestLink(g)} <span class="muted">· ${g.role}</span></li>`).join('');
document.getElementById('guest-count').textContent = GUESTS.length;

// ---- ~/stalk-me icons: a quick hand-typed scramble on hover ------------------------------------
const GLYPHS = '#%&*+=<>/\\|~:;.';
document.querySelectorAll('.icon pre').forEach((pre) => {
  const art = pre.textContent;
  let timer;
  pre.parentElement.addEventListener('pointerenter', () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(timer);
    let n = 0;
    timer = setInterval(() => {
      n++;
      pre.textContent = [...art].map((c) => (c === ' ' || c === '\n' || Math.random() < n / 6) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (n >= 6) { clearInterval(timer); pre.textContent = art; }
    }, 45);
  });
});

// ---- pixel dust: hover a button with data-dust="color,color,..." -------------------------------
// A ring of square pixels ripples out from the button's edge, then a little dust drifts up and fades.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const PX = 3;                       // pixel size; everything snaps to this grid
  const cv = document.createElement('canvas');
  cv.className = 'dust';
  document.body.append(cv);
  const ctx = cv.getContext('2d');
  let parts = [], running = false;
  const size = () => { const d = devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener('resize', size);

  function burst(el) {
    const r = el.getBoundingClientRect(), colors = el.dataset.dust.split(',');
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const pick = () => colors[(Math.random() * colors.length) | 0];
    // ripple: pixels start on the button's outline and all travel outward at the same pace
    const n = Math.round((r.width + r.height) / 5);
    for (let i = 0; i < n; i++) {
      const t = i / n * 2 * (r.width + r.height);
      let x, y;
      if (t < r.width) { x = r.left + t; y = r.top; }
      else if (t < r.width + r.height) { x = r.right; y = r.top + t - r.width; }
      else if (t < 2 * r.width + r.height) { x = r.right - (t - r.width - r.height); y = r.bottom; }
      else { x = r.left; y = r.bottom - (t - 2 * r.width - r.height); }
      const a = Math.atan2((y - cy) / r.height, (x - cx) / r.width);
      parts.push({ x, y, vx: Math.cos(a) * 85, vy: Math.sin(a) * 85, g: 0, life: 0.55, age: 0, c: pick(), ring: true });
      // a fainter second ring a beat later, every other pixel
      if (i % 2 === 0) parts.push({ x, y, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, g: 0, life: 0.5, age: -0.14, c: pick(), ring: true });
    }
    // dust: a looser scatter that floats up, sparkles and falls away
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, sp = 30 + Math.random() * 90;
      parts.push({ x: cx + (Math.random() - 0.5) * r.width, y: cy + (Math.random() - 0.5) * r.height,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6 - 60, g: 140, life: 0.6 + Math.random() * 0.6, age: -Math.random() * 0.12, c: pick() });
    }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }

  let last = 0;
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => (p.age += dt) < p.life);
    for (const p of parts) {
      if (p.age < 0) continue;
      p.vy += p.g * dt; p.vx *= 0.97; p.x += p.vx * dt; p.y += p.vy * dt;
      const k = 1 - p.age / p.life;
      // flicker on/off a little, like old pixel sparkles
      if (!p.ring && Math.random() < 0.18) continue;
      ctx.globalAlpha = p.ring ? k * 0.9 : k;
      ctx.fillStyle = p.c;
      const s = p.ring ? PX - 1 : (k > 0.6 ? PX : PX - 1);
      ctx.fillRect(Math.round(p.x / PX) * PX, Math.round(p.y / PX) * PX, s, s);
    }
    ctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  document.querySelectorAll('[data-dust]').forEach((el) => {
    let cool = 0;
    const go = () => { const t = performance.now(); if (t - cool < 400) return; cool = t; burst(el); };
    el.addEventListener('pointerenter', go);
    el.addEventListener('focus', go);
  });
})();

document.getElementById('year').textContent = new Date().getFullYear();
