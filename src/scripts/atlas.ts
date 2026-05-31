// Canvas atlas of Mithila — zoom/pan over ~2,900 OSM villages/towns, rivers,
// district labels and curated cultural landmarks. No remote dependencies.

interface Place {
  n: string;
  a?: string;
  p: string;
  g: [number, number];
  wx?: number;
  wy?: number;
}
interface River {
  n: string;
  pts: [number, number][];
  w?: [number, number][];
}
interface Cultural {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  emoji: string;
  color: string;
  blurb: string;
  img: string | null;
  href: string | null;
  g: [number, number];
  wx?: number;
  wy?: number;
}
interface Dist {
  name: string;
  g: [number, number];
  wx?: number;
  wy?: number;
}

const LNG0 = 83.9,
  LAT1 = 27.7,
  LNGR = 4.5,
  LATR = 3.0,
  BW = 4000,
  BH = (4000 * 3.0) / 4.5;
const wX = (lng: number) => ((lng - LNG0) / LNGR) * BW;
const wY = (lat: number) => ((LAT1 - lat) / LATR) * BH;

export function initAtlas() {
  const root = document.querySelector<HTMLElement>('.atlas');
  if (!root) return;
  const canvas = root.querySelector<HTMLCanvasElement>('#atlas-canvas');
  const wrap = root.querySelector<HTMLElement>('.atlas-canvas-wrap');
  if (!canvas || !wrap) return;
  const ctx = canvas.getContext('2d')!;
  const loading = root.querySelector<HTMLElement>('#atlas-loading');

  const cultural: Cultural[] = JSON.parse(
    root.querySelector('#atlas-cultural')?.textContent || '[]'
  );
  const districts: Dist[] = JSON.parse(root.querySelector('#atlas-districts')?.textContent || '[]');
  let places: Place[] = [];
  let rivers: River[] = [];

  for (const c of cultural) {
    c.wx = wX(c.g[0]);
    c.wy = wY(c.g[1]);
  }
  for (const d of districts) {
    d.wx = wX(d.g[0]);
    d.wy = wY(d.g[1]);
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let CW = 0,
    CH = 0,
    scale = 1,
    panX = 0,
    panY = 0,
    fit = 1;
  let selKind = '',
    selRef: any = null;
  const showLayer: Record<string, boolean> = { villages: true, rivers: true, cultural: true };
  const activeTypes = new Set(cultural.map((c) => c.type));

  // Fixed cartographic palette — a light "atlas" look, independent of page theme.
  const C = {
    void: '#dde4cd',
    land: '#ece4cb',
    foothill: '#e7d9ad',
    plain: '#d6e0b7',
    bg: '#ece4cb', // label halo (matches land)
    fg: '#2c2317', // ink — town dots + labels
    muted: '#8a7c5e', // village dots + district labels
    city: '#c8341e',
    river: '#4f93ad',
    border: '#a08a5e',
  };

  function resize() {
    const r = wrap!.getBoundingClientRect();
    CW = r.width;
    CH = r.height;
    canvas!.width = Math.round(CW * dpr);
    canvas!.height = Math.round(CH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function doFit() {
    fit = Math.min(CW / BW, CH / BH) * 0.98;
    scale = fit;
    panX = (CW - BW * scale) / 2;
    panY = (CH - BH * scale) / 2;
  }
  const sx = (wx: number) => wx * scale + panX;
  const sy = (wy: number) => wy * scale + panY;

  let raf = 0;
  function schedule() {
    if (!raf) raf = requestAnimationFrame(draw);
  }

  function rectsOverlap(a: number[], b: number[]) {
    return !(a[0] + a[2] < b[0] || b[0] + b[2] < a[0] || a[1] + a[3] < b[1] || b[1] + b[3] < a[1]);
  }

  function draw() {
    raf = 0;
    const zr = scale / fit;
    ctx.clearRect(0, 0, CW, CH);
    // off-region void
    ctx.fillStyle = C.void;
    ctx.fillRect(0, 0, CW, CH);
    // land + bands
    const lx = sx(0),
      ly = sy(0),
      lw = BW * scale,
      lh = BH * scale;
    ctx.fillStyle = C.land;
    ctx.fillRect(lx, ly, lw, lh);
    ctx.fillStyle = C.foothill;
    ctx.fillRect(lx, ly, lw, wY(26.85) * scale);
    const plainTop = sy(wY(25.55));
    ctx.fillStyle = C.plain;
    ctx.fillRect(lx, plainTop, lw, ly + lh - plainTop);
    ctx.strokeStyle = C.border;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    ctx.strokeRect(lx, ly, lw, lh);
    ctx.globalAlpha = 1;
    // India–Nepal border
    ctx.strokeStyle = C.border;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    [
      [83.9, 26.55],
      [85.2, 26.7],
      [86.2, 26.72],
      [87.2, 26.64],
      [88.4, 26.48],
    ].forEach((b, i) => {
      const X = sx(wX(b[0])),
        Y = sy(wY(b[1]));
      i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    // captions
    ctx.fillStyle = C.border;
    ctx.textAlign = 'left';
    ctx.font = '700 12px Inter, system-ui, sans-serif';
    ctx.fillText('NEPAL', sx(wX(84.0)), sy(wY(26.95)));
    ctx.fillText('INDIA', sx(wX(84.0)), sy(wY(26.42)));
    ctx.globalAlpha = 0.8;
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.fillText('HIMALAYAN FOOTHILLS', sx(wX(84.0)), sy(wY(27.45)));
    ctx.fillText('GANGA PLAIN', sx(wX(84.0)), sy(wY(25.12)));
    ctx.globalAlpha = 1;

    const placed: number[][] = [];

    // rivers
    if (showLayer.rivers && rivers.length) {
      ctx.strokeStyle = C.river;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = Math.max(0.7, Math.min(zr, 6) * 0.5);
      ctx.lineJoin = 'round';
      for (const r of rivers) {
        const w = r.w!;
        // cull
        let vis = false;
        for (let i = 0; i < w.length; i += 4) {
          const x = sx(w[i][0]),
            y = sy(w[i][1]);
          if (x > -20 && x < CW + 20 && y > -20 && y < CH + 20) {
            vis = true;
            break;
          }
        }
        if (!vis) continue;
        ctx.beginPath();
        for (let i = 0; i < w.length; i++) {
          const x = sx(w[i][0]),
            y = sy(w[i][1]);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // district labels
    ctx.fillStyle = C.muted;
    ctx.globalAlpha = 0.55;
    ctx.font = `${Math.min(13 + zr, 18)}px "Tiro Devanagari Hindi", Georgia, serif`;
    ctx.textAlign = 'center';
    for (const d of districts) {
      const x = sx(d.wx!),
        y = sy(d.wy!);
      if (x < -40 || x > CW + 40 || y < -20 || y > CH + 20) continue;
      ctx.fillText(d.name.toUpperCase(), x, y);
    }
    ctx.globalAlpha = 1;

    // places
    if (showLayer.villages && places.length) {
      // dots
      for (const p of places) {
        const x = sx(p.wx!),
          y = sy(p.wy!);
        if (x < -10 || x > CW + 10 || y < -10 || y > CH + 10) continue;
        const r = p.p === 'city' ? 3.6 : p.p === 'town' ? 2.6 : 1.7;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2832);
        ctx.fillStyle = p.p === 'city' ? C.city : p.p === 'town' ? C.fg : C.muted;
        ctx.fill();
      }
      // labels (declutter, by importance)
      ctx.font = '600 11px Inter, "Noto Sans Devanagari", system-ui, sans-serif';
      ctx.textAlign = 'left';
      let count = 0;
      const order = (p: Place) => (p.p === 'city' ? 0 : p.p === 'town' ? 1 : 2);
      const sorted = places.slice().sort((a, b) => order(a) - order(b));
      for (const p of sorted) {
        if (count > 420) break;
        const thr = p.p === 'city' ? 1 : p.p === 'town' ? 2.2 : 5.5;
        if (zr < thr) continue;
        const x = sx(p.wx!),
          y = sy(p.wy!);
        if (x < 0 || x > CW || y < 0 || y > CH) continue;
        const label = p.a || p.n;
        const w = ctx.measureText(label).width;
        const rect = [x + 5, y - 7, w + 4, 13];
        let ok = true;
        for (const pr of placed) {
          if (rectsOverlap(rect, pr)) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        placed.push(rect);
        count++;
        ctx.lineWidth = 3;
        ctx.strokeStyle = C.bg;
        ctx.strokeText(label, x + 5, y + 3.5);
        ctx.fillStyle = C.fg;
        ctx.fillText(label, x + 5, y + 3.5);
      }
    }

    // cultural markers (on top)
    if (showLayer.cultural) {
      ctx.textAlign = 'center';
      for (const c of cultural) {
        if (!activeTypes.has(c.type)) continue;
        const x = sx(c.wx!),
          y = sy(c.wy!);
        if (x < -20 || x > CW + 20 || y < -20 || y > CH + 20) continue;
        const sel = selKind === 'c' && selRef === c;
        const rad = sel ? 13 : 10;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 6.2832);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.lineWidth = sel ? 3 : 2;
        ctx.strokeStyle = c.color;
        ctx.stroke();
        ctx.font = `${rad + 4}px serif`;
        ctx.fillText(c.emoji, x, y + rad / 2.6);
        // label
        ctx.font = '600 11px Inter, "Noto Sans Devanagari", system-ui, sans-serif';
        const w = ctx.measureText(c.name).width;
        const rect = [x - w / 2, y + rad + 1, w, 13];
        let ok = true;
        for (const pr of placed) {
          if (rectsOverlap(rect, pr)) {
            ok = false;
            break;
          }
        }
        if (ok || sel) {
          placed.push(rect);
          ctx.lineWidth = 3.4;
          ctx.strokeStyle = C.bg;
          ctx.strokeText(c.name, x, y + rad + 12);
          ctx.fillStyle = C.fg;
          ctx.fillText(c.name, x, y + rad + 12);
        }
      }
    }

    // selected place ring
    if (selKind === 'p' && selRef) {
      const x = sx(selRef.wx),
        y = sy(selRef.wy);
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, 6.2832);
      ctx.lineWidth = 3;
      ctx.strokeStyle = C.city;
      ctx.stroke();
    }
  }

  // ── panel ──
  const panel = root.querySelector<HTMLElement>('#atlas-panel')!;
  const def = panel.querySelector<HTMLElement>('.ap-default')!;
  const det = panel.querySelector<HTMLElement>('.ap-detail')!;
  const apImg = det.querySelector<HTMLImageElement>('.ap-img')!;
  const apType = det.querySelector<HTMLElement>('.ap-type')!;
  const apName = det.querySelector<HTMLElement>('.ap-name')!;
  const apNative = det.querySelector<HTMLElement>('.ap-native')!;
  const apBlurb = det.querySelector<HTMLElement>('.ap-blurb')!;
  const apLinks = det.querySelector<HTMLElement>('.ap-links')!;
  det.querySelector('.ap-close')!.addEventListener('click', () => {
    selKind = '';
    selRef = null;
    det.hidden = true;
    def.hidden = false;
    schedule();
  });

  function gmaps(g: [number, number]) {
    return `https://www.google.com/maps/search/?api=1&query=${g[1]},${g[0]}`;
  }
  function showCultural(c: Cultural) {
    selKind = 'c';
    selRef = c;
    def.hidden = true;
    det.hidden = false;
    det.style.setProperty('--mc', c.color);
    if (c.img) {
      apImg.src = c.img;
      apImg.alt = c.name;
      apImg.hidden = false;
    } else apImg.hidden = true;
    apType.textContent = c.typeLabel;
    apName.textContent = c.emoji + '  ' + c.name;
    apNative.hidden = true;
    apBlurb.textContent = c.blurb;
    apLinks.innerHTML =
      (c.href ? `<a href="${c.href}">Open full page →</a>` : '') +
      `<a href="${gmaps(c.g)}" target="_blank" rel="noopener">Open in Google Maps →</a>`;
    schedule();
  }
  function showPlace(p: Place) {
    selKind = 'p';
    selRef = p;
    def.hidden = true;
    det.hidden = false;
    det.style.setProperty('--mc', p.p === 'city' ? '#c8341e' : p.p === 'town' ? '#2e4374' : '#3e7c4f');
    apImg.hidden = true;
    apType.textContent = p.p === 'city' ? 'City' : p.p === 'town' ? 'Town' : 'Village';
    apName.textContent = p.n;
    if (p.a) {
      apNative.textContent = p.a;
      apNative.hidden = false;
    } else apNative.hidden = true;
    apBlurb.textContent = `A ${p.p} in the Mithila region. Search the web to learn more about its people, panchayat and traditions.`;
    apLinks.innerHTML =
      `<a href="${gmaps(p.g)}" target="_blank" rel="noopener">Open in Google Maps →</a>` +
      `<a href="https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(p.n + ' Bihar')}" target="_blank" rel="noopener">Search Wikipedia →</a>`;
    schedule();
  }

  // ── hit testing ──
  function hit(cx: number, cy: number) {
    // cultural first
    let best: any = null,
      bestD = 16 * 16;
    for (const c of cultural) {
      if (!activeTypes.has(c.type) || !showLayer.cultural) continue;
      const dx = sx(c.wx!) - cx,
        dy = sy(c.wy!) - cy;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    if (best) {
      showCultural(best);
      return;
    }
    if (showLayer.villages) {
      let bp: any = null,
        bd = 10 * 10;
      for (const p of places) {
        const dx = sx(p.wx!) - cx,
          dy = sy(p.wy!) - cy;
        const d = dx * dx + dy * dy;
        if (d < bd) {
          bd = d;
          bp = p;
        }
      }
      if (bp) showPlace(bp);
    }
  }

  // ── interaction ──
  // Track every active pointer so we can support one-finger pan AND two-finger
  // pinch-zoom on touch devices (the canvas has touch-action:none, so the
  // browser hands us the raw gestures and we implement them ourselves).
  const pointers = new Map<number, { x: number; y: number }>();
  let dragging = false,
    moved = false,
    lastX = 0,
    lastY = 0,
    pinchDist = 0,
    pinchCx = 0,
    pinchCy = 0;

  const localXY = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const midpoint = () => {
    const pts = Array.from(pointers.values());
    const r = canvas.getBoundingClientRect();
    return {
      d: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
      cx: (pts[0].x + pts[1].x) / 2 - r.left,
      cy: (pts[0].y + pts[1].y) / 2 - r.top,
    };
  };

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      dragging = true;
      moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.classList.add('grabbing');
    } else if (pointers.size === 2) {
      // second finger down → start a pinch, stop single-finger panning
      dragging = false;
      moved = true;
      const m = midpoint();
      pinchDist = m.d;
      pinchCx = m.cx;
      pinchCy = m.cy;
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size >= 2) {
      // pinch: zoom by the change in finger distance, pan by midpoint drift
      const m = midpoint();
      if (pinchDist > 0) zoomAt(m.cx, m.cy, m.d / pinchDist);
      panX += m.cx - pinchCx;
      panY += m.cy - pinchCy;
      pinchDist = m.d;
      pinchCx = m.cx;
      pinchCy = m.cy;
      schedule();
    } else if (dragging) {
      const dx = e.clientX - lastX,
        dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      panX += dx;
      panY += dy;
      lastX = e.clientX;
      lastY = e.clientY;
      schedule();
    }
  });

  const endPointer = (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) return;
    const wasTap = !moved && pointers.size === 1;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (pointers.size === 1) {
      // one finger remains → resume panning from it
      const p = Array.from(pointers.values())[0];
      dragging = true;
      lastX = p.x;
      lastY = p.y;
    } else if (pointers.size === 0) {
      dragging = false;
      canvas.classList.remove('grabbing');
      if (wasTap) {
        const { x, y } = localXY(e);
        hit(x, y);
      }
    }
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const cx = e.clientX - r.left,
        cy = e.clientY - r.top;
      zoomAt(cx, cy, Math.exp(-e.deltaY * 0.0016));
    },
    { passive: false }
  );
  function zoomAt(cx: number, cy: number, factor: number) {
    const ns = Math.max(fit * 0.85, Math.min(fit * 45, scale * factor));
    const wx = (cx - panX) / scale,
      wy = (cy - panY) / scale;
    scale = ns;
    panX = cx - wx * scale;
    panY = cy - wy * scale;
    schedule();
  }
  root.querySelector('#z-in')!.addEventListener('click', () => zoomAt(CW / 2, CH / 2, 1.5));
  root.querySelector('#z-out')!.addEventListener('click', () => zoomAt(CW / 2, CH / 2, 0.66));
  root.querySelector('#z-reset')!.addEventListener('click', () => {
    doFit();
    schedule();
  });

  function flyTo(wx: number, wy: number, targetZr: number) {
    const ns = fit * targetZr;
    const tpx = CW / 2 - wx * ns,
      tpy = CH / 2 - wy * ns;
    const s0 = scale,
      px0 = panX,
      py0 = panY,
      t0 = performance.now(),
      dur = 450;
    function step(t: number) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      scale = s0 + (ns - s0) * e;
      panX = px0 + (tpx - px0) * e;
      panY = py0 + (tpy - py0) * e;
      draw();
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── search ──
  const q = root.querySelector<HTMLInputElement>('#atlas-q')!;
  const results = root.querySelector<HTMLUListElement>('#atlas-results')!;
  function search() {
    const v = q.value.trim().toLowerCase();
    if (v.length < 2) {
      results.hidden = true;
      results.innerHTML = '';
      return;
    }
    const hits: { label: string; meta: string; wx: number; wy: number; sel: () => void }[] = [];
    for (const c of cultural) {
      if (c.name.toLowerCase().includes(v))
        hits.push({ label: c.emoji + ' ' + c.name, meta: c.typeLabel, wx: c.wx!, wy: c.wy!, sel: () => showCultural(c) });
    }
    for (const p of places) {
      if (hits.length > 60) break;
      if (p.n.toLowerCase().includes(v) || (p.a && p.a.includes(v)))
        hits.push({ label: p.a ? `${p.n} · ${p.a}` : p.n, meta: p.p, wx: p.wx!, wy: p.wy!, sel: () => showPlace(p) });
    }
    hits.sort((a, b) => a.label.toLowerCase().indexOf(v) - b.label.toLowerCase().indexOf(v));
    const top = hits.slice(0, 24);
    results.innerHTML = top
      .map((h, i) => `<li data-i="${i}"><span>${h.label}</span><span class="r-meta">${h.meta}</span></li>`)
      .join('');
    results.hidden = top.length === 0;
    Array.from(results.children).forEach((li, i) => {
      li.addEventListener('click', () => {
        const h = top[i];
        results.hidden = true;
        flyTo(h.wx, h.wy, 14);
        h.sel();
      });
    });
  }
  let st: any;
  q.addEventListener('input', () => {
    clearTimeout(st);
    st = setTimeout(search, 120);
  });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = results.querySelector('li');
      if (first) (first as HTMLElement).click();
    }
  });
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.atlas-search')) results.hidden = true;
  });

  // ── layer + type toggles ──
  root.querySelectorAll<HTMLButtonElement>('.lyr').forEach((b) => {
    b.addEventListener('click', () => {
      const l = b.dataset.layer!;
      showLayer[l] = !showLayer[l];
      b.classList.toggle('active', showLayer[l]);
      schedule();
    });
  });
  root.querySelectorAll<HTMLButtonElement>('.chip').forEach((b) => {
    b.addEventListener('click', () => {
      const t = b.dataset.filter!;
      if (activeTypes.has(t)) {
        activeTypes.delete(t);
        b.classList.remove('active');
      } else {
        activeTypes.add(t);
        b.classList.add('active');
      }
      schedule();
    });
  });

  // (map uses a fixed cartographic palette, so it does not follow the page theme)

  const ro = new ResizeObserver(() => {
    // Recompute the projection on every size change — keeping the world point
    // at the canvas centre and the current zoom ratio. Without this the map
    // goes stale whenever the canvas resizes; on mobile the URL bar shows/hides
    // on scroll (changing 60vh constantly), which left the map shifted, letter-
    // boxed or clustered. Preserving centre+zoom re-fits without jarring the view.
    const hadView = CW > 0 && CH > 0 && fit > 0;
    const cxw = hadView ? (CW / 2 - panX) / scale : 0;
    const cyw = hadView ? (CH / 2 - panY) / scale : 0;
    const zr = hadView ? scale / fit : 1;
    resize();
    if (hadView) {
      fit = Math.min(CW / BW, CH / BH) * 0.98;
      scale = fit * zr;
      panX = CW / 2 - cxw * scale;
      panY = CH / 2 - cyw * scale;
    } else {
      doFit();
    }
    schedule();
  });
  ro.observe(wrap);

  // ── load data ──
  Promise.all([
    fetch('/data/mithila-places.json').then((r) => r.json()),
    fetch('/data/mithila-rivers.json').then((r) => r.json()),
  ])
    .then(([pj, rj]) => {
      places = pj.places || [];
      for (const p of places) {
        p.wx = wX(p.g[0]);
        p.wy = wY(p.g[1]);
      }
      rivers = rj.rivers || [];
      for (const r of rivers) r.w = r.pts.map((pt) => [wX(pt[0]), wY(pt[1])] as [number, number]);
      const cnt = root.querySelector('#ap-count');
      if (cnt) cnt.textContent = places.length.toLocaleString() + '+';
      if (loading) loading.hidden = true;
      resize();
      doFit();
      draw();
    })
    .catch(() => {
      if (loading) loading.textContent = 'Could not load map data.';
    });

  resize();
  doFit();
  draw();
  if ((document as any).fonts?.ready) (document as any).fonts.ready.then(() => schedule());
}
