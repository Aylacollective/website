import { site, pillars, industries, steps, pullQuote, founders, stats, cases, testimonials, insights, faqs, calc } from '../content.mjs';
import { page, href, asset, md, esc, btn, ctaBtn, kicker, h2, arrow, mark } from '../layout.mjs';
import { media } from '../media.mjs';

export const motif = (kind) => {
  if (kind === 'viewfinder') return `<div class="motif motif-vf" aria-hidden="true">
    <i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>
    <span class="vf-rec mono"><b></b>REC</span><span class="vf-tc mono">4K · 24 FPS</span>
    <i class="vf-focus"></i><i class="vf-bars"><b></b><b></b><b></b><b></b><b></b></i></div>`;
  if (kind === 'radar') return `<div class="motif motif-radar" aria-hidden="true">
    <i class="r r1"></i><i class="r r2"></i><i class="r r3"></i><i class="sweep"></i>
    <b class="dot d1"></b><b class="dot d2"></b><b class="dot d3"></b><b class="dot d4"></b><b class="dot d5"></b>
    <span class="mono radar-tag">Buyers within 15 mi</span></div>`;
  if (kind === 'page') return `<div class="motif motif-page" aria-hidden="true">
    <div class="pg-bar"><i></i><i></i><i></i></div>
    <div class="pg-body"><i class="pg-h"></i><i class="pg-l"></i><i class="pg-l s"></i><span class="pg-cta mono">Book a time</span></div>
    <svg class="pg-cursor" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2-3 6z"/></svg></div>`;
  return `<div class="motif motif-reply" aria-hidden="true">
    <p class="bub in">Is the black one still available?</p>
    <p class="bub out">Yes. Want to see it today at 4?</p>
    <span class="mono reply-tag"><b></b>Replied in 0:04</span></div>`;
};

export function pillarCard(p, i) {
  return `<article class="pillar glass-lite" id="pillar-${p.id}" style="--i:${i}" data-pillar>
    <header class="pillar-top"><span class="mono">${p.n} / 04</span><span class="node" aria-hidden="true"></span></header>
    <h3 class="pillar-name"><span class="pn-o">${p.name}</span><span class="pn-f" aria-hidden="true">${p.name}</span></h3>
    <p class="pillar-promise">${md(p.promise)}</p>
    ${motif(p.motif)}
    <ul class="pillar-items">${p.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <p class="pillar-leak"><span class="mono">Fixes the leak</span>${esc(p.leak)}</p>
    <a class="link" href="${href('services', p.id)}">Explore ${p.name}${arrow()}</a>
  </article>`;
}

export function industryCard(ind, i, headingTag = 'h3') {
  return `<a class="ind-card" href="${href('industries/' + ind.id)}" data-cursor="View" data-hoverplay>
    ${media(ind.media, { cls: 'ind-media' })}
    <div class="ind-body">
      <span class="mono ind-n">0${i + 1}</span>
      <${headingTag} class="ind-name">${esc(ind.name)}</${headingTag}>
      <p class="mono ind-who">${esc(ind.who)}</p>
      <ul class="ind-pains">${ind.pains.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <p class="ind-build"><span class="mono">What we build</span>${esc(ind.build)}</p>
      <span class="link">Explore ${esc(ind.name.toLowerCase())}${arrow()}</span>
    </div>
  </a>`;
}

export function caseRow(c, i) {
  return `<article class="case" data-reveal>
    <a class="case-media" href="${href('work/' + c.slug)}" data-cursor="Play" data-hoverplay tabindex="-1" aria-hidden="true">${media(c.media)}<span class="case-tag mono">${esc(c.industry)}</span></a>
    <div class="case-body">
      <p class="mono">0${i + 1} / ${esc(c.industry)}</p>
      <h3 class="case-client">${md(c.client)}</h3>
      ${c.about ? `<p class="case-about">${esc(c.about)}</p>` : ''}
      <dl class="case-dl">
        <div><dt class="mono">Challenge</dt><dd>${md(c.challenge)}</dd></div>
        <div><dt class="mono">System built</dt><dd>${md(c.system)}</dd></div>
      </dl>
      <ul class="case-metrics">${c.metrics.map(([v, l]) => `<li><b>${md(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>
      <div class="row case-links"><a class="link" href="${href('work/' + c.slug)}">Read the case${arrow()}</a>${c.url ? `<a class="link link-mute" href="${esc(c.url)}" target="_blank" rel="noopener">Visit ${esc(c.url.replace(/^https?:\/\//, ''))}${arrow()}</a>` : ''}</div>
    </div>
  </article>`;
}

export function faqList(items) {
  return `<div class="faq-list">${items
    .map(([q, a]) => `<details class="faq-item"><summary><span>${esc(q)}</span><i aria-hidden="true"></i></summary><div class="faq-a"><p>${esc(a)}</p></div></details>`)
    .join('')}</div>`;
}
export const faqLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export function insightRows(list) {
  return `<ul class="ins-list">${list
    .map((a, i) => `<li data-cat="${esc(a.cat)}"><a class="ins-row" href="${href('insights/' + a.slug)}">
      <span class="mono ins-n">0${i + 1}</span>
      <span class="chip-cat mono">${esc(a.cat)}</span>
      <span class="ins-t"><b>${esc(a.title)}</b><span>${esc(a.dek)}</span></span>
      <span class="ins-arr">${arrow()}</span></a></li>`)
    .join('')}</ul>`;
}

export function calculator(full = false) {
  const d = calc.defaults;
  const respLabels = calc.responseOptions.map((o) => o[0]);
  const slider = (id, label, min, max, step, val, unit = '') => `<div class="sl">
    <div class="sl-top"><label for="c-${id}">${label}</label><output class="mono" for="c-${id}" data-out="${id}"></output></div>
    <input type="range" id="c-${id}" name="${id}" min="${min}" max="${max}" step="${step}" value="${val}" data-calc="${id}">
  </div>`;
  return `<div class="audit-grid" data-audit data-calc-config='${esc(JSON.stringify(calc))}'>
    <div class="audit-in glass">
      <p class="mono audit-step">Your numbers</p>
      ${slider('leads', 'Leads per month', 10, 2000, 10, d.leads)}
      ${slider('response', 'Average first reply', 0, respLabels.length - 1, 1, d.response)}
      ${slider('close', 'Close rate', 1, 60, 1, d.close)}
      ${slider('value', 'Average customer value', 0, 1000, 1, 0)}
      ${slider('repeat', 'Customers who buy again', 0, 80, 1, d.repeat)}
    </div>
    <div class="audit-out glass" aria-live="polite">
      <p class="mono">Estimated revenue at risk, per month</p>
      <p class="audit-total" data-total>$0</p>
      <ul class="audit-break">
        <li><span>Slow first reply</span><b data-b="response">$0</b><i><s data-bar="response"></s></i></li>
        <li><span>Missed follow-up</span><b data-b="followup">$0</b><i><s data-bar="followup"></s></i></li>
        <li><span>One-time customers</span><b data-b="retention">$0</b><i><s data-bar="retention"></s></i></li>
      </ul>
      <details class="assume">
        <summary class="mono">How we estimate this</summary>
        <div class="assume-body">
          <p>This is an estimate built on planning assumptions, not industry statistics. Your diagnosis replaces every one of them with your real numbers.</p>
          <ul>
            <li>Slower first replies lose a share of leads compared with a five-minute reply: ${calc.responseOptions.map(([l, v]) => `${l} ${Math.round(v * 100)}%`).join(', ')}.</li>
            <li>Consistent follow-up lifts closes by ${Math.round(calc.followUpLift * 100)}%, and about half of that is assumed missing today.</li>
            <li>A connected retention flow aims for ${Math.round(calc.targetRepeat * 100)}% repeat customers, with a repeat purchase worth half a first one.</li>
          </ul>
        </div>
      </details>
      ${btn('Get the full diagnosis', href('contact'), 'primary', { cls: 'btn-lg', attrs: 'data-audit-cta data-cta' })}
    </div>
  </div>`;
}

export default function home() {
  const hero = `<section class="hero" data-hero aria-labelledby="hero-h">
  <div class="hero-stage">
    <div class="hero-media" aria-hidden="true">
      <img class="hero-still" src="${asset('img/hero-still.webp')}" alt="" fetchpriority="high" decoding="async" width="1920" height="1080">
      <img class="hero-still hero-still-b" data-src="${asset('img/hero-aligned.webp')}" alt="" decoding="async" width="1920" height="1080">
      <canvas class="hero-canvas" data-hero-canvas></canvas>
      <div class="hero-scrim"></div>
    </div>
    <div class="hero-hud" aria-hidden="true">
      ${pillars.map((p, i) => `<span class="ring-tag mono" style="--i:${i}"><b>${p.n}</b>${p.name}</span>`).join('')}
      <span class="chip sync mono">System sync <b data-sync>012</b>%</span>
    </div>
    <div class="hero-band hero-b1 wrap">
      ${kicker('AYLA / Creative · Marketing · Technology')}
      <h1 class="h1" id="hero-h" data-split="load">Turn attention into <em>revenue.</em></h1>
      <p class="lede hero-sub">Content, ads, websites, and lead follow-up, built as one connected system for automotive, hospitality, and service businesses.</p>
      <div class="row hero-ctas">${ctaBtn('btn-lg')}${btn('See how the system works', '#system', 'glass', { cls: 'btn-lg', dir: 'dr' })}</div>
    </div>
    <div class="hero-band hero-b2 wrap"><p class="b2-line">When everything pulls the same way, growth <em>compounds.</em></p></div>
    <div class="hero-foot wrap">
      <p class="mono">Built for</p>
      <ul class="hero-inds mono"><li>Dealerships</li><li>Detailers</li><li>Auto service</li><li>Restaurants</li><li>Hotels</li><li>Venues</li><li>Home services</li></ul>
      <span class="scroll-cue mono">Scroll<i></i></span>
    </div>
  </div>
</section>`;

  const marqueeItems = ['Dealerships', 'Restaurants', 'Detailers', 'Hotels', 'Auto service', 'Venues', 'Home services', 'Clinics'];
  const marqueeRun = marqueeItems.map((x) => `<span>${x}</span><i aria-hidden="true">${mark('mq-mark')}</i>`).join('');
  const proof = `<section class="proof" aria-labelledby="proof-h">
  <div class="wrap">
    <div class="proof-head">
      ${kicker('02 / Proof')}
      <h2 class="h2 h2-sm" id="proof-h" data-split>Measured in revenue, not <em>reach.</em></h2>
    </div>
    <ul class="stats">${stats.map(([v, l], i) => `<li class="stat glass" style="--i:${i}" data-reveal><b class="stat-v">${md(v)}</b><span class="stat-l">${esc(l)}</span><span class="ph">Placeholder</span></li>`).join('')}</ul>
  </div>
  <div class="marquee" aria-label="Industries we serve"><div class="mq-track">${marqueeRun}${marqueeRun}${marqueeRun}</div></div>
</section>`;

  const leak = `<section class="leak" id="leak" aria-labelledby="leak-h">
  <div class="wrap leak-head">
    ${kicker('03 / The problem')}
    <h2 class="h2" id="leak-h" data-split>Growth rarely stalls. It <em>leaks.</em></h2>
    <p class="lede">Most businesses don’t have a traffic problem. They have a handoff problem. Attention arrives, then slips away between the ad, the website, the reply, and the follow-up.</p>
  </div>
  <div class="wrap leak-stage" data-leak>
    <div class="leak-viz glass-lite">
      <canvas data-leak-canvas aria-hidden="true"></canvas>
      <ol class="leak-stages">${['Attention', 'Leads', 'Follow-up', 'Customers', 'Retention', 'Revenue'].map((s, i) => `<li style="--i:${i}"><span class="mono">0${i + 1}</span>${s}</li>`).join('')}</ol>
      <ul class="leak-labels">${['Weak creative', 'Slow response', 'No follow-up', 'No reason to return'].map((s, i) => `<li style="--i:${i}" data-leak-label><span class="mono">${s}</span></li>`).join('')}</ul>
    </div>
    <div class="leak-controls">
      <div class="leak-meter"><span class="mono">Leads reaching revenue</span><b data-leak-count>29</b><span class="mono">of every 100 · illustration</span></div>
      <button class="hold" type="button" data-hold aria-describedby="hold-hint">
        <span class="hold-ring" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><circle class="hold-prog" cx="24" cy="24" r="21"/></svg>${mark('hold-mark')}</span>
        <span class="hold-label">Hold to connect the system</span>
      </button>
      <p id="hold-hint" class="mono hold-hint">Press and hold. Space or Enter works too.</p>
      <p class="leak-done" data-leak-done>Connected. Every lead has a next step. <button type="button" class="mono leak-reset" data-leak-reset>Reset</button></p>
    </div>
  </div>
</section>`;

  const system = `<section class="system" id="system" data-system aria-labelledby="sys-h">
  <div class="sys-stage">
    <div class="sys-head wrap">
      <div>${kicker('04 / The system')}<h2 class="h2" id="sys-h" data-split>Four disciplines. <em>One</em> system.</h2></div>
      <div class="sys-side"><p class="lede">Creative, acquisition, conversion, and automation. Each one makes the other three work harder.</p><p class="mono sys-count"><b data-sys-count>01</b> / 04</p></div>
    </div>
    <div class="sys-viewport">
      <div class="sys-track" data-sys-track>
        <svg class="sys-line" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 2"><line x1="0" y1="1" x2="100" y2="1" pathLength="1"/></svg>
        ${pillars.map(pillarCard).join('')}
        <div class="sys-end" aria-hidden="true">${mark('sys-end-mark')}<p>Connected.</p></div>
      </div>
    </div>
  </div>
</section>`;

  const inds = `<section class="inds" aria-labelledby="ind-h">
  <div class="wrap">
    <div class="sec-head">${kicker('05 / Who we work with')}<h2 class="h2" id="ind-h" data-split>Built for businesses where every lead has a <em>name.</em></h2></div>
    <div class="ind-grid">${industries.map((x, i) => industryCard(x, i)).join('')}</div>
  </div>
</section>`;

  const approach = `<section class="approach bone" aria-labelledby="app-h">
  <div class="wrap">
    <div class="sec-head">${kicker('06 / The way forward')}<h2 class="h2" id="app-h" data-split>Diagnose first. <em>Then</em> build.</h2><p class="lede">We don’t start with services. We start with the problem.</p></div>
    <div class="app-grid" data-approach>
      <div class="app-num" aria-hidden="true"><span data-app-num>01</span></div>
      <ol class="app-steps">
        <svg class="app-line" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 2 100"><line x1="1" y1="0" x2="1" y2="100" pathLength="1"/></svg>
        ${steps.map((s) => `<li class="step" data-step><span class="node" aria-hidden="true"></span>
          <p class="mono">${s.n} / 04</p><h3>${s.name}</h3><p>${esc(s.body)}</p>
          <p class="step-get"><span class="mono">You get</span>${esc(s.get)}</p>
          <p class="mono step-time">${md(s.time)}</p></li>`).join('')}
      </ol>
    </div>
    <blockquote class="pull" data-reveal><p>“${esc(pullQuote)}”</p><cite class="mono">AYLA Collective</cite></blockquote>
  </div>
</section>`;

  const audit = `<section class="audit" id="audit" aria-labelledby="audit-h">
  <div class="wrap">
    <div class="sec-head audit-head">${kicker('07 / Growth audit')}<h2 class="h2" id="audit-h" data-split>How much revenue is slipping <em>through?</em></h2><p class="lede">Move the sliders to match your business. We’ll estimate what slow replies, missed follow-up, and one-time customers could be costing you each month.</p></div>
    ${calculator()}
  </div>
</section>`;

  const work = `<section class="work" aria-labelledby="work-h">
  <div class="wrap">
    <div class="sec-head row-between">${kicker('08 / Selected work')}<a class="link" href="${href('work')}">All work${arrow()}</a></div>
    <h2 class="h2" id="work-h" data-split>Proof, in <em>their</em> numbers.</h2>
    <p class="ph-note"><span class="ph">Placeholder</span> Results for this project are being finalized. More clients coming soon.</p>
    <div class="cases">${cases.map(caseRow).join('')}</div>
  </div>
</section>`;

  const team = `<section class="founders bone" aria-labelledby="f-h">
  <div class="wrap">
    <div class="sec-head">${kicker('09 / The founders')}<h2 class="h2" id="f-h" data-split>Two perspectives. <em>One</em> connected vision.</h2></div>
    <div class="f-grid">${founders.map((f) => `<article class="founder" data-reveal>
      <div class="f-portrait" aria-hidden="true"><span class="f-initial">${f.initial}</span><span class="ph">Portrait coming</span></div>
      <div class="f-body"><h3>${esc(f.name)}</h3><p class="mono">${esc(f.role)}</p><p>${md(f.bio)}</p>
      ${f.linkedin ? `<a class="link" href="${esc(f.linkedin)}" rel="noopener" target="_blank">LinkedIn${arrow()}</a>` : `<span class="ph-slot">LinkedIn link</span>`}</div>
    </article>`).join('')}</div>
  </div>
</section>`;

  const quotes = `<section class="quotes" aria-labelledby="q-h">
  <div class="wrap row-between q-head">
    <div>${kicker('10 / In their words')}<h2 class="h2" id="q-h" data-split>What clients say <em>after.</em></h2></div>
    <div class="q-ctrl"><button type="button" class="q-btn" data-q-prev aria-label="Previous quote">${arrow('r')}</button><button type="button" class="q-btn" data-q-next aria-label="Next quote">${arrow('r')}</button></div>
  </div>
  <div class="q-viewport" data-carousel data-cursor="Drag" tabindex="0" aria-label="Client quotes, use arrow keys to move">
    <ul class="q-track">${testimonials.map((t) => `<li class="q-card glass-lite"><span class="q-mark" aria-hidden="true">“</span><p>${md(t.quote)}</p><p class="mono q-who">${md(t.name)} · ${md(t.role)}</p></li>`).join('')}</ul>
  </div>
</section>`;

  const ins = `<section class="ins" aria-labelledby="ins-h">
  <div class="wrap">
    <div class="sec-head row-between">${kicker('11 / Insights')}<a class="link" href="${href('insights')}">All insights${arrow()}</a></div>
    <h2 class="h2" id="ins-h" data-split>A clearer view of <em>growth.</em></h2>
    ${insightRows(insights.slice(0, 3))}
  </div>
</section>`;

  const faq = `<section class="faq" aria-labelledby="faq-h">
  <div class="wrap faq-grid">
    <div class="faq-side">${kicker('12 / Questions')}<h2 class="h2" id="faq-h" data-split>Straight <em>answers.</em></h2>
      <p class="lede">Still have a question? Write to us at <span class="sel">${site.email}</span>.</p></div>
    ${faqList(faqs)}
  </div>
</section>`;

  const finalCta = `<section class="final" data-final aria-labelledby="final-h">
  ${media('final', { cls: 'final-media' })}
  <div class="final-type" data-lens-src>
    <h2 class="final-h" id="final-h"><span class="fl fl1">Your next stage</span> <span class="fl fl2"><em>starts here.</em></span></h2>
  </div>
  <div class="lens" aria-hidden="true" data-lens><div class="lens-in"></div></div>
  <div class="final-foot wrap">
    <p class="lede">Tell us where you want to go. We’ll find what’s standing in the way.</p>
    <div class="row">${ctaBtn('btn-lg')}<button class="mail-copy" type="button" data-copy="${site.email}"><span class="mono">${site.email}</span><span class="mail-tip" aria-live="polite">Copy</span></button></div>
  </div>
</section>`;

  return page({
    id: 'home',
    title: 'Home',
    desc: site.description,
    body: [hero, proof, leak, system, inds, approach, audit, work, team, quotes, ins, faq, finalCta].join('\n'),
    jsonld: [faqLd(faqs)],
    scripts: ['home.js'],
    next: false,
    hero3d: true,
  });
}
