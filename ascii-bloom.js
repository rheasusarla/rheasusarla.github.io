// ascii-bloom.js — turns a photo into living, colored ASCII.
//
//   AsciiBloom(canvas, {
//     src:    'assets/photos/x.jpg',
//     look:   'flowers' | 'photo',      // flowers: sky -> night, flowers glow. photo: true colors, darks drop out
//     motion: 'sway' | 'ripple' | 'twinkle' | 'still',
//     band:   [0.3, 0.6],               // ripple only: which rows (0 = top, 1 = bottom) are water
//     mode:   'lens' | 'wipe' | 'plain',// lens: the real photo shows through a circle under the cursor
//     ragged: true,                     // patchy, organic edges instead of a rectangle
//     lift:   0.15,                     // photo only: brighten the darkest tones so dark subjects show
//     focusX: 0.5, focusY: 0.5,         // where to center the crop when the canvas shape differs from the photo
//     zoom:   1,                        // >1 crops in tighter around the focus point
//     revealOnView: true,               // start the type-in when it scrolls into view
//   })
//
// Every glyph takes its color from the real pixel underneath it. Cells are "typed in" on
// first view, then each one re-picks its glyph at its own moment, so the surface shimmers.
(function () {
  const RAMP = " .'`^,:;Il!i~+-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  const FPS = 12;

  function hash(x, y, s) {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(s, 982451653);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  // smooth value noise, used for the patchy edges
  function noise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  function hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  }

  // ---- looks: pixel -> { r, g, b, lum, star } or null for empty ----------------------------
  // 'flowers': pale sky becomes night, flowers glow pink/orange, leaves sit back in deep green.
  function lookFlowers(r, g, b) {
    const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255, c = max - min;
    const h = hsl(r, g, b)[0];
    if ((max > 0.78 && c < 0.22) || max > 0.93 || (h > 180 && h < 275 && max > 0.45)) return { star: true };
    let S, L;
    if (c > 0.18 && (h < 50 || h > 285)) { S = 0.92; L = Math.min(0.8, 0.38 + max * 0.42); }
    else if (c < 0.08) { S = 0.15; L = max * 0.3; }
    else { S = Math.min(0.85, 0.45 + c * 1.4); L = Math.min(0.5, 0.1 + max * 0.42); }
    if (L < 0.06) return null;
    return { css: (k) => `hsl(${h | 0} ${(S * 100) | 0}% ${(Math.min(0.92, L * k) * 100) | 0}%)`, lum: L, dense: 0.45 + L * 0.7 };
  }

  // 'photo': true colors with a little extra saturation; the darkest areas drop out to the page.
  // lift (0..0.3) raises the darkest tones so a dark subject (a black dog!) stays visible.
  function lookPhoto(r, g, b, lift) {
    if (lift) { const k = lift * 255; r += k * (1 - r / 255); g += k * (1 - g / 255); b += k * (1 - b / 255) + k * 0.15; }
    const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
    if (lum < 0.11) return null;
    // pale, colorless areas (overcast sky, sea haze) become a faint sparse texture,
    // so the subject carries the picture instead of a wall of white glyphs
    const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    if (lum > 0.55 && chroma < 0.16) {
      const a = 0.28;
      return { css: (k) => `rgba(${r},${g},${b},${Math.min(1, a * k)})`, lum: 0.2, dense: 0.12 + (lum - 0.55) * 0.5, haze: true };
    }
    const gray = lum * 255, boost = 1.45, dim = 0.88;
    r = Math.max(0, Math.min(255, (gray + (r - gray) * boost) * dim));
    g = Math.max(0, Math.min(255, (gray + (g - gray) * boost) * dim));
    b = Math.max(0, Math.min(255, (gray + (b - gray) * boost) * dim));
    return { css: (k) => `rgb(${Math.min(255, r * k) | 0},${Math.min(255, g * k) | 0},${Math.min(255, b * k) | 0})`, lum, dense: 0.2 + lum * 0.95 };
  }

  window.AsciiBloom = function (canvas, opts) {
    const mode = opts.mode || 'plain';
    const look = opts.look === 'photo' ? (r, g, b) => lookPhoto(r, g, b, opts.lift || 0) : lookFlowers;
    const motion = opts.motion || 'sway';
    const band = opts.band || [0, 1];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const img = new Image();
    img.src = opts.src;

    const st = { pointer: { x: -1, y: -1, over: false }, lensR: 0, wipe: 0.5, dragging: false, start: Infinity, frame: 0, ready: false };

    function setup() {
      const dpr = devicePixelRatio || 1, rect = canvas.getBoundingClientRect();
      st.w = rect.width; st.h = rect.height;
      canvas.width = st.w * dpr; canvas.height = st.h * dpr;
      const ctx = (st.ctx = canvas.getContext('2d'));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.font = Math.max(6, Math.min(9, st.w / 190));
      ctx.font = `600 ${st.font}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      st.cw = ctx.measureText('M').width;
      st.ch = st.font * 1.12;
      st.cols = Math.floor(st.w / st.cw);
      st.rows = Math.floor(st.h / st.ch);
      const { cols, rows } = st;

      // sample the photo at 2x the character grid so motion can move in sub-cell steps
      const off = document.createElement('canvas');
      off.width = cols * 2; off.height = rows * 2;
      const octx = off.getContext('2d', { willReadFrequently: true });
      // crop the photo to fill the canvas ("cover"), centered on focusX (0 = left, 1 = right)
      // zoom > 1 crops in tighter around (focusX, focusY)
      const ca = st.w / st.h, iw = img.naturalWidth, ih = img.naturalHeight;
      const fx = opts.focusX ?? 0.5, fy = opts.focusY ?? 0.5, z = opts.zoom || 1;
      if (ca < iw / ih) { st.sh = ih; st.sw = ih * ca; } else { st.sw = iw; st.sh = iw / ca; }
      st.sw /= z; st.sh /= z;
      st.sx = Math.max(0, Math.min(iw - st.sw, iw * fx - st.sw / 2));
      st.sy = Math.max(0, Math.min(ih - st.sh, ih * fy - st.sh / 2));
      octx.drawImage(img, st.sx, st.sy, st.sw, st.sh, 0, 0, off.width, off.height);
      st.px = octx.getImageData(0, 0, off.width, off.height).data;
      st.pw = off.width;

      // edge: 1 = fully drawn, 0 = empty. Ragged edges eat into the rectangle with noise,
      // so each piece has its own coastline and a few stray fragments.
      st.edge = new Float32Array(cols * rows).fill(1);
      if (opts.ragged) {
        const seed = Math.floor(hash(cols, rows, opts.src.length) * 1000);
        const margin = Math.min(cols, rows * (st.ch / st.cw)) * 0.3;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const ex = Math.min(x, cols - 1 - x), ey = Math.min(y, rows - 1 - y) * (st.ch / st.cw);
          const d = Math.min(1, Math.min(ex, ey) / margin);
          const n = noise(x / 7, y / 4, seed) * 0.65 + noise(x / 2.5, y / 1.5, seed + 1) * 0.35;
          const v = d * 1.3 + (n - 0.5) * 1.5 - 0.4;
          st.edge[y * cols + x] = v <= 0 ? 0 : Math.min(1, v * 2.2);
        }
      }

      // reveal: when each cell appears
      st.reveal = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        let r;
        if (opts.look === 'photo') {
          // blooms out from the middle, with a ragged front
          const dx = (x - cols / 2) / cols, dy = (y - rows / 2) / rows;
          r = Math.hypot(dx, dy) * 2.4 + hash(x, y, 5) * 0.6;
        } else {
          // flowers: leaves typed bottom-up first, then the flowers open
          const i = ((y * 2 + 1) * st.pw + x * 2 + 1) * 4;
          const max = Math.max(st.px[i], st.px[i + 1], st.px[i + 2]) / 255, min = Math.min(st.px[i], st.px[i + 1], st.px[i + 2]) / 255;
          const h = hsl(st.px[i], st.px[i + 1], st.px[i + 2])[0];
          const flower = max - min > 0.18 && (h < 50 || h > 285);
          r = flower ? 1.6 + hash(x, y, 9) * 1.4 : (1 - y / rows) * 1.7 + hash(x, y, 5) * 0.5;
        }
        st.reveal[y * cols + x] = r;
      }
      st.ready = true;
    }

    function offset(x, y, t) {
      if (reduce) return 0;
      if (motion === 'sway') return Math.sin(t * 0.9 + y * 0.07 + x * 0.015) * 2.2 * Math.pow(1 - y / st.rows, 1.6);
      if (motion === 'ripple') {
        const fy = y / st.rows;
        if (fy < band[0] || fy > band[1]) return 0;
        const k = Math.sin(((fy - band[0]) / (band[1] - band[0])) * Math.PI); // strongest mid-band
        return Math.sin(t * 1.6 - y * 0.45 + Math.sin(x * 0.05 + t * 0.5)) * 1.8 * k;
      }
      return 0;
    }

    function draw(t) {
      const { ctx, cols, rows, cw, ch, px, pw } = st;
      const age = reduce ? 99 : t - st.start;
      ctx.clearRect(0, 0, st.w, st.h);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const ci = y * cols + x;
          const edge = st.edge[ci];
          if (edge === 0) continue;
          const reveal = st.reveal[ci];
          if (age < reveal) continue;

          const sx = Math.max(0, Math.min(pw - 1, Math.round(x * 2 + 1 + offset(x, y, t))));
          const i = ((y * 2 + 1) * pw + sx) * 4;
          const p = look(px[i], px[i + 1], px[i + 2]);
          if (!p) continue;
          if (p.haze && hash(x, y, 11) < 0.45) continue;   // leave gaps in the haze
          if (p.star) {
            if (hash(x, y, 3) > 0.997) { ctx.fillStyle = `rgba(255,250,235,${(0.3 + 0.5 * hash(x, y, Math.floor(t * 2))) * edge})`; ctx.fillText('.', x * cw, y * ch); }
            continue;
          }

          const boil = Math.floor(st.frame / 5 + hash(x, y, 1) * 5);
          let gi = Math.floor(p.dense * (RAMP.length - 1) + (hash(x, y, boil) - 0.5) * 22);
          gi = Math.max(p.haze ? 1 : 8, Math.min(RAMP.length - 1, gi));
          let glyph = RAMP[gi];

          // brightness multiplier: fades at ragged edges, flashes as a cell is typed, twinkles
          let k = 0.35 + 0.65 * edge;
          if (age - reveal < 0.25) k *= 1.7;
          if (motion === 'twinkle' && p.lum > 0.55) {
            const tw = hash(x, y, Math.floor(t * 3 + hash(x, y, 2) * 3));
            k *= 0.7 + tw * 0.6;
            if (tw > 0.93) glyph = '*';
          }
          ctx.fillStyle = p.css(k);
          ctx.fillText(glyph, x * cw, y * ch);
        }
      }

      if (mode === 'lens') {
        const target = st.pointer.over ? Math.min(110, Math.max(60, st.w * 0.14)) : 0;
        st.lensR += (target - st.lensR) * 0.35;
        if (st.lensR > 1) {
          ctx.save();
          ctx.beginPath(); ctx.arc(st.pointer.x, st.pointer.y, st.lensR, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(img, st.sx, st.sy, st.sw, st.sh, 0, 0, cols * cw, rows * ch);
          ctx.restore();
          ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(st.pointer.x, st.pointer.y, st.lensR, 0, Math.PI * 2); ctx.stroke();
        }
      }

      if (mode === 'wipe') {
        const sx = st.wipe * st.w;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, sx, st.h); ctx.clip();
        ctx.drawImage(img, st.sx, st.sy, st.sw, st.sh, 0, 0, cols * cw, rows * ch);
        ctx.restore();
        ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(sx - 1, 0, 2, st.h);
        ctx.beginPath(); ctx.arc(sx, st.h / 2, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.font = `600 12px "IBM Plex Mono", monospace`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        ctx.fillText('<>', sx, st.h / 2 + 1);
        ctx.textAlign = 'start'; ctx.textBaseline = 'top'; ctx.font = `600 ${st.font}px "IBM Plex Mono", ui-monospace, monospace`;
      }
    }

    // ---- input ---------------------------------------------------------------------------
    function pos(e) { const r = canvas.getBoundingClientRect(); st.pointer.x = e.clientX - r.left; st.pointer.y = e.clientY - r.top; }
    canvas.addEventListener('pointermove', (e) => { pos(e); st.pointer.over = true; if (st.dragging) st.wipe = Math.max(0, Math.min(1, st.pointer.x / st.w)); });
    canvas.addEventListener('pointerleave', () => { st.pointer.over = false; });
    canvas.addEventListener('pointerdown', (e) => {
      pos(e);
      if (mode === 'wipe') { st.dragging = true; canvas.setPointerCapture(e.pointerId); st.wipe = st.pointer.x / st.w; }
      if (e.pointerType !== 'mouse') st.pointer.over = true;   // phones: press and hold to see the photo
    });
    const lift = (e) => { st.dragging = false; if (e.pointerType !== 'mouse') st.pointer.over = false; };
    canvas.addEventListener('pointerup', lift);
    canvas.addEventListener('pointercancel', lift);

    // ---- loop ----------------------------------------------------------------------------
    let last = 0;
    function loop(now) {
      requestAnimationFrame(loop);
      if (!st.ready || !st.visible || now - last < 1000 / FPS) return;   // pause while off-screen
      last = now; st.frame++;
      draw(now / 1000);
    }

    st.visible = !('IntersectionObserver' in window);
    const begin = () => { if (st.start === Infinity) st.start = performance.now() / 1000; };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; if (e.isIntersecting && opts.revealOnView) begin(); }, { threshold: 0.15 }).observe(canvas);
    }

    const go = () => {
      setup();
      if (!opts.revealOnView) begin();
      if (reduce) { st.start = 0; draw(0); } else requestAnimationFrame(loop);
      let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { setup(); if (reduce) draw(0); }, 150); });
    };
    Promise.all([img.decode ? img.decode() : new Promise((r) => (img.onload = r)), document.fonts ? document.fonts.ready : 0]).then(go);

    return { replay() { st.start = performance.now() / 1000; } };
  };
})();
