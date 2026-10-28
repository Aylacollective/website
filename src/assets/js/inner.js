/* AYLA · inner.js — services sub-nav, journey tabs, approach diagram,
   insights filter, reading bar, multi-step contact form. */
(() => {
  'use strict';
  const start = () => {
    const A = window.AYLA, { $, $$, clamp } = A, d = document;

    // ── Services: sub-nav state + outline-to-fill names ────
    const svcs = $$('[data-svc]');
    if (svcs.length && 'IntersectionObserver' in window) {
      const links = $$('[data-subnav]');
      const io = new IntersectionObserver((ents) => {
        for (const e of ents) {
          if (!e.isIntersecting) continue;
          const id = e.target.dataset.svc;
          links.forEach((l) => l.classList.toggle('on', l.dataset.subnav === id));
        }
      }, { rootMargin: '-45% 0px -50% 0px' });
      svcs.forEach((s) => io.observe(s));
      svcs.forEach((s) => {
        const name = $('.svc-name', s);
        let last = -1;
        A.scrub(s, (p) => {
          const c = A.rm ? 1 : clamp((p - 0.12) / 0.25, 0, 1);
          if (Math.abs(c - last) > 0.004) { last = c; name.style.setProperty('--c', c.toFixed(3)); }
        }, 'pass');
      });
    }

    // ── Journey tabs (ARIA tabs) ────────────────────────────
    $$('[data-tabs]').forEach((root) => {
      const tabs = $$('[role="tab"]', root), panels = $$('[role="tabpanel"]', root);
      const select = (i, focus) => {
        tabs.forEach((t, n) => { t.setAttribute('aria-selected', n === i); t.tabIndex = n === i ? 0 : -1; });
        panels.forEach((p, n) => { p.hidden = n !== i; });
        if (focus) tabs[i].focus();
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(i));
        t.addEventListener('keydown', (e) => {
          const k = e.key;
          if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); select((i + 1) % tabs.length, true); }
          if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
          if (k === 'Home') { e.preventDefault(); select(0, true); }
          if (k === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
        });
      });
    });

    // ── Approach: 8-stage diagram ───────────────────────────
    const j8 = $('[data-j8]');
    if (j8) {
      const data = JSON.parse($('[data-j8-data]', j8).textContent);
      const name = $('[data-j8-name]', j8), leak = $('[data-j8-leak]', j8);
      const nodes = $$('[data-j8-i]', j8);
      const show = (i) => {
        nodes.forEach((n, k) => n.setAttribute('aria-pressed', k === i));
        name.textContent = data[i][0]; leak.textContent = data[i][1];
      };
      nodes.forEach((n, i) => {
        n.addEventListener('click', () => show(i));
        if (A.fine) n.addEventListener('pointerenter', () => show(i));
        n.addEventListener('focus', () => show(i));
      });
    }

    // ── Insights filter ─────────────────────────────────────
    const f = $('[data-filters]');
    if (f) {
      const chips = $$('[data-filter]', f), items = $$('.ins-list li', f), empty = $('.ins-empty', f);
      chips.forEach((c) => c.addEventListener('click', () => {
        const cat = c.dataset.filter;
        chips.forEach((x) => x.setAttribute('aria-pressed', x === c));
        let n = 0;
        items.forEach((li) => { const on = cat === 'All' || li.dataset.cat === cat; li.hidden = !on; if (on) n++; });
        empty.hidden = n > 0;
        A.measure();
      }));
    }

    // ── Article reading bar ─────────────────────────────────
    const bar = $('[data-readbar]'), body = $('[data-post-body]');
    if (bar && body) {
      let last = -1;
      A.scrub(body, (p) => { if (Math.abs(p - last) > 0.002) { last = p; bar.style.setProperty('--rp', p.toFixed(3)); } }, 'pass');
    }

    // ── Contact: multi-step form ────────────────────────────
    const form = $('[data-lead]');
    if (form) {
      const steps = $$('[data-step]', form), prog = $$('[data-prog]', form);
      const endpoint = window.AYLA_FORM_ENDPOINT || '';
      // carry UTMs and the growth audit figures with the inquiry
      try {
        const q = new URLSearchParams(location.search), utm = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => { if (q.get(k)) utm[k] = q.get(k); });
        if (Object.keys(utm).length) { A.store.set('ayla-utm', JSON.stringify(utm)); }
        $('[data-utm]', form).value = A.store.get('ayla-utm') || '';
        if (A.store.get('ayla-audit-go')) $('[data-audit-in]', form).value = A.store.get('ayla-audit') || '';
      } catch (e) {}
      const show = (n) => {
        steps.forEach((s) => { s.hidden = +s.dataset.step !== n; });
        prog.forEach((p) => { const k = +p.dataset.prog; p.classList.toggle('on', k === n); p.classList.toggle('done', k < n); });
        const target = steps.find((s) => +s.dataset.step === n);
        const focusEl = n === 3 ? target : $('input:not([type=hidden]):not([tabindex="-1"]),textarea', target);
        focusEl && setTimeout(() => focusEl.focus({ preventScroll: true }), 60);
        const top = form.getBoundingClientRect().top + A.y - 110;
        if (A.lenis) A.lenis.scrollTo(top, { duration: 0.9 }); else scrollTo({ top, behavior: A.rm ? 'auto' : 'smooth' });
      };
      const validate = (scope) => {
        let ok = true, first = null;
        $$('input[required]', scope).forEach((i) => {
          const field = i.closest('.field');
          let msg = '';
          if (!i.value.trim()) msg = 'Please fill this in.';
          else if (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)) msg = 'Please enter a valid email, like name@business.com.';
          else if (i.type === 'tel' && i.value.replace(/\D/g, '').length < 7) msg = 'Please enter a phone number with its country code.';
          let m = $('.err-msg', field);
          if (msg) {
            ok = false; first = first || i; field.classList.add('err'); i.setAttribute('aria-invalid', 'true');
            if (!m) { m = d.createElement('span'); m.className = 'err-msg'; m.id = i.id + '-err'; field.appendChild(m); i.setAttribute('aria-describedby', m.id); }
            m.textContent = msg;
          } else { field.classList.remove('err'); i.removeAttribute('aria-invalid'); if (m) m.remove(); }
        });
        if (first) first.focus();
        return ok;
      };
      const data = () => {
        const fd = new FormData(form), o = {};
        for (const [k, v] of fd.entries()) { if (o[k]) o[k] = [].concat(o[k], v); else o[k] = v; }
        return o;
      };
      const send = (stage) => {
        const o = data();
        if (o.website) return Promise.resolve(false); // honeypot
        o.stage = stage;
        A.store.set('ayla-lead', JSON.stringify(o));
        if (!endpoint) return Promise.resolve(false);
        return fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(o) })
          .then((r) => r.ok).catch(() => false);
      };
      $('[data-next]', form).addEventListener('click', () => {
        if (!validate(steps[0])) return;
        send('contact'); // the lead is saved even if they stop here
        show(2);
      });
      $('[data-back]', form).addEventListener('click', () => show(1));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validate(steps[0])) { show(1); return; }
        const btn = $('button[type=submit]', form);
        btn.disabled = true; $('.btn-label', btn).textContent = 'Sending';
        send('full').then((sent) => {
          const note = $('[data-done-note]', form), title = $('[data-done-title]', form);
          if (sent) { title.textContent = 'Sent. We’ll be in touch shortly.'; note.textContent = 'A confirmation is on its way to your inbox.'; }
          else if (!endpoint) { title.textContent = 'Thank you.'; note.textContent = 'This preview isn’t connected to an inbox yet, so nothing was sent. Once the form is connected, inquiries go straight to AYLA.'; }
          else { title.textContent = 'Something went wrong.'; note.textContent = 'Your inquiry didn’t send. Please email us directly at hello@aylacollective.co.'; }
          show(3);
          btn.disabled = false; $('.btn-label', btn).textContent = 'Send inquiry';
        });
      });
    }
  };
  if (window.AYLA && window.AYLA.booted) start(); else document.addEventListener('ayla:boot', start, { once: true });
})();
