import { site, pillars, industries, journey6, journey8, steps, pullQuote, principles, founders, cases, insights, insightCats, credits } from '../content.mjs';
import { page, href, md, esc, btn, ctaBtn, kicker, arrow, mark, crumbs } from '../layout.mjs';
import { media } from '../media.mjs';
import { motif, industryCard, caseRow, faqList, faqLd, insightRows, calculator } from './home.mjs';

// Shared inner-page hero
function pageHero({ k, h1, sub, cls = '', extra = '' }) {
  return `<section class="phero ${cls}">
  <div class="wrap">
    ${kicker(k)}
    <h1 class="h1 h1-page" data-split="load">${md(h1)}</h1>
    ${sub ? `<p class="lede phero-sub" data-reveal>${md(sub)}</p>` : ''}
    ${extra}
  </div>
  <div class="phero-rings" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
</section>`;
}

// ── Services ─────────────────────────────────────────────────
export function services() {
  const subnav = `<nav class="subnav glass" aria-label="Pillars"><ul>${pillars
    .map((p) => `<li><a href="#${p.id}" data-subnav="${p.id}"><span class="mono">${p.n}</span>${p.name}</a></li>`)
    .join('')}</ul></nav>`;
  const blocks = pillars
    .map((p) => `<section class="svc" id="${p.id}" aria-labelledby="svc-${p.id}" data-svc="${p.id}">
    <div class="wrap svc-grid">
      <div class="svc-side">
        <p class="mono">${p.n} / 04</p>
        <h2 class="svc-name" id="svc-${p.id}"><span class="pn-o">${p.name}</span><span class="pn-f" aria-hidden="true">${p.name}</span></h2>
        <p class="svc-promise">${md(p.promise)}</p>
        <div class="svc-motif glass-lite">${motif(p.motif)}</div>
      </div>
      <div class="svc-main">
        <p class="svc-body" data-reveal>${esc(p.body)}</p>
        <div class="svc-leak" data-reveal><span class="mono">The leak it fixes</span><p>${esc(p.leak)}</p></div>
        <div class="svc-cols">
          <div data-reveal><p class="mono">What’s included</p><ul class="tick">${p.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          <div data-reveal><p class="mono">How it connects</p><p>${esc(p.connects)}</p>
            <p class="mono svc-ex-k">Example result</p><p><span class="ph">Placeholder</span> <span class="ph-slot">Client result for ${p.name}</span></p></div>
        </div>
        <a class="svc-q" href="${href('contact')}" data-cta><span>${esc(p.question)}</span>${arrow()}</a>
      </div>
    </div>
  </section>`)
    .join('');
  const journey = `<section class="journey wrap" aria-labelledby="j-h">
    <div class="sec-head">${kicker('One connected journey')}<h2 class="h2" id="j-h" data-split>Every connection <em>counts.</em></h2></div>
    <div class="jtabs" data-tabs>
      <div class="jtab-list" role="tablist" aria-label="Journey stages">${journey6
        .map(([n], i) => `<button role="tab" type="button" id="jt-${i}" aria-controls="jp-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="mono">0${i + 1}</span>${n}</button>`)
        .join('')}</div>
      ${journey6
        .map(([n, good, leak], i) => `<div class="jtab-panel glass-lite" role="tabpanel" id="jp-${i}" aria-labelledby="jt-${i}"${i ? ' hidden' : ''}>
        <p class="jt-good">${esc(good)}</p><p class="jt-leak"><span class="mono">The leak</span>${esc(leak)}</p></div>`)
        .join('')}
    </div>
    <div class="callout" data-reveal><h3>We don’t recommend every service to every business.</h3><p>We diagnose where growth is being lost and build the system around the problem.</p></div>
  </section>`;
  return page({
    id: 'services', title: 'Services',
    desc: 'Create, Acquire, Convert, Automate. Four connected pillars built around where your business is losing revenue.',
    body: pageHero({ k: 'Services / The connected growth model', h1: 'Growth is a *system.*', sub: 'Creative, acquisition, conversion, and automation. Each one makes the other three work harder.', extra: subnav }) + blocks + journey,
    jsonld: [crumbs([['home', 'Home'], ['services', 'Services']])],
    scripts: ['inner.js'],
  });
}

// ── Industries index ─────────────────────────────────────────
export function industriesIndex() {
  return page({
    id: 'industries', title: 'Industries',
    desc: 'Growth systems for automotive, hospitality, and service businesses. Content, ads, websites, and follow-up built around how your customers buy.',
    body: pageHero({ k: 'Industries / Who we work with', h1: 'Built for businesses where every lead has a *name.*', sub: 'Three industries where a fast reply, a clear next step, and a reason to come back decide who gets the customer.' }) +
      `<section class="wrap ind-page-grid"><div class="ind-grid">${industries.map((x, i) => industryCard(x, i, 'h2')).join('')}</div></section>`,
    jsonld: [crumbs([['home', 'Home'], ['industries', 'Industries']])],
  });
}

// ── Industry detail ──────────────────────────────────────────
export function industry(ind) {
  const i = industries.indexOf(ind);
  const sys = pillars
    .map((p, n) => `<li class="isys glass-lite" data-reveal style="--i:${n}"><p class="mono">${p.n} / ${p.name}</p><p>${esc(ind.system[p.id])}</p><a class="link" href="${href('services', p.id)}">About ${p.name}${arrow()}</a></li>`)
    .join('');
  const c = cases.find((x) => x.media === ind.media);
  const others = industries.filter((x) => x !== ind);
  const body = `${pageHero({ k: `Industries / ${ind.name}`, h1: ind.h1, sub: ind.sub, cls: 'phero-ind', extra: `<div class="row">${ctaBtn('btn-lg')}</div>` })}
  <section class="ind-hero-media wrap" aria-hidden="true">${media(ind.media, { cls: 'ihm', eager: true })}</section>
  <section class="wrap pains" aria-labelledby="pain-h">
    <div class="sec-head">${kicker(`${ind.who}`)}<h2 class="h2" id="pain-h" data-split>Where revenue <em>slips.</em></h2></div>
    <ol class="pain-list">${ind.pains.map((p, n) => `<li data-reveal><span class="mono">0${n + 1}</span><p>${esc(p)}</p></li>`).join('')}</ol>
  </section>
  <section class="wrap isys-wrap" aria-labelledby="isys-h">
    <div class="sec-head">${kicker('The recommended system')}<h2 class="h2" id="isys-h" data-split>One system, <em>tuned</em> for ${esc(ind.name.toLowerCase())}.</h2><p class="lede">${esc(ind.build)}</p></div>
    <ul class="isys-grid">${sys}</ul>
  </section>
  ${c ? `<section class="wrap icase" aria-labelledby="icase-h">
    <div class="sec-head">${kicker('Proof')}<h2 class="h2" id="icase-h" data-split>What it looks like in <em>practice.</em></h2></div>
    <div class="cases">${caseRow(c, 0)}</div>
  </section>` : ''}
  <section class="wrap faq-grid faq-ind" aria-labelledby="ifaq-h">
    <div class="faq-side">${kicker('Questions')}<h2 class="h2" id="ifaq-h" data-split>${esc(ind.name)}, <em>answered.</em></h2></div>
    ${faqList(ind.faq)}
  </section>
  <section class="wrap other-inds" aria-label="Other industries">
    ${others.map((o) => `<a class="other-ind glass-lite" href="${href('industries/' + o.id)}"><span class="mono">Also built for</span><b>${esc(o.name)}</b>${arrow()}</a>`).join('')}
  </section>`;
  return page({
    id: 'industries/' + ind.id, title: `${ind.name} marketing agency`,
    desc: `${ind.name} marketing agency for ${ind.who.toLowerCase()}. ${ind.sub}`,
    body,
    jsonld: [faqLd(ind.faq), crumbs([['home', 'Home'], ['industries', 'Industries'], ['industries/' + ind.id, ind.name]])],
  });
}

// ── Work ─────────────────────────────────────────────────────
export function work() {
  return page({
    id: 'work', title: 'Work',
    desc: 'Case studies from AYLA Collective: the challenge, the system we built, and the results in plain numbers.',
    body: pageHero({ k: 'Work / Selected case studies', h1: 'Proof, in *their* numbers.', sub: 'Every case reads the same way: the leak we found, the system we built, and what changed.' }) +
      `<section class="wrap work-page"><p class="ph-note"><span class="ph">Placeholder</span> Results for this project are being finalized. More clients coming soon.</p><div class="cases">${cases.map(caseRow).join('')}</div></section>`,
    jsonld: [crumbs([['home', 'Home'], ['work', 'Work']])],
  });
}

export function caseStudy(c) {
  const body = `${pageHero({ k: `Case study / ${c.industry}`, h1: `${c.client}, *connected.*`, sub: c.about, extra: c.url ? `<div class="row">${btn('Visit ' + c.url.replace(/^https?:\/\//, ''), c.url, 'glass', { attrs: 'target="_blank" rel="noopener"' })}</div>` : '' })}
  <section class="wrap cs-media" aria-hidden="true">${media(c.media, { cls: 'ihm', eager: true })}</section>
  <section class="wrap cs-grid">
    <div class="cs-block" data-reveal><p class="mono">01 / Challenge</p><p class="cs-p">${md(c.challenge)}</p></div>
    <div class="cs-block" data-reveal><p class="mono">02 / Diagnosis</p><p class="cs-p"><span class="ph">Placeholder</span> Where the journey was leaking, and which constraint we fixed first.</p></div>
    <div class="cs-block" data-reveal><p class="mono">03 / What we built</p><p class="cs-p">${md(c.system)}</p></div>
  </section>
  <section class="wrap cs-results" aria-labelledby="cs-r">
    <h2 class="h2" id="cs-r" data-split>The <em>results.</em></h2>
    <ul class="cs-metrics">${c.metrics.map(([v, l]) => `<li data-reveal><b>${md(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>
    <p class="ph-note"><span class="ph">Placeholder</span> Real numbers replace every value above.</p>
  </section>
  <section class="wrap"><a class="next-case glass-lite" href="${href('work')}"><span class="mono">Next</span><b>All work</b>${arrow()}</a></section>`;
  return page({
    id: 'work/' + c.slug, title: `${c.client} case study`,
    desc: `How AYLA Collective worked with ${c.client}. ${c.about || ''}`,
    body, jsonld: [crumbs([['home', 'Home'], ['work', 'Work'], ['work/' + c.slug, c.client]])],
  });
}

// ── Approach ─────────────────────────────────────────────────
export function approach() {
  const diag = `<section class="wrap j8" aria-labelledby="j8-h">
    <div class="sec-head">${kicker('Look at the whole journey')}<h2 class="h2" id="j8-h" data-split>Every stage has a next <em>step.</em></h2>
    <p class="lede">We first understand traffic, conversion rate, lead response, close rate, retention, customer value, and marketing efficiency. Then we identify the most useful place to act.</p></div>
    <div class="j8-diagram" data-j8>
      <ol class="j8-list">${journey8.map(([n], i) => `<li><button type="button" class="j8-node" data-j8-i="${i}" aria-pressed="${i === 3}"><span class="mono">0${i + 1}</span>${esc(n)}</button></li>`).join('')}</ol>
      <div class="j8-panel glass" aria-live="polite"><p class="mono">Common leak at <b data-j8-name>${esc(journey8[3][0])}</b></p><p class="j8-leak" data-j8-leak>${esc(journey8[3][1])}</p></div>
      <script type="application/json" data-j8-data>${JSON.stringify(journey8)}</script>
    </div>
  </section>`;
  const fix = `<section class="bone fixfirst"><div class="wrap fix-grid">
    <div>${kicker('Fix what matters first')}<h2 class="h2" data-split>Improving the wrong stage wastes the right <em>resources.</em></h2></div>
    <div><p class="lede">An excellent campaign cannot repair a broken handoff. A new website cannot create a retention strategy. We look for the constraint, define what improvement means, and build the work around that priority.</p>
    <blockquote class="pull pull-sm"><p>“${esc(pullQuote)}”</p><cite class="mono">AYLA Collective</cite></blockquote></div>
  </div></section>`;
  const process = `<section class="wrap proc" aria-labelledby="proc-h">
    <div class="sec-head">${kicker('Growth without guesswork')}<h2 class="h2" id="proc-h" data-split>Diagnose. Build. Launch. <em>Optimize.</em></h2></div>
    <ol class="proc-grid">${steps.map((s) => `<li class="proc-card glass-lite" data-reveal><p class="mono">${s.n}</p><h3>${s.name}</h3><p>${esc(s.body)}</p><p class="step-get"><span class="mono">You get</span>${esc(s.get)}</p><p class="mono step-time">${md(s.time)}</p></li>`).join('')}</ol>
  </section>`;
  const deliverable = `<section class="wrap dlv" aria-labelledby="dlv-h">
    <div class="dlv-copy">${kicker('The diagnosis')}<h2 class="h2" id="dlv-h" data-split>What you get in <em>writing.</em></h2>
      <p class="lede">A short, plain document your whole team can read. No jargon, no hundred-slide deck.</p></div>
    <div class="dlv-doc glass" data-reveal>
      <div class="dlv-top"><span class="mono">Growth diagnosis</span><span class="mono">Prepared for <span class="ph-slot">Your business</span></span></div>
      <ol>
        <li><span class="mono">01</span><div><b>Your journey, mapped</b><p>Every stage from first impression to repeat visit, with your real numbers.</p></div></li>
        <li><span class="mono">02</span><div><b>The constraint</b><p>The one stage limiting everything after it, and the evidence for it.</p></div></li>
        <li><span class="mono">03</span><div><b>The fix, in order</b><p>What to build first, what can wait, and what you do not need.</p></div></li>
        <li><span class="mono">04</span><div><b>What it should be worth</b><p>A plain estimate of the revenue the fix protects or adds.</p></div></li>
        <li><span class="mono">05</span><div><b>How we’ll measure it</b><p>The handful of numbers we’ll report on, every month.</p></div></li>
      </ol>
    </div>
  </section>`;
  return page({
    id: 'approach', title: 'Approach',
    desc: 'Find the bottleneck across traffic, conversion, lead response, retention, and customer value. Then build the system that fixes it.',
    body: pageHero({ k: 'Approach / Diagnosis before delivery', h1: 'Fix the bottleneck. *Then* scale.', sub: 'The best next move is not always more marketing. It is understanding what stands between your business and its next stage of growth.' }) + diag + fix + process + deliverable,
    jsonld: [crumbs([['home', 'Home'], ['approach', 'Approach']])],
    scripts: ['inner.js'],
  });
}

// ── About ────────────────────────────────────────────────────
export function about() {
  const story = `<section class="wrap story">
    <div class="story-grid">
      <p class="story-lead" data-reveal>AYLA Collective was built around a simple observation: marketing works better when the people, tools, and decisions behind it connect.</p>
      <div class="story-body">
        <p data-reveal>A strong campaign needs a useful destination and a team ready to follow up. So we connect creative, marketing, technology, automation, and measurement into one shared plan.</p>
        <p data-reveal>A clear idea becomes useful content. The content supports acquisition. The infrastructure turns that attention into an opportunity, and keeps it moving.</p>
        <p class="story-close" data-reveal>One view of the customer journey. <em>One system</em> built around your business.</p>
      </div>
    </div>
  </section>`;
  const princ = `<section class="wrap princ" aria-labelledby="pr-h">
    <div class="sec-head">${kicker('What we believe')}<h2 class="h2" id="pr-h" data-split>How we think shapes what we <em>build.</em></h2></div>
    <ol class="princ-grid">${principles.map(([t, d], i) => `<li class="princ-card glass-lite" data-reveal><span class="mono">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
  </section>`;
  const team = `<section class="founders bone" aria-labelledby="f-h">
    <div class="wrap">
      <div class="sec-head">${kicker('The founders')}<h2 class="h2" id="f-h" data-split>Two perspectives. <em>One</em> connected vision.</h2></div>
      <div class="f-grid">${founders.map((f) => `<article class="founder" data-reveal>
        <div class="f-portrait" aria-hidden="true"><span class="f-initial">${f.initial}</span><span class="ph">Portrait coming</span></div>
        <div class="f-body"><h3>${esc(f.name)}</h3><p class="mono">${esc(f.role)}</p><p>${md(f.bio)}</p>${f.linkedin ? `<a class="link" href="${esc(f.linkedin)}" target="_blank" rel="noopener">LinkedIn${arrow()}</a>` : `<span class="ph-slot">LinkedIn link</span>`}</div>
      </article>`).join('')}</div>
    </div>
  </section>`;
  const how = `<section class="wrap how" aria-labelledby="how-h">
    <div class="sec-head">${kicker('Working together')}<h2 class="h2" id="how-h" data-split>No generic packages. No unnecessary <em>services.</em></h2></div>
    <div class="how-grid">
      <div data-reveal><p class="mono">01 / One shared plan</p><p>Every piece of work traces back to the diagnosis, so you always know why something is being built.</p></div>
      <div data-reveal><p class="mono">02 / Plain reporting</p><p>Numbers tied to revenue, reviewed together every month, with a clear next move.</p></div>
      <div data-reveal><p class="mono">03 / Honest scope</p><p>If something won’t move your numbers, we’ll say so, even when it’s something we sell.</p></div>
    </div>
  </section>`;
  return page({
    id: 'about', title: 'About',
    desc: 'A growth partner built to connect creative, marketing, technology, automation, and measurement.',
    body: pageHero({ k: 'About / AYLA Collective', h1: 'Built for businesses that have outgrown disconnected *marketing.*' }) + story + princ + team + how,
    jsonld: [crumbs([['home', 'Home'], ['about', 'About']])],
  });
}

// ── Insights ─────────────────────────────────────────────────
export function insightsIndex() {
  const chips = `<div class="chips" role="group" aria-label="Filter by topic">${insightCats
    .map((c, i) => `<button type="button" class="chip-f" data-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`)
    .join('')}</div>`;
  return page({
    id: 'insights', title: 'Insights',
    desc: 'Perspectives on creative, acquisition, conversion, and connected growth systems.',
    body: pageHero({ k: 'Insights / Thinking behind the system', h1: 'A clearer view of *growth.*', sub: 'Ideas on the connections between creative, marketing, technology, and the customer journey.' }) +
      `<section class="wrap ins ins-page" data-filters>${chips}${insightRows(insights)}<p class="ins-empty mono" hidden>No articles in this topic yet.</p></section>`,
    jsonld: [crumbs([['home', 'Home'], ['insights', 'Insights']])],
    scripts: ['inner.js'],
  });
}

export function article(a) {
  const i = insights.indexOf(a);
  const related = insights.filter((x) => x !== a).slice(0, 3);
  const body = `<div class="readbar" aria-hidden="true"><i data-readbar></i></div>
  <article class="post">
    <header class="wrap post-head">
      <a class="mono back" href="${href('insights')}">← All insights</a>
      <p class="kicker">${String(i + 1).padStart(2, '0')} / ${esc(a.cat)} · Field notes · ${esc(a.read)} read</p>
      <h1 class="h1 h1-post" data-split="load">${esc(a.title)}</h1>
      <p class="lede post-dek" data-reveal>${esc(a.dek)}</p>
    </header>
    <div class="wrap post-grid">
      <aside class="post-aside"><p class="mono">Field notes</p><p class="mono">${esc(a.cat)}</p>${mark('post-mark')}</aside>
      <div class="post-body" data-post-body>
        ${a.body.map(([h, p]) => `${h ? `<h2>${esc(h)}</h2>` : ''}<p>${esc(p)}</p>`).join('')}
        <aside class="post-cta glass"><p class="mono">Where is your journey leaking?</p><p>Run the numbers in two minutes, or talk it through with us.</p><div class="row">${btn('Try the growth audit', href('growth-audit'), 'glass')}${ctaBtn()}</div></aside>
      </div>
    </div>
  </article>
  <section class="wrap ins" aria-labelledby="rel-h"><h2 class="h2 h2-sm" id="rel-h" data-split>Keep <em>reading.</em></h2>${insightRows(related)}</section>`;
  return page({
    id: 'insights/' + a.slug, title: a.title, desc: a.dek, body,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.dek, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } },
      crumbs([['home', 'Home'], ['insights', 'Insights'], ['insights/' + a.slug, a.title]]),
    ],
    scripts: ['inner.js'],
  });
}

// ── Growth audit ─────────────────────────────────────────────
export function growthAudit() {
  return page({
    id: 'growth-audit', title: 'Growth audit',
    desc: 'Estimate how much revenue slow replies, missed follow-up, and one-time customers could be costing your business each month.',
    body: pageHero({ k: 'Growth audit / Two-minute estimate', h1: 'How much revenue is slipping *through?*', sub: 'Move the sliders to match your business. We’ll estimate what slow replies, missed follow-up, and one-time customers could be costing you each month.' }) +
      `<section class="audit audit-page"><div class="wrap">${calculator(true)}</div></section>
      <section class="wrap audit-next"><div class="how-grid">
        <div data-reveal><p class="mono">01 / This is an estimate</p><p>It runs on planning assumptions you can read in “How we estimate this.” It is a starting point, not a verdict.</p></div>
        <div data-reveal><p class="mono">02 / The diagnosis is exact</p><p>We replace every assumption with your real numbers and find the one stage limiting the rest.</p></div>
        <div data-reveal><p class="mono">03 / Your numbers travel with you</p><p>Click “Get the full diagnosis” and the figures above come with your inquiry, so we start where you left off.</p></div>
      </div></section>`,
    jsonld: [crumbs([['home', 'Home'], ['growth-audit', 'Growth audit']])],
    scripts: ['home.js'],
  });
}

// ── Contact ──────────────────────────────────────────────────
export function contact() {
  const chip = (name, val, type = 'radio') => `<label class="chip-in"><input type="${type}" name="${name}" value="${esc(val)}"><span>${esc(val)}</span></label>`;
  const form = `<form class="lead glass" data-lead novalidate>
    <div class="lead-top">
      <p class="mono">Get a growth diagnosis</p>
      <ol class="lead-prog" aria-label="Form progress"><li class="on" data-prog="1"><span>01</span>You</li><li data-prog="2"><span>02</span>Your business</li><li data-prog="3"><span>03</span>Book</li></ol>
    </div>
    <fieldset class="lead-step" data-step="1">
      <legend class="lead-legend">A little about you.</legend>
      <div class="f-grid2">
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required><small>Include your country code.</small></div>
        <div class="field"><label for="f-biz">Business name</label><input id="f-biz" name="business" autocomplete="organization" required></div>
      </div>
      <div class="hp" aria-hidden="true"><label for="f-web">Leave this field empty</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
      <div class="lead-actions">${btn('Continue', '', 'primary', { tag: 'button', type: 'button', cls: 'btn-lg', attrs: 'data-next', dir: 'r' })}</div>
    </fieldset>
    <fieldset class="lead-step" data-step="2" hidden>
      <legend class="lead-legend">Where are you now?</legend>
      <div class="field"><span class="flabel" id="g-ind">Industry</span><div class="chips" role="radiogroup" aria-labelledby="g-ind">${['Automotive', 'Hospitality', 'Service business', 'Other'].map((v) => chip('industry', v)).join('')}</div></div>
      <div class="field"><span class="flabel" id="g-bot">Biggest bottleneck</span><div class="chips" role="group" aria-labelledby="g-bot">${['Not enough leads', 'Leads not converting', 'Slow follow-up', 'Weak creative', 'Not sure'].map((v) => chip('bottleneck', v, 'checkbox')).join('')}</div></div>
      <div class="field"><span class="flabel" id="g-spend">Monthly marketing spend</span><div class="chips" role="radiogroup" aria-labelledby="g-spend">${['Under $2k', '$2k to $5k', '$5k to $15k', '$15k to $50k', '$50k+'].map((v) => chip('spend', v)).join('')}</div></div>
      <div class="field"><span class="flabel" id="g-time">Timeline</span><div class="chips" role="radiogroup" aria-labelledby="g-time">${['As soon as possible', 'In 1 to 3 months', 'Just exploring'].map((v) => chip('timeline', v)).join('')}</div></div>
      <div class="field"><label for="f-msg">Anything else? <span class="opt">Optional</span></label><textarea id="f-msg" name="message" rows="3"></textarea></div>
      <div class="lead-actions"><button type="button" class="link link-back" data-back>← Back</button>${btn('Send inquiry', '', 'primary', { tag: 'button', type: 'submit', cls: 'btn-lg', dir: 'r' })}</div>
    </fieldset>
    <div class="lead-step lead-done" data-step="3" hidden tabindex="-1">
      <p class="lead-legend" data-done-title>Thank you. We’ll be in touch.</p>
      <p data-done-note></p>
      <div class="book glass-lite"><p class="mono">Optional / Pick a time now</p>
        ${site.bookingUrl ? btn('Book a call', site.bookingUrl, 'primary', { attrs: 'target="_blank" rel="noopener"' }) : `<p><span class="ph">Placeholder</span> <span class="ph-slot">Cal.com booking link</span></p>`}
      </div>
    </div>
    <input type="hidden" name="utm" data-utm><input type="hidden" name="audit" data-audit-in>
  </form>`;
  const side = `<div class="contact-side">
    <p class="mono">The right system starts with the right questions</p>
    <h2 class="h2 h2-sm" data-split>Less guesswork. More <em>direction.</em></h2>
    <ol class="c-steps"><li><span class="mono">01</span>Understand your business</li><li><span class="mono">02</span>Find the growth constraint</li><li><span class="mono">03</span>Define the next move</li></ol>
    <p class="mono">No generic packages. No unnecessary services.</p>
    <button class="mail-copy" type="button" data-copy="${site.email}"><span class="mono">${site.email}</span><span class="mail-tip" aria-live="polite">Copy</span></button>
  </div>`;
  return page({
    id: 'contact', title: 'Contact',
    desc: 'Get a growth diagnosis from AYLA Collective. Tell us where you want to go and we’ll find what’s standing in the way.',
    body: pageHero({ k: 'Start a conversation', h1: 'Let’s find your next *move.*', sub: 'Tell us where you want to go. We’ll find what’s standing in the way.' }) +
      `<section class="wrap contact-grid" id="inquiry">${form}${side}</section>${site.formEndpoint ? `<script>window.AYLA_FORM_ENDPOINT=${JSON.stringify(site.formEndpoint)}</script>` : ''}`,
    jsonld: [crumbs([['home', 'Home'], ['contact', 'Contact']])],
    scripts: ['inner.js'],
    next: false,
  });
}

// ── Legal ────────────────────────────────────────────────────
export function privacy() {
  const body = `${pageHero({ k: 'Legal / Privacy', h1: 'How we handle your *information.*' })}
  <section class="wrap prose">
    <p class="ph-note"><span class="ph">Placeholder</span> Draft for AYLA to review before launch.</p>
    <h2>What we collect</h2><p>When you send an inquiry, we collect the details you enter: your name, work email, phone number, business name, and any answers you choose to give about your business. If you used the growth audit, the figures you entered come with your inquiry.</p>
    <h2>How we use it</h2><p>We use your details to reply to your inquiry, prepare for our conversation, and, if we work together, deliver our services. We do not sell your information.</p>
    <h2>Analytics</h2><p>We may use privacy-respecting analytics to understand which pages are useful. We record which campaign brought you to the site so we can tell which marketing works.</p>
    <h2>Your choices</h2><p>You can ask us to see, correct, or delete the information we hold about you at any time by writing to <span class="sel">${site.email}</span>.</p>
  </section>`;
  return page({ id: 'privacy', title: 'Privacy', desc: 'How AYLA Collective handles the information you share with us.', body });
}

export function terms() {
  const creditList = credits.length
    ? `<ul class="credits">${credits.map(([t, s, u]) => `<li><span>${esc(t)}</span><span class="mono">${esc(s)}</span>${u ? `<a class="mono" href="${esc(u)}" target="_blank" rel="noopener">Source</a>` : ''}</li>`).join('')}</ul>`
    : `<p>Footage and photography credits appear here.</p>`;
  const body = `${pageHero({ k: 'Legal / Website information', h1: 'Website *information.*' })}
  <section class="wrap prose">
    <p class="ph-note"><span class="ph">Placeholder</span> Draft for AYLA to review before launch.</p>
    <h2>About this site</h2><p>This website is operated by ${site.name}. Questions about it can go to <span class="sel">${site.email}</span>.</p>
    <h2>Estimates</h2><p>The growth audit gives an estimate based on planning assumptions, which are listed beside it. It is not a guarantee of results.</p>
    <h2>Footage and photography</h2>${creditList}
    <h2>Typefaces</h2><p>Funnel Display, Instrument Sans, Instrument Serif, and Geist Mono, used under the SIL Open Font License.</p>
  </section>`;
  return page({ id: 'terms', title: 'Website information', desc: 'Information about the AYLA Collective website, estimates, and media credits.', body });
}

export function notFound() {
  return page({
    id: '404', title: 'Page not found', desc: 'This page could not be found.',
    body: pageHero({ k: '404 / Page not found', h1: 'This page *leaked.*', sub: 'The link may be old, or the page may have moved.', extra: `<div class="row">${btn('Back to home', href('home'), 'glass')}${ctaBtn()}</div>` }),
    next: false,
  });
}
