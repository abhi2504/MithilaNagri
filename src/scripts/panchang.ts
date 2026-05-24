// Client logic for the Maithili Panchang hub: a "today" / day-detail card, a
// day stepper, a month calendar, and category filtering of the year's events.
// Daily astronomical data is fetched from /data/panchang-<year>.json (built by
// scripts/gen-panchang.mjs); the curated events/muhurat/windows are embedded
// in the page as JSON. Designed to be legible and simple to operate.

interface Day {
  d: string; wd: string; wdDev: string; sr: string; ss: string;
  pak: string; pakEn: string; tithi: string; tithiEn: string; tEnd: string; tNext: boolean;
  nak: string; nakEn: string; nEnd: string; nNext: boolean;
  yoga: string; karana: string; masaEn: string; sm: string; smEn: string;
}
interface Ev { date: string; endDate?: string; en: string; dev?: string; note?: string; link?: string; major?: boolean; cat: string; }
interface Muh { key: string; en: string; dev: string; emoji: string; blurb: string; dates: string[]; link?: string; }
interface Win { kind: string; start: string; end: string; en: string; dev: string; note: string; }

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WD_DEV = ['रवि', 'सोम', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि'];
const WD_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n: number) => String(n).padStart(2, '0');
const jget = (id: string) => { try { return JSON.parse(document.getElementById(id)?.textContent || '[]'); } catch { return []; } };

export async function initPanchang() {
  const rootEl = document.querySelector<HTMLElement>('.panchang');
  if (!rootEl) return;
  const root: HTMLElement = rootEl;

  const events: Ev[] = jget('pch-events');
  const muhurat: Muh[] = jget('pch-muhurat');
  const windows: Win[] = jget('pch-windows');
  const YEAR = 2026;

  let days: Record<string, Day> = {};
  try {
    const r = await fetch(`/data/panchang-${YEAR}.json`);
    const j = await r.json();
    for (const dd of j.days as Day[]) days[dd.d] = dd;
  } catch { /* day grid stays empty; events still render */ }

  // lookups by date
  const evByDate: Record<string, Ev[]> = {};
  for (const e of events) (evByDate[e.date] = evByDate[e.date] || []).push(e);
  const muhByDate: Record<string, Muh[]> = {};
  for (const m of muhurat) for (const dt of m.dates) (muhByDate[dt] = muhByDate[dt] || []).push(m);
  const windowOn = (d: string) => windows.find((w) => d >= w.start && d <= w.end);

  const todayISO = () => { const t = new Date(); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`; };
  const clamp = (iso: string) => (iso < `${YEAR}-01-01` ? `${YEAR}-01-01` : iso > `${YEAR}-12-31` ? `${YEAR}-12-31` : iso);
  const realToday = todayISO();
  let cur = clamp(realToday);

  const parse = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtGreg = (iso: string) => { const dt = parse(iso); return `${WD_FULL[dt.getDay()]}, ${dt.getDate()} ${MONTHS_EN[dt.getMonth()]} ${dt.getFullYear()}`; };
  const samvat = (iso: string) => (iso >= `${YEAR}-03-19` ? 2083 : 2082);
  const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ── DAY / TODAY card ──
  const todayCard = root.querySelector<HTMLElement>('#pch-today')!;
  function renderDay(iso: string) {
    cur = iso;
    const dd = days[iso];
    const w = windowOn(iso);
    const evs = evByDate[iso] || [];
    const muhs = muhByDate[iso] || [];
    const isToday = iso === realToday;

    let special = '';
    if (w) special += `<div class="pch-banner pch-banner-warn"><strong>${esc(w.dev)}</strong> — ${esc(w.note)}</div>`;
    if (evs.length) {
      special += '<div class="pch-special"><p class="pch-special-h">आजु की अछि? · Today</p><ul class="pch-evlist">' +
        evs.map((e) => `<li><span class="pch-evname">${esc(e.dev || e.en)}</span> <span class="pch-evname-en">${esc(e.en)}</span>${e.link ? ` <a class="pch-evlink" href="${e.link}">एहि बारे पढ़ू →</a>` : ''}${e.note ? `<span class="pch-evnote">${esc(e.note)}</span>` : ''}</li>`).join('') +
        '</ul></div>';
    }
    if (muhs.length) {
      special += '<div class="pch-special"><p class="pch-special-h pch-muh-h">शुभ मुहूर्त · Auspicious for</p><p class="pch-muhrow">' +
        muhs.map((m) => `<span class="pch-muhtag">${m.emoji} ${esc(m.dev)}</span>`).join('') + '</p></div>';
    }
    if (!w && !evs.length && !muhs.length) special = '<div class="pch-banner">आइ कोनो विशेष पाबनि वा मुहूर्त नहि। · No special festival or muhurat today.</div>';

    const grid = dd ? `
      <div class="pch-grid2">
        <div class="pch-cell"><span class="pch-k">मास · Maas</span><span class="pch-v">${dd.sm} <small>(${dd.smEn})</small></span></div>
        <div class="pch-cell"><span class="pch-k">पक्ष-तिथि · Tithi</span><span class="pch-v">${dd.pak} ${dd.tithi}${dd.tEnd ? ` <small>${dd.tNext ? 'भोर तक' : 'तक'} ${dd.tEnd}</small>` : ''}</span></div>
        <div class="pch-cell"><span class="pch-k">नक्षत्र · Nakshatra</span><span class="pch-v">${dd.nak}${dd.nEnd ? ` <small>${dd.nNext ? 'भोर तक' : 'तक'} ${dd.nEnd}</small>` : ''}</span></div>
        <div class="pch-cell"><span class="pch-k">वार · Day</span><span class="pch-v">${dd.wdDev} <small>(${dd.wd})</small></span></div>
        <div class="pch-cell"><span class="pch-k">सूर्योदय · Sunrise</span><span class="pch-v">${dd.sr || '—'}</span></div>
        <div class="pch-cell"><span class="pch-k">सूर्यास्त · Sunset</span><span class="pch-v">${dd.ss || '—'}</span></div>
        <div class="pch-cell"><span class="pch-k">योग · Yoga</span><span class="pch-v">${esc(dd.yoga) || '—'}</span></div>
        <div class="pch-cell"><span class="pch-k">करण · Karana</span><span class="pch-v">${esc(dd.karana) || '—'}</span></div>
      </div>` : '<p class="pch-nodata">Daily detail is loading…</p>';

    todayCard.innerHTML = `
      <div class="pch-today-head">
        ${isToday ? '<span class="pch-todaybadge">आजु · Today</span>' : ''}
        <h2 class="pch-bigdate">${fmtGreg(iso)}</h2>
        <p class="pch-samvat">विक्रम संवत् ${samvat(iso)}${dd ? ` · चान्द्र मास ${esc(dd.masaEn)}` : ''}</p>
      </div>
      ${special}
      ${grid}
    `;
    const di = root.querySelector<HTMLInputElement>('#pch-date');
    if (di) di.value = iso;
  }

  // ── stepper ──
  const step = (n: number) => { const dt = parse(cur); dt.setDate(dt.getDate() + n); renderDay(clamp(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`)); };
  root.querySelector('#pch-prev')?.addEventListener('click', () => step(-1));
  root.querySelector('#pch-next')?.addEventListener('click', () => step(1));
  root.querySelector('#pch-today-btn')?.addEventListener('click', () => { setView('day'); renderDay(clamp(realToday)); });
  root.querySelector<HTMLInputElement>('#pch-date')?.addEventListener('change', (e) => renderDay(clamp((e.target as HTMLInputElement).value)));

  // ── view switch (day | month) ──
  const dayView = root.querySelector<HTMLElement>('#pch-dayview')!;
  const monthView = root.querySelector<HTMLElement>('#pch-monthview')!;
  function setView(v: 'day' | 'month') {
    root.querySelectorAll<HTMLButtonElement>('.pch-viewtabs button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
    dayView.hidden = v !== 'day';
    todayCard.hidden = v !== 'day';
    monthView.hidden = v !== 'month';
    if (v === 'month') renderMonth(mCur);
  }
  root.querySelectorAll<HTMLButtonElement>('.pch-viewtabs button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view as 'day' | 'month')));

  // ── month calendar ──
  let mCur = parse(cur).getMonth();
  const grid = root.querySelector<HTMLElement>('#pch-grid')!;
  const mLabel = root.querySelector<HTMLElement>('#pch-mlabel')!;
  function renderMonth(m: number) {
    mCur = (m + 12) % 12;
    mLabel.textContent = `${MONTHS_EN[mCur]} ${YEAR}`;
    const first = new Date(YEAR, mCur, 1).getDay();
    const ndays = new Date(YEAR, mCur + 1, 0).getDate();
    let html = WD_DEV.map((w) => `<div class="pch-gh">${w}</div>`).join('');
    for (let i = 0; i < first; i++) html += '<div class="pch-gd pch-empty"></div>';
    for (let day = 1; day <= ndays; day++) {
      const iso = `${YEAR}-${pad(mCur + 1)}-${pad(day)}`;
      const dd = days[iso];
      const w = windowOn(iso);
      const hasFest = (evByDate[iso] || []).some((e) => e.cat === 'festival' || e.cat === 'sankranti');
      const hasEka = (evByDate[iso] || []).some((e) => e.cat === 'ekadashi');
      const hasMuh = !!muhByDate[iso];
      const dots = `${hasFest ? '<i class="dot dot-f"></i>' : ''}${hasMuh ? '<i class="dot dot-m"></i>' : ''}${hasEka ? '<i class="dot dot-e"></i>' : ''}`;
      html += `<button class="pch-gd${iso === realToday ? ' is-today' : ''}${w ? ' is-win' : ''}" data-iso="${iso}">
        <span class="pch-gnum">${day}</span>
        <span class="pch-gtithi">${dd ? dd.tithi : ''}</span>
        <span class="pch-gdots">${dots}</span></button>`;
    }
    grid.innerHTML = html;
    grid.querySelectorAll<HTMLButtonElement>('.pch-gd[data-iso]').forEach((c) => c.addEventListener('click', () => { setView('day'); renderDay(c.dataset.iso!); todayCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  }
  root.querySelector('#pch-mprev')?.addEventListener('click', () => renderMonth(mCur - 1));
  root.querySelector('#pch-mnext')?.addEventListener('click', () => renderMonth(mCur + 1));

  // ── event-list category filter ──
  const list = root.querySelector<HTMLElement>('#pch-list');
  root.querySelectorAll<HTMLButtonElement>('.pch-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.cat!;
      root.querySelectorAll('.pch-chip').forEach((c) => c.classList.toggle('active', c === chip));
      list?.querySelectorAll<HTMLElement>('[data-cat]').forEach((row) => {
        row.hidden = cat !== 'all' && row.dataset.cat !== cat;
      });
      // hide month headers that have no visible rows
      list?.querySelectorAll<HTMLElement>('.pch-mhead').forEach((h) => {
        let n = h.nextElementSibling as HTMLElement | null, any = false;
        while (n && !n.classList.contains('pch-mhead')) { if (!n.hidden) any = true; n = n.nextElementSibling as HTMLElement | null; }
        h.hidden = !any;
      });
    });
  });

  renderDay(cur);
}
