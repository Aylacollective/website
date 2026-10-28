/* AYLA · home.js — hero controller, leak simulation, pinned system, approach,
   growth audit, quote carousel, final lens. */
(() => {
  'use strict';
  const start = () => {
    const A = window.AYLA, { $, $$, clamp, smooth } = A, d = document;

    // ── Hero ────────────────────────────────────────────────
    const GATES = [
      '(max-width: 720px)',
      '(orientation: portrait) and (max-width: 1024px)',
      '(orientation: portrait) and (pointer: coarse)',
      '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
      '(prefers-reduced-motion: reduce)',
    ];
    const MQLS = GATES.map((q) => matchMedia(q));
    const hero = $('[data-hero]');
    if (hero) {
      const canvas = $('[data-hero-canvas]', hero);
      const syncEl = $('[data-sync]', hero);
      let hp = 0, scrubOn = false, gl = null, glTried = false, heroVisible = true;
      let last = { b1: -1, b2: -1, sync: '', off: null, synced: null }, lastSyncAt = 0;
      const setVar = (k, v) => { if (Math.abs(last[k] - v) > 0.002) { last[k] = v; hero.style.setProperty('--' + k, v.toFixed(3)); } };
      const onHero = (p) => {
        hp = p;
        if (!scrubOn) return;
        const b1 = 1 - smooth(p, 0.16, 0.4);
        const b2 = smooth(p, 0.56, 0.74);
        setVar('b1', b1); setVar('b2', b2);
        const sync = smooth(p, 0.08, 0.66);
        setVar('sync', sync);
        const off = b1 < 0.02;
        if (off !== last.off) { last.off = off; hero.classList.toggle('b1-off', off); }
        const synced = sync > 0.98;
        if (synced !== last.synced) { last.synced = synced; hero.classList.toggle('synced', synced); }
        const now = performance.now();
        const s = String(Math.round(12 + sync * 88)).padStart(3, '0');
        if (s !== last.sync && (now - lastSyncAt > 100 || synced)) { last.sync = s; lastSyncAt = now; syncEl.textContent = s; }
      };
      const sc = A.scrub(hero, onHero, 'pin');

      // 'full' glass on capable desktops, 'lite' chrome on phones and low-power machines, none with reduced motion
      const glMode = () => {
        if (A.rm) return null;
        try { if (!d.createElement('canvas').getContext('webgl2')) return null; } catch (e) { return null; }
        const mem = navigator.deviceMemory, cores = navigator.hardwareConcurrency;
        if (mem && mem < 2) return null;
        const strong = A.fine && innerWidth > 720 && (!mem || mem >= 4) && (!cores || cores >= 4);
        return strong ? 'full' : 'lite';
      };
      // scroll speed feeds the spin
      let vel = 0, lastSY = scrollY, lastST = performance.now();
      addEventListener('scroll', () => {
        const now = performance.now(), dy = scrollY - lastSY, dt = Math.max(8, now - lastST);
        vel = vel * 0.5 + (dy / dt * 16) * 0.5; lastSY = scrollY; lastST = now;
      }, { passive: true });
      const getVelocity = () => { vel *= 0.9; return vel; };
      // without the scroll scrub (phones), the rings fall out of sync and lock back in on a loop
      const cycle = (t) => {
        const c = t % 13;
        if (c < 4) return 0;
        if (c < 6.5) return smooth(c, 4, 6.5);
        if (c < 11) return 1;
        return 1 - smooth(c, 11, 13);
      };
      const getProgress = (t) => (scrubOn ? hp : cycle(t + 2));
      const heroUrl = (() => { const s = $('script[src*="home.js"]'); return s ? s.src.replace(/home\.js(\?.*)?$/, 'hero.js') : 'assets/js/hero.js'; })();
      function loadGL() {
        const mode = glMode();
        if (glTried || !mode) return;
        glTried = true;
        const go = () => import(heroUrl).then((m) => {
          gl = m.startHero({ canvas, mode, getProgress, getVelocity, onReady: (api) => { hero.classList.add('gl'); if (mode === 'lite') hero.classList.add('gl-lite'); if (heroVisible && !d.hidden) api.start(); } });
        }).catch(() => { glTried = false; });
        ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 400);
      }
      const runGL = () => { if (!gl) return; (heroVisible && !d.hidden && !A.rm) ? gl.start() : gl.stop(); };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((e) => { heroVisible = e[0].isIntersecting; runGL(); }).observe(hero);
      }
      d.addEventListener('visibilitychange', runGL);
      d.addEventListener('ayla:resize', () => gl && gl.resize());
      d.addEventListener('ayla:rm', (e) => { if (e.detail) { if (gl) gl.stop(); hero.classList.remove('gl'); } else if (gl) { hero.classList.add('gl'); runGL(); } else loadGL(); });
      if (document.readyState === 'complete') loadGL(); else addEventListener('load', loadGL, { once: true });

      function enableScrub() {
        if (scrubOn) return; scrubOn = true;
        last = { b1: -1, b2: -1, sync: '', off: null, synced: null };
        sc.on = true; A.measure();
        const b = $('.hero-still-b', hero); if (b && !b.src && b.dataset.src) b.src = b.dataset.src;
        if (gl) setTimeout(() => gl.resize(), 50);
      }
      function disableScrub() {
        if (!scrubOn) return; scrubOn = false;
        ['b1', 'b2', 'sync'].forEach((k) => hero.style.removeProperty('--' + k));
        hero.classList.remove('b1-off', 'synced');
        A.measure();
        if (gl) setTimeout(() => gl.resize(), 50);
      }
      function applyHeroMode() { MQLS.some((m) => m.matches) ? disableScrub() : enableScrub(); }
      MQLS.forEach((m) => m.addEventListener('change', applyHeroMode));
      applyHeroMode();
    }

    // ── Leak simulation + hold to connect ───────────────────
    const leak = $('[data-leak]');
    if (leak) {
      const sec = leak.closest('.leak');
      const cv = $('[data-leak-canvas]', leak), ctx = cv.getContext('2d');
      const countEl = $('[data-leak-count]', leak);
      const labels = $$('[data-leak-label]', leak);
      const hold = $('[data-hold]', leak);
      const BASE = [0.28, 0.32, 0.25, 0.22], FLOOR = 0.02;
      const SIG = A.accent().rgb.join(',');
      let W = 0, H = 0, dpr = 1, vertical = false, visible = false;
      let parts = [], drops = [], results = [], spawnAcc = 0, lastT = 0;
      let seal = 0, holding = false, done = false;
      const sealed = [false, false, false, false];
      const glow = (() => {
        const c = d.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d');
        const r = g.createRadialGradient(24, 24, 0, 24, 24, 24);
        r.addColorStop(0, 'rgba(241,238,234,1)'); r.addColorStop(0.3, 'rgba(241,238,234,.45)'); r.addColorStop(1, 'rgba(241,238,234,0)');
        g.fillStyle = r; g.fillRect(0, 0, 48, 48); return c;
      })();
      const glowR = (() => {
        const c = d.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d');
        const r = g.createRadialGradient(24, 24, 0, 24, 24, 24);
        const ac = A.accent(), S = ac.rgb.join(','), Hh = ac.hot.join(',');
        r.addColorStop(0, `rgba(${Hh},1)`); r.addColorStop(0.3, `rgba(${S},.5)`); r.addColorStop(1, `rgba(${S},0)`);
        g.fillStyle = r; g.fillRect(0, 0, 48, 48); return c;
      })();
      function size() {
        const r = cv.getBoundingClientRect();
        dpr = Math.min(devicePixelRatio || 1, 2);
        W = r.width; H = r.height; vertical = innerWidth <= 720;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!visible) draw();
      }
      // path: u in [0,1] along the pipe
      const pos = (u, wob) => vertical
        ? { x: W * 0.36 + Math.sin(u * 14 + wob) * 3, y: H * (1 / 12 + u * (10 / 12)) }
        : { x: W * (1 / 12 + u * (10 / 12)), y: H * 0.36 + Math.sin(u * 12 + wob) * 3 };
      const gapU = (i) => (i + 1) / 6 * (12 / 10) - 0.1; // u at the gap between stage i and i+1
      const leakP = (i) => sealed[i] ? FLOOR : BASE[i] * (1 - localSeal(i)) + FLOOR * localSeal(i);
      const localSeal = (i) => clamp(seal * 4 - i, 0, 1);

      function step(dt) {
        spawnAcc += dt * 0.012;
        while (spawnAcc > 1) { spawnAcc -= 1; parts.push({ u: 0, v: 0.00016 + Math.random() * 0.00008, wob: Math.random() * 6, g: 0, alive: true }); }
        for (const p of parts) {
          const prev = p.u;
          p.u += p.v * dt;
          for (let i = 0; i < 4; i++) {
            const gu = gapU(i);
            if (prev < gu && p.u >= gu && Math.random() < leakP(i)) {
              const q = pos(gu, p.wob);
              drops.push({ x: q.x, y: q.y, vx: vertical ? 0.05 + Math.random() * 0.05 : (Math.random() - 0.5) * 0.04, vy: vertical ? 0 : 0.02, life: 1 });
              p.alive = false; results.push(0); break;
            }
          }
          if (p.alive && p.u >= 1) { p.alive = false; results.push(1); }
        }
        parts = parts.filter((p) => p.alive);
        if (results.length > 100) results.splice(0, results.length - 100);
        for (const q of drops) {
          if (vertical) { q.vy += 0.0009 * dt; } else { q.vy += 0.0011 * dt; }
          q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt * 0.0009;
        }
        drops = drops.filter((q) => q.life > 0 && q.y < H + 20);
      }
      function draw() {
        ctx.clearRect(0, 0, W, H);
        // pipe
        const a = pos(0, 0), b = pos(1, 0);
        const grad = vertical ? ctx.createLinearGradient(0, a.y, 0, b.y) : ctx.createLinearGradient(a.x, 0, b.x, 0);
        grad.addColorStop(0, 'rgba(241,238,234,.10)'); grad.addColorStop(1, done ? `rgba(${SIG},.55)` : 'rgba(241,238,234,.22)');
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(241,238,234,.06)'; ctx.lineWidth = 26;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.strokeStyle = grad; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        // stage nodes
        for (let i = 0; i < 6; i++) {
          const u = (i + 0.5) / 6 * (12 / 10) - 0.1;
          const q = pos(clamp(u, 0, 1), 0);
          ctx.fillStyle = '#0A0909'; ctx.strokeStyle = 'rgba(241,238,234,.5)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, 7); ctx.fill(); ctx.stroke();
        }
        // leak gates
        for (let i = 0; i < 4; i++) {
          const q = pos(gapU(i), 0), s = localSeal(i);
          const open = 1 - s;
          ctx.strokeStyle = `rgba(${SIG},${0.25 + open * 0.6})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (vertical) { ctx.moveTo(q.x + 8, q.y); ctx.lineTo(q.x + 8 + open * 22, q.y + open * 10); }
          else { ctx.moveTo(q.x, q.y + 8); ctx.lineTo(q.x + open * 6, q.y + 8 + open * 26); }
          ctx.stroke();
          if (s > 0.98) { ctx.fillStyle = `rgba(${SIG},.9)`; ctx.beginPath(); ctx.arc(q.x, q.y, 3.5, 0, 7); ctx.fill(); }
        }
        // particles
        for (const p of parts) { const q = pos(p.u, p.wob); ctx.drawImage(glow, q.x - 10, q.y - 10, 20, 20); }
        for (const q of drops) { ctx.globalAlpha = Math.max(0, q.life); ctx.drawImage(glowR, q.x - 9, q.y - 9, 18, 18); }
        ctx.globalAlpha = 1;
      }
      let lastCount = '';
      function updateCount() {
        if (results.length < 20) return;
        const n = Math.round(results.reduce((s, v) => s + v, 0) / results.length * 100);
        const s = String(n);
        if (s !== lastCount) { lastCount = s; countEl.textContent = s; }
      }
      let lastCountAt = 0;
      function job(t) {
        if (!visible) { lastT = 0; return false; }
        const raw = Math.min(250, t - (lastT || t)); lastT = t;
        const dt = Math.min(48, raw);
        // hold logic (frame-rate independent)
        if (!done) {
          seal = holding ? Math.min(1, seal + raw / 2400) : Math.max(0, seal - raw / 1400);
          hold.style.setProperty('--hp', seal.toFixed(3));
          labels.forEach((l, i) => l.classList.toggle('sealed', localSeal(i) > 0.98));
          if (seal >= 1) complete();
        }
        step(dt); draw();
        if (t - lastCountAt > 250) { lastCountAt = t; updateCount(); }
        return true;
      }
      function complete() {
        done = true; holding = false; seal = 1;
        sealed.fill(true);
        hold.classList.remove('holding');
        hold.style.setProperty('--hp', '1');
        labels.forEach((l) => l.classList.add('sealed'));
        sec.classList.add('connected');
        $('.hold-label', hold).textContent = 'System connected';
      }
      function reset() {
        done = false; seal = 0; sealed.fill(false); sec.classList.remove('connected');
        labels.forEach((l) => l.classList.remove('sealed'));
        hold.style.setProperty('--hp', '0');
        $('.hold-label', hold).textContent = 'Hold to connect the system';
        hold.focus();
      }
      const press = (e) => { if (done) return; if (e) e.preventDefault(); holding = true; hold.classList.add('holding'); if (A.rm) complete(); A.addJob(job); };
      const release = () => { holding = false; hold.classList.remove('holding'); };
      hold.addEventListener('pointerdown', (e) => { hold.setPointerCapture && hold.setPointerCapture(e.pointerId); press(e); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => hold.addEventListener(ev, release));
      hold.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) press(e); });
      hold.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') release(); });
      hold.addEventListener('contextmenu', (e) => e.preventDefault());
      $('[data-leak-reset]', leak).addEventListener('click', reset);
      if (A.rm) { size(); draw(); }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((e) => {
          visible = e[0].isIntersecting && !A.rm;
          if (visible) { size(); A.addJob(job); }
        }, { rootMargin: '60px' }).observe(cv);
      }
      d.addEventListener('ayla:resize', size);
      size();
      // seed the meter so it opens on a believable reading
      for (let i = 0; i < 260; i++) step(32);
      updateCount(); draw();
    }

    // ── System: pinned horizontal track ─────────────────────
    const sys = $('[data-system]');
    if (sys) {
      const track = $('[data-sys-track]', sys), stage = $('.sys-stage', sys);
      const cards = $$('[data-pillar]', sys), count = $('[data-sys-count]', sys);
      const pinMQ = matchMedia('(max-width: 980px), (pointer: coarse)');
      let dist = 0, on = false, lastSx = null, lastCount = '', cardCache = cards.map(() => ({ c: -1, lit: null }));
      function layout() {
        on = !pinMQ.matches && !A.rm;
        if (!on) {
          sys.style.height = ''; track.style.removeProperty('--sx');
          cards.forEach((c) => { c.style.setProperty('--c', 1); c.classList.add('lit'); });
          sys.style.setProperty('--sp', 1); return;
        }
        dist = Math.max(0, track.scrollWidth - innerWidth);
        sys.style.height = (innerHeight + dist) + 'px';
      }
      const onSys = (p) => {
        if (!on) return;
        const sx = -Math.round(p * dist);
        if (sx !== lastSx) { lastSx = sx; track.style.setProperty('--sx', sx + 'px'); }
        sys.style.setProperty('--sp', p.toFixed(3));
        const vw = innerWidth;
        cards.forEach((c, i) => {
          const left = c.offsetLeft + sx, w = c.offsetWidth;
          const cp = clamp((vw * 0.85 - left) / (w * 0.9), 0, 1);
          const cc = cardCache[i];
          if (Math.abs(cc.c - cp) > 0.005) { cc.c = cp; c.style.setProperty('--c', cp.toFixed(3)); }
          const lit = cp > 0.55;
          if (lit !== cc.lit) { cc.lit = lit; c.classList.toggle('lit', lit); }
        });
        const idx = String(clamp(Math.floor(p * 4 + 0.15) + 1, 1, 4)).padStart(2, '0');
        if (idx !== lastCount) { lastCount = idx; count.textContent = idx; }
      };
      layout();
      A.scrub(sys, onSys, 'pin');
      d.addEventListener('ayla:resize', () => { layout(); A.measure(); });
      pinMQ.addEventListener('change', () => { layout(); A.measure(); });
      d.addEventListener('ayla:rm', () => { layout(); A.measure(); });
      A.measure();
    }

    // ── Approach timeline ───────────────────────────────────
    const ap = $('[data-approach]');
    if (ap) {
      const steps = $$('[data-step]', ap), num = $('[data-app-num]', ap);
      let tops = [], lastIdx = -2, lastAp = -1;
      const measure = () => { tops = steps.map((s) => s.getBoundingClientRect().top + A.y); };
      measure(); d.addEventListener('ayla:resize', measure); addEventListener('load', measure);
      A.scrub(ap, () => {
        const line = A.y + A.vh * 0.62;
        const q = clamp((line - tops[0]) / Math.max(1, tops[tops.length - 1] - tops[0]), 0, 1);
        if (Math.abs(q - lastAp) > 0.002) { lastAp = q; ap.style.setProperty('--ap', q.toFixed(3)); }
        let idx = -1; tops.forEach((t, i) => { if (line >= t) idx = i; });
        idx = Math.max(0, idx);
        if (idx !== lastIdx) {
          lastIdx = idx;
          steps.forEach((s, i) => s.classList.toggle('on', i <= idx));
          num.textContent = String(idx + 1).padStart(2, '0');
        }
      }, 'pass');
    }

    // ── Growth audit calculator ─────────────────────────────
    $$('[data-audit]').forEach((root) => {
      const cfg = JSON.parse(root.dataset.calcConfig);
      const inp = Object.fromEntries($$('[data-calc]', root).map((i) => [i.dataset.calc, i]));
      const out = Object.fromEntries($$('[data-out]', root).map((o) => [o.dataset.out, o]));
      const total = $('[data-total]', root);
      const br = { response: $('[data-b="response"]', root), followup: $('[data-b="followup"]', root), retention: $('[data-b="retention"]', root) };
      const bars = { response: $('[data-bar="response"]', root), followup: $('[data-bar="followup"]', root), retention: $('[data-bar="retention"]', root) };
      const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
      const VMIN = 100, VMAX = 50000;
      const nice = (v) => v < 1000 ? Math.round(v / 10) * 10 : v < 10000 ? Math.round(v / 50) * 50 : Math.round(v / 500) * 500;
      const toVal = (x) => nice(VMIN * Math.pow(VMAX / VMIN, x / 1000));
      const fromVal = (v) => Math.round(Math.log(v / VMIN) / Math.log(VMAX / VMIN) * 1000);
      inp.value.value = fromVal(cfg.defaults.value);
      let shown = 0, target = 0, state = {};
      function compute() {
        const L = +inp.leads.value, r = cfg.responseOptions[+inp.response.value], c = +inp.close.value / 100;
        const V = toVal(+inp.value.value), rep = +inp.repeat.value / 100;
        const respLoss = L * r[1] * c * V;
        const reached = L * (1 - r[1]);
        const follow = reached * c * cfg.followUpLift * cfg.followUpCoverage * V;
        const customers = reached * c;
        const retention = customers * Math.max(0, cfg.targetRepeat - rep) * V * cfg.repeatValue;
        state = { leads: L, response: r[0], close: Math.round(c * 100), value: Math.round(V), repeat: Math.round(rep * 100), respLoss, follow, retention };
        out.leads.textContent = L.toLocaleString('en-US');
        out.response.textContent = r[0];
        out.close.textContent = Math.round(c * 100) + '%';
        out.value.textContent = money(V);
        out.repeat.textContent = Math.round(rep * 100) + '%';
        for (const k in inp) { const i = inp[k]; i.style.setProperty('--v', ((i.value - i.min) / (i.max - i.min) * 100) + '%'); }
        const sum = respLoss + follow + retention;
        br.response.textContent = money(respLoss); br.followup.textContent = money(follow); br.retention.textContent = money(retention);
        const mx = Math.max(respLoss, follow, retention, 1);
        bars.response.style.setProperty('--w', (respLoss / mx).toFixed(3));
        bars.followup.style.setProperty('--w', (follow / mx).toFixed(3));
        bars.retention.style.setProperty('--w', (retention / mx).toFixed(3));
        target = sum;
        if (A.rm) { shown = sum; total.textContent = money(sum); } else A.addJob(tick);
        A.store.set('ayla-audit', JSON.stringify({ leads: L, firstReply: r[0], closeRate: state.close + '%', customerValue: state.value, repeatRate: state.repeat + '%', estimateMonthly: Math.round(sum) }));
      }
      let lastTxt = '';
      function tick() {
        shown += (target - shown) * 0.14;
        if (Math.abs(target - shown) < 1) shown = target;
        const txt = money(shown);
        if (txt !== lastTxt) { lastTxt = txt; total.textContent = txt; }
        return shown !== target;
      }
      Object.values(inp).forEach((i) => i.addEventListener('input', compute));
      compute();
    });

    // ── Quote carousel (drag + keys + buttons) ──────────────
    const car = $('[data-carousel]');
    if (car) {
      const track = $('.q-track', car);
      let x = 0, tx = 0, min = 0, dragging = false, sx = 0, sx0 = 0, vel = 0, lastX = 0, lastT = 0;
      const bounds = () => { min = Math.min(0, car.clientWidth - track.scrollWidth); tx = clamp(tx, min, 0); };
      const job = () => {
        if (!dragging) { tx += vel; vel *= 0.92; if (tx > 0 || tx < min) { tx = clamp(tx, min, 0); vel = 0; } }
        x += (tx - x) * (A.rm ? 1 : 0.18);
        track.style.setProperty('--qx', x.toFixed(1) + 'px');
        return dragging || Math.abs(tx - x) > 0.5 || Math.abs(vel) > 0.1;
      };
      car.addEventListener('pointerdown', (e) => { dragging = true; sx = e.clientX; sx0 = tx; vel = 0; lastX = e.clientX; lastT = performance.now(); car.classList.add('drag'); car.setPointerCapture(e.pointerId); A.addJob(job); });
      car.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        tx = clamp(sx0 + (e.clientX - sx), min - 80, 80);
        const now = performance.now(); vel = (e.clientX - lastX) / Math.max(1, now - lastT) * 16; lastX = e.clientX; lastT = now;
      });
      const end = () => { if (!dragging) return; dragging = false; car.classList.remove('drag'); A.addJob(job); };
      car.addEventListener('pointerup', end); car.addEventListener('pointercancel', end);
      const card = () => ($('.q-card', track)?.offsetWidth || 400) + 18;
      const go = (dir) => { bounds(); vel = 0; tx = clamp(tx - dir * card(), min, 0); A.addJob(job); };
      $('[data-q-next]').addEventListener('click', () => go(1));
      $('[data-q-prev]').addEventListener('click', () => go(-1));
      car.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
      bounds(); d.addEventListener('ayla:resize', bounds);
    }

    // ── Final CTA: kinetic type + glass lens ────────────────
    const fin = $('[data-final]');
    if (fin) {
      let lastFp = -1;
      A.scrub(fin, (p) => {
        const v = A.rm ? 1 : smooth(p, 0.05, 0.5);
        if (Math.abs(v - lastFp) > 0.002) { lastFp = v; fin.style.setProperty('--fp', v.toFixed(3)); }
      }, 'pass');
      const lens = $('[data-lens]', fin), lin = $('.lens-in', lens), src = $('[data-lens-src]', fin);
      if (A.fine && !A.rm && lens) {
        const clone = src.cloneNode(true);
        clone.removeAttribute('data-lens-src');
        clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
        lin.appendChild(clone);
        const R = 120, S = 1.32;
        let mx = -999, my = -999, lx = -999, ly = -999, inside = false;
        const fit = () => { lin.style.width = fin.clientWidth + 'px'; lin.style.height = fin.clientHeight + 'px'; clone.style.position = 'absolute'; clone.style.left = src.offsetLeft + 'px'; clone.style.top = src.offsetTop + 'px'; clone.style.width = src.offsetWidth + 'px'; };
        fit(); d.addEventListener('ayla:resize', fit);
        const job = () => {
          lx += (mx - lx) * 0.16; ly += (my - ly) * 0.16;
          lens.style.setProperty('--lx', (lx - R).toFixed(1) + 'px');
          lens.style.setProperty('--ly', (ly - R).toFixed(1) + 'px');
          lin.style.setProperty('--ix', (R - S * lx).toFixed(1) + 'px');
          lin.style.setProperty('--iy', (R - S * ly).toFixed(1) + 'px');
          return inside && (Math.abs(mx - lx) + Math.abs(my - ly) > 0.4);
        };
        fin.addEventListener('pointermove', (e) => {
          const r = fin.getBoundingClientRect();
          mx = e.clientX - r.left; my = e.clientY - r.top;
          if (!inside) { inside = true; lx = mx; ly = my; fin.classList.add('lens-on'); fit(); }
          A.addJob(job);
        });
        fin.addEventListener('pointerleave', () => { inside = false; fin.classList.remove('lens-on'); });
      }
    }

    // carry calculator figures into the contact page
    $$('[data-audit-cta]').forEach((b) => b.addEventListener('click', () => A.store.set('ayla-audit-go', '1')));
  };
  if (window.AYLA && window.AYLA.booted) start(); else document.addEventListener('ayla:boot', start, { once: true });
})();
