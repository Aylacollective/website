/* AYLA · site.js — shared motion engine.
   One rAF loop that rests when idle. Transform/opacity only. Reduced motion honored live. */
(() => {
  'use strict';
  const d = document, html = d.documentElement, W = window;
  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (p, a, b) => { const t = clamp((p - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };

  const mqRM = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(pointer: fine)');
  const A = (W.AYLA = {
    $, $$, clamp, smooth, store,
    rm: mqRM.matches,
    fine: mqFine.matches,
    vh: innerHeight, vw: innerWidth,
    y: scrollY,
    lenis: null,
  });
  // the accent color, read from CSS so the palette lives in one place
  A.accent = () => {
    const cs = getComputedStyle(html);
    const rd = (k, f) => (cs.getPropertyValue(k).trim() || f).split(',').map(Number);
    return { rgb: rd('--sig', '255,59,47'), hot: rd('--sig-hot', '255,90,79') };
  };

  // ── Frame loop (rests when idle) ──────────────────────────
  const jobs = new Set();      // per-frame callbacks that return true while they still need frames
  const scrubbers = [];        // {el, top, h, range, fn, last}
  let raf = null, lastY = -1, idleFrames = 0;

  function frame(t) {
    raf = null;
    if (A.lenis) A.lenis.raf(t);
    A.y = A.lenis ? A.lenis.scroll : scrollY;
    let busy = false;
    if (A.y !== lastY) { lastY = A.y; runScrubbers(); onScrollUI(); busy = true; }
    for (const j of jobs) { if (j(t) === false) jobs.delete(j); else busy = true; }
    if (A.lenis && A.lenis.isScrolling) busy = true;
    idleFrames = busy ? 0 : idleFrames + 1;
    if (idleFrames < 30) raf = requestAnimationFrame(frame);
  }
  const wake = () => { idleFrames = 0; if (raf === null) raf = requestAnimationFrame(frame); };
  A.wake = wake;
  A.addJob = (fn) => { jobs.add(fn); wake(); };

  function runScrubbers(force) {
    const y = A.y, vh = A.vh;
    for (const s of scrubbers) {
      if (!s.on) continue;
      const span = s.h - (s.mode === 'pin' ? vh : -vh);
      const start = s.mode === 'pin' ? s.top : s.top - vh;
      const p = clamp((y - start) / Math.max(1, span), 0, 1);
      if (force || Math.abs(p - s.last) > 0.0004) { s.last = p; s.fn(p); }
    }
  }
  // mode 'pin': 0..1 while a tall section scrolls under a sticky stage.
  // mode 'pass': 0..1 from the section's top entering the viewport bottom to its bottom leaving the top.
  A.scrub = (el, fn, mode = 'pin') => {
    const s = { el, fn, mode, top: 0, h: 0, last: -1, on: true };
    scrubbers.push(s); measureOne(s); runScrubbers(true);
    return s;
  };
  function measureOne(s) {
    const r = s.el.getBoundingClientRect();
    s.top = r.top + A.y; s.h = r.height;
  }
  A.measure = () => {
    A.vh = innerHeight; A.vw = innerWidth;
    A.y = A.lenis ? A.lenis.scroll : scrollY;
    scrubbers.forEach(measureOne);
    runScrubbers(true);
  };
  let rsT;
  addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(() => { A.measure(); d.dispatchEvent(new Event('ayla:resize')); }, 120); });
  if ('ResizeObserver' in W) { let ro0 = 0; new ResizeObserver(() => { cancelAnimationFrame(ro0); ro0 = requestAnimationFrame(A.measure); }).observe(d.body); }

  // ── Smooth scroll (fine pointers only) ────────────────────
  function initLenis() {
    if (A.lenis || A.rm || !A.fine || !W.Lenis) return;
    A.lenis = new W.Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: false });
    ['wheel', 'keydown', 'pointerdown'].forEach((e) => addEventListener(e, wake, { passive: true }));
    // in-page anchors through Lenis
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !A.lenis) return;
      const id = a.getAttribute('href').slice(1);
      const t = id === 'main' ? $('#main') : id && d.getElementById(id);
      if (!t) return;
      e.preventDefault();
      A.lenis.scrollTo(t, { offset: id === 'main' ? 0 : -20, duration: 1.4 });
      if (id === 'main') t.focus({ preventScroll: true });
      wake();
    });
  }
  addEventListener('scroll', wake, { passive: true });

  // ── Split text ────────────────────────────────────────────
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    let i = 0;
    const walk = (node) => {
      for (const n of Array.from(node.childNodes)) {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = d.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); continue; }
            const w = d.createElement('span'); w.className = 'w';
            const wi = d.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--wi', i++);
            wi.textContent = part; w.appendChild(wi); frag.appendChild(w);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('ph') && !n.classList.contains('ph-slot')) walk(n);
      }
    };
    walk(el);
  }

  // ── Reveals ───────────────────────────────────────────────
  let io;
  function initReveals() {
    $$('[data-split]').forEach(split);
    if (A.rm || !('IntersectionObserver' in W)) { $$('[data-split],[data-reveal]').forEach((e) => e.classList.add('in')); return; }
    io = new IntersectionObserver((ents) => {
      for (const e of ents) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px' });
    $$('[data-split]:not([data-split="load"]),[data-reveal]').forEach((e) => io.observe(e));
  }
  A.playLoad = () => $$('[data-split="load"]').forEach((e, n) => { e.style.setProperty('--d', (0.1 + n * 0.12) + 's'); e.classList.add('in'); });

  // motifs + videos run only while visible
  function initVisibility() {
    if (!('IntersectionObserver' in W)) return;
    const vis = new IntersectionObserver((ents) => {
      for (const e of ents) e.target.classList.toggle('run', e.isIntersecting);
    }, { rootMargin: '80px' });
    $$('.motif').forEach((m) => vis.observe(m));
    const autoVids = new IntersectionObserver((ents) => {
      for (const e of ents) {
        const m = e.target, v = $('video', m);
        if (!v) continue;
        if (e.isIntersecting && !A.rm) playVideo(m, v); else stopVideo(m, v);
      }
    }, { threshold: 0.35 });
    $$('.final-media.has-video').forEach((m) => autoVids.observe(m));
    if (!A.fine) $$('[data-hoverplay] .media.has-video').forEach((m) => autoVids.observe(m));
  }
  function playVideo(m, v) {
    if (A.rm) return;
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
    const p = v.play();
    if (p && p.then) p.then(() => m.classList.add('playing')).catch(() => {});
  }
  function stopVideo(m, v) { m.classList.remove('playing'); try { v.pause(); } catch (e) {} }
  function initHoverPlay() {
    if (!A.fine) return;
    $$('[data-hoverplay]').forEach((h) => {
      const m = $('.media.has-video', h); if (!m) return;
      const v = $('video', m);
      h.addEventListener('pointerenter', () => playVideo(m, v));
      h.addEventListener('pointerleave', () => stopVideo(m, v));
    });
  }

  // ── Nav ───────────────────────────────────────────────────
  const nav = $('[data-nav]');
  let navY = 0, navHidden = false, menuOpen = false;
  function onScrollUI() {
    const y = A.y;
    if (nav && !menuOpen) {
      nav.classList.toggle('compact', y > 40);
      const down = y > navY + 4, up = y < navY - 4;
      if (down && y > 140 && !navHidden) { nav.classList.add('hide'); navHidden = true; }
      else if ((up || y < 140) && navHidden) { nav.classList.remove('hide'); navHidden = false; }
      if (down || up) navY = y;
    }
    stickyCta();
  }
  function initMenu() {
    const btn = $('.nav-burger'), menu = $('#menu');
    if (!btn || !menu) return;
    const close = () => {
      menuOpen = false; btn.setAttribute('aria-expanded', 'false'); menu.classList.remove('open');
      setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 450);
      if (A.lenis) A.lenis.start(); else d.body.style.overflow = '';
      btn.focus();
    };
    btn.addEventListener('click', () => {
      if (menuOpen) return close();
      menuOpen = true; menu.hidden = false; btn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => menu.classList.add('open'));
      if (A.lenis) A.lenis.stop(); else d.body.style.overflow = 'hidden';
      nav.classList.remove('hide'); navHidden = false;
      const first = $('a', menu); first && setTimeout(() => first.focus(), 60);
    });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) close(); });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) { menuOpen = false; } });
  }

  // ── Sticky mobile CTA ─────────────────────────────────────
  const sticky = $('[data-sticky-cta]');
  let footIn = false;
  function stickyCta() {
    if (!sticky) return;
    const page = $('main')?.dataset.page;
    const max = d.documentElement.scrollHeight - A.vh;
    const show = page !== 'contact' && A.y > max * 0.4 && !footIn && !menuOpen;
    sticky.classList.toggle('show', show);
  }
  if ('IntersectionObserver' in W && $('[data-foot]')) {
    new IntersectionObserver((e) => { footIn = e[0].isIntersecting; stickyCta(); }).observe($('[data-foot]'));
  }

  // ── Glass specular + magnetic + cursor (fine pointers) ────
  function initPointer() {
    if (!A.fine) return;
    let pend = null, px = 0, py = 0, cur = null;
    d.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      if (pend) return;
      pend = requestAnimationFrame(() => {
        pend = null;
        const t = d.elementFromPoint(px, py);
        const g = t && t.closest('.glass,.glass-lite');
        if (cur && cur !== g) { cur.style.removeProperty('--spec'); }
        cur = g;
        if (g) {
          const r = g.getBoundingClientRect();
          g.style.setProperty('--mx', (px - r.left) + 'px');
          g.style.setProperty('--my', (py - r.top) + 'px');
          g.style.setProperty('--spec', '.11');
        }
      });
    }, { passive: true });
    d.addEventListener('pointerleave', () => { if (cur) cur.style.removeProperty('--spec'); cur = null; });

    if (A.rm) return;
    $$('[data-magnetic]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        const x = clamp((e.clientX - (r.left + r.width / 2)) * 0.22, -12, 12);
        const y = clamp((e.clientY - (r.top + r.height / 2)) * 0.3, -10, 10);
        b.style.setProperty('--tx', x + 'px'); b.style.setProperty('--ty', y + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); });
    });

    // cursor
    const c = $('.cursor'); if (!c) return;
    html.classList.add('cur');
    const dot = $('.cursor-dot', c), ring = $('.cursor-ring', c), label = $('.cursor-label', c);
    let tx = -100, ty = -100, rx = -100, ry = -100, mode = '';
    d.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      A.addJob(ringJob);
    }, { passive: true });
    function ringJob() {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
      return Math.abs(tx - rx) + Math.abs(ty - ry) > 0.3;
    }
    d.addEventListener('pointerover', (e) => {
      const t = e.target;
      const lab = t.closest('[data-cursor]');
      const hov = t.closest('a,button,summary,label,input,textarea,[role="tab"]');
      const next = lab ? 'label:' + lab.dataset.cursor : hov ? 'hover' : '';
      if (next === mode) return;
      mode = next;
      html.classList.toggle('cur-label', !!lab);
      html.classList.toggle('cur-hover', !lab && !!hov);
      if (lab) label.textContent = lab.dataset.cursor;
    });
    d.addEventListener('pointerdown', () => html.classList.add('cur-down'));
    d.addEventListener('pointerup', () => html.classList.remove('cur-down'));
    d.documentElement.addEventListener('pointerleave', () => { tx = ty = -100; A.addJob(ringJob); });
  }

  // ── Footer sheen ──────────────────────────────────────────
  function initSheen() {
    const w = $('[data-sheen]'); if (!w || !A.fine) return;
    const span = $('span', w);
    let p = null;
    w.parentElement.addEventListener('pointermove', (e) => {
      if (p) return;
      p = requestAnimationFrame(() => {
        p = null;
        const r = span.getBoundingClientRect();
        span.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        span.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // ── Copy buttons ──────────────────────────────────────────
  function initCopy() {
    $$('[data-copy]').forEach((b) => {
      const tip = $('.mail-tip', b);
      b.addEventListener('click', () => {
        const txt = b.dataset.copy;
        const done = () => { b.classList.add('copied'); if (tip) tip.textContent = 'Copied'; setTimeout(() => { b.classList.remove('copied'); if (tip) tip.textContent = 'Copy'; }, 1800); };
        const fallback = () => {
          const s = $('.mono', b); const r = d.createRange(); r.selectNodeContents(s);
          const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
          if (tip) tip.textContent = 'Selected';
        };
        try { navigator.clipboard.writeText(txt).then(done, fallback); } catch (e) { fallback(); }
      });
    });
  }

  // ── Page transitions ──────────────────────────────────────
  function initTransitions() {
    if (html.classList.contains('pt-in')) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        html.classList.add('pt-gone'); html.classList.remove('pt-in');
        setTimeout(() => html.classList.remove('pt-gone'), 700);
      }));
    }
    if (A.rm) return;
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto|tel|sms|javascript):/i.test(href) || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      store.set('ayla-pt', '1');
      html.classList.add('pt-out');
      setTimeout(() => { location.href = a.href; }, 480);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) html.classList.remove('pt-out', 'pt-in', 'pt-gone'); });
  }

  // ── Preloader ─────────────────────────────────────────────
  function runPreloader(done) {
    if (!html.classList.contains('preload')) return done();
    store.set('ayla-seen', '1');
    const count = $('.pl-count');
    const t0 = performance.now(), dur = 1050;
    A.addJob((t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      const v = String(Math.round(p * 100)).padStart(2, '0');
      if (count && count.textContent !== v) count.textContent = v;
      if (p < 1) return true;
      html.classList.add('pl-done');
      setTimeout(done, 260);
      setTimeout(() => html.classList.remove('preload', 'pl-done'), 900);
      return false;
    });
  }

  // ── Reduced motion, live ──────────────────────────────────
  mqRM.addEventListener('change', (e) => {
    A.rm = e.matches;
    html.classList.toggle('rm', e.matches);
    if (e.matches) {
      $$('[data-split],[data-reveal]').forEach((x) => x.classList.add('in'));
      if (A.lenis) { A.lenis.destroy(); A.lenis = null; }
      $$('video').forEach((v) => { try { v.pause(); } catch (er) {} });
    } else initLenis();
    d.dispatchEvent(new CustomEvent('ayla:rm', { detail: e.matches }));
    A.measure();
  });
  mqFine.addEventListener('change', (e) => { A.fine = e.matches; });

  // pause CSS loops on hidden tabs
  d.addEventListener('visibilitychange', () => d.body.classList.toggle('paused', d.hidden));

  // ── Arrive at the top ────────────────────────────────────
  // Some hosts and preview frames restore the previous page's scroll position on navigation.
  // Unless the URL has a #section or this is a back/forward visit, every page starts at the top.
  function arriveAtTop() {
    let nav = 'navigate';
    try { nav = performance.getEntriesByType('navigation')[0].type; } catch (e) {}
    if (location.hash || nav === 'back_forward') return;
    let touched = false;
    const mark = () => { touched = true; };
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((e) => addEventListener(e, mark, { passive: true, once: true }));
    const top = () => {
      if (touched || (scrollY === 0 && (!A.lenis || A.lenis.scroll === 0))) return;
      if (A.lenis) A.lenis.scrollTo(0, { immediate: true, force: true });
      scrollTo(0, 0);
      if (A.measure) A.measure();
    };
    top();
    if (document.readyState === 'complete') { setTimeout(top, 150); setTimeout(top, 600); }
    else addEventListener('load', () => { top(); setTimeout(top, 150); setTimeout(top, 600); }, { once: true });
  }

  // ── Boot ──────────────────────────────────────────────────
  function boot() {
    arriveAtTop();
    initLenis();
    initReveals();
    initVisibility();
    initHoverPlay();
    initMenu();
    initPointer();
    initSheen();
    initCopy();
    initTransitions();
    runPreloader(() => { A.playLoad(); d.dispatchEvent(new Event('ayla:ready')); });
    A.measure();
    wake();
    A.booted = true;
    d.dispatchEvent(new Event('ayla:boot'));
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
