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
  { src: 'assets/photos/beach-dog.jpg',   caption: 'beach day',          alt: 'A curly black dog lying in the sand by the waves', motion: 'ripple', band: [0, 0.18], lift: 0.3, aspect: '4 / 5', zoom: 1.3, focusY: 0.6 },
];

const gallery = document.getElementById('gallery');
PHOTOS.forEach((p, i) => {
  const fig = document.createElement('figure');
  fig.className = `shot shot-${i % 3}`;
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
