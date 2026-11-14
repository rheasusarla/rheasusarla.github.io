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
  { src: 'assets/photos/golden-gate.jpg', caption: 'golden gate, night', alt: 'The Golden Gate Bridge lit up at night',          motion: 'twinkle' },
  { src: 'assets/photos/fog-palms.jpg',   caption: 'palms in the fog',   alt: 'A palm tree silhouetted against glowing night fog, with string lights below', motion: 'twinkle', aspect: '4 / 3', zoom: 1.15, focusY: 0.4 },
  { src: 'assets/photos/dog-grass.jpg',   caption: 'park day',           alt: 'A happy curly black-and-white dog sitting on green grass, looking up', motion: 'still', lift: 0.06, aspect: '4 / 5', zoom: 1.25, focusX: 0.48, focusY: 0.5 },
];

const gallery = document.getElementById('gallery');
PHOTOS.forEach((p, i) => {
  const fig = document.createElement('figure');
  fig.className = `shot shot-${i % 4}`;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${p.alt}, drawn in colored ASCII characters. Photo by Rhea Susarla.`);
  const cap = document.createElement('figcaption');
  cap.innerHTML = `<span class="path">~/photos/</span>${p.caption}`;
  if (p.aspect) canvas.style.aspectRatio = p.aspect;
  fig.append(canvas, cap);
  gallery.append(fig);
  AsciiBloom(canvas, { src: p.src, look: 'photo', motion: p.motion, band: p.band, lift: p.lift, zoom: p.zoom, focusX: p.focusX, focusY: p.focusY, mode: 'lens', ragged: true, revealOnView: true });
});

// ---- podcast guests --------------------------------------------------------------------------
// Every guest, newest first, pulled from the YouTube descriptions and the old Squarespace archive.
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
  { ep: 15, name: 'Rish Gupta',              role: 'founder, Spot AI',                           yt: 'XQBnP8gcIpU', key: true },
  { ep: 14, name: 'Vinaya',                  role: 'tech ethics activist',                       yt: 'SVMYETu-jVE' },
  { ep: 13, name: 'Jia Chen',                role: '2x founder, Sorcerer',                       yt: 'Mk3PQ9POfYQ' },
  { ep: 12, name: 'Somya Gupta',             role: 'founder, Context',                           yt: 'XEhBRh4P-wo' },
  { ep: 11, name: 'Dr. Osonde Osoba',        role: 'responsible AI researcher',                  yt: '4trtxbNjLSo' },
  { ep: 10, name: 'Dr. Ashley Dalrymple',    role: 'neuroscientist, brain-computer interfaces',  yt: 'pDwBoCRQhQw', key: true },
  { ep: 9,  name: 'Pavan Kumar',             role: 'founder, PocketCounselor',                   yt: 'Pjl4phPzsyY' },
  { ep: 8,  name: 'Dr. Ibrahim Karabayir',   role: 'AI for heart disease',                       yt: 'BI_KmEi3IWY' },
  { ep: 7,  name: 'Dr. Alex Hanna',          role: 'AI researcher',                              yt: 'R0gdC6zyOYw', key: true },
  { ep: 6,  name: 'Dr. Sahar Joakim',        role: 'algorithmic bias',                           yt: 'Xyj-UsOiF10' },
  { ep: 5,  name: 'Jordan Wrigley',          role: 'privacy of period-tracking apps',            yt: '4VgWAcX-cqc' },
  { ep: 4,  name: 'Dr. Brian Patrick Green', role: 'ethics of space exploration',                yt: 'bdw8VhCPi4M' },
  { ep: 2,  name: 'Divya Tadimeti',          role: 'deepfakes & voice recognition (2 parts)',    yt: '8Sc_hFcClvc' },
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

document.getElementById('year').textContent = new Date().getFullYear();
